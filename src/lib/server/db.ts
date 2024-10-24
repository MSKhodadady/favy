import { RegisterInput } from "@/src/app/(sign)/sign-up/page";
import { Movie } from "@prisma/client";
import { createHash } from "crypto";
import { cookies } from "next/headers";
import { AUTH_COOKIE_KEY } from "../constants";
import { USER_MAX_FAV_NUM } from "../envLoader";
import prisma from "./prisma";
import s3Helper, { fileNameGenerator } from "./s3";
import {
  createToken,
  getLoginTokenExpireTime,
  verifyToken,
} from "./tokenService";

type PrismaUserSelect = Exclude<
  Parameters<typeof prisma.user.findFirst>[0],
  undefined
>["select"];

/**
 * This functions, has no validation, has no try-catch (expect some places to discard non-important error).
 */
export const dbTransactions = {
  user: {
    async searchUsername(u: string) {
      const res = await prisma.user.findMany({
        where: {
          username: {
            contains: u,
          },
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
        take: 5,
      });

      return Promise.all(
        res.map(async (i) => ({
          id: i.id,
          username: i.username,
          avatarLink: i.avatar && (await s3Helper.getLink(i.avatar)),
        }))
      );
    },
    async createUser(ri: RegisterInput) {
      const { email, password, username } = ri;
      const res = await prisma.user.create({
        data: {
          username,
          email,
          password: getPassHash(password),
        },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });

      return res;
    },
    async unCreateUser(userId: string) {
      try {
        await prisma.user.delete({
          where: { id: userId },
        });
      } catch (error) {}
    },
    async findUserByEmail(email: string) {
      const res = await prisma.user.findFirst({
        where: { email },
        select: { id: true, username: true, email: true, email_verified: true },
      });

      return res;
    },
    async setVerified(email: string) {
      const res = await prisma.user.update({
        where: {
          email,
        },
        data: {
          email_verified: true,
        },
      });

      return true;
    },
    async loginEmail(email: string, passwordRaw: string) {
      const passHash = getPassHash(passwordRaw);

      const res = await prisma.user.findFirst({
        where: {
          email,
          password: passHash,
          email_verified: true,
        },
        select: {
          email: true,
          username: true,
          id: true,
        },
      });

      if (res != null) {
        const expireTime = getLoginTokenExpireTime();
        const token = await createToken(
          {
            email: res.email,
            username: res.username,
            id: res.id,
          },
          expireTime
        );

        return {
          username: res.username,
          token,
          expireTime,
        };
      } else {
        return null;
      }
    },
    async findUserByUsername(username: string) {
      const res = await prisma.user.findFirst({
        where: { username },
        select: {
          id: true,
          description: true,
          username: true,
          avatar: true,
          favMovies: {
            where: {
              movie: {
                admin_accepted: true,
              },
            },
            select: {
              movie: true,
            },
          },
        },
      });

      return res;
    },

    currentUser: {
      async getCurrentUser() {
        const token = cookies().get(AUTH_COOKIE_KEY)?.value;

        if (token == undefined) return null;

        const payload = await verifyToken(token);

        if (payload == "expired" || payload == "invalid-token") {
          return null;
        }

        return payload;
      },
      async getCurrentUserDB(select?: PrismaUserSelect, withFavMovies = false) {
        const user = await this.getCurrentUser();

        if (user) {
          const res = await prisma.user.findFirst({
            where: { id: user.id },
            select: {
              ...select,
              favMovies: withFavMovies,
            },
          });

          return res;
        } else return null;
      },
      async changeUserDesc(description: string) {
        const user = await this.getCurrentUser();

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              description,
            },
          });
        }
      },
      async changeAvatar(avatarFile: File) {
        const user = await this.getCurrentUserDB({ id: true, avatar: true });

        if (user == null) return;

        //: remove previous file if exist
        if (user.avatar != null) {
          //: delete s3
          s3Helper.deleteFile(user.avatar);
        }

        const fileName = fileNameGenerator.userAvatar(
          user.username,
          avatarFile.name
        );

        //: save file to s3
        s3Helper.uploadFile(avatarFile, fileName);
        //: save file to db
        await prisma.user.update({
          where: { id: user.id },
          data: { avatar: fileName },
        });
      },
      async deleteAvatar() {
        const user = await this.getCurrentUserDB({ avatar: true });

        if (user == null) return;

        //: remove previous file if exist
        if (user.avatar != null) {
          //: delete s3
          s3Helper.deleteFile(user.avatar);

          await prisma.user.update({
            where: { id: user.id },
            data: { avatar: null },
          });
        }
      },
      async addMovie(movieId: number) {
        const user = await this.getCurrentUserDB({}, true);

        if (user == null) return null;

        const m = await dbTransactions.movie.getMovie(movieId);
        if (
          //: movie `m` exists
          m != null &&
          //: user hasn't m in his fav
          user.favMovies.every((i) => i.movieId != m.id) &&
          //: user hasn't max fav
          user.favMovies.length < USER_MAX_FAV_NUM
        ) {
          await prisma.movieFav.create({
            data: {
              userId: user.id,
              movieId: m.id,
            },
          });
        }
      },
      async deleteMovie(movieId: number) {
        const user = await this.getCurrentUser();

        if (user == null) return;
        const mf = await prisma.movieFav.findFirst({
          where: { userId: user.id, movieId },
        });

        if (mf) {
          await prisma.movieFav.delete({
            where: { id: mf.id },
          });
        }
      },
    },
  },

  movie: {
    async getMovie(id: number, select?: object) {
      const m = await prisma.movie.findFirst({
        where: { id },
        select,
      });

      return m;
    },
    async addMovie(
      name: string,
      endYear: number,
      posterImg?: File,
      startYear?: number
    ) {
      //: db
      const m = await prisma.movie.create({
        data: {
          endYear,
          startYear,
          name,
        },
      });

      //: upload file
      if (posterImg) {
        try {
          const fileName = fileNameGenerator.moviePoster(m.id, posterImg.name);
          await s3Helper.uploadFile(posterImg, fileName);
          //: set db poster file id

          await prisma.movie.update({
            where: { id: m.id },
            data: { poster: fileName },
          });
        } catch (error) {
          console.error(error);
        }
      }
    },
    async searchMovie(query: string) {
      const res: Movie & { sim: number } = await prisma.$queryRaw`
        SELECT
          *,
          SIMILARITY(
            concat("name", coalesce ("start_year"::text, ''), "end_year"),
            ${query}
          ) as sim
        FROM "Movie"
        order by sim desc;`;

      return res;
    },
  },
};

function getPassHash(pass: string) {
  const passHashKey = process.env.PASS_HASH_KEY ?? "";
  return createHash("SHA256").update(pass).update(passHashKey).digest("base64");
}

export function dbIsUniqueError(error: any) {
  if (error?.code == "P2002") {
    const target = error?.meta?.target;
    if (Array.isArray(target) && target.length > 1) {
      return { res: true, target: target[0] };
    } else {
      return { res: true, target: null };
    }
  } else {
    return { res: false };
  }
}
