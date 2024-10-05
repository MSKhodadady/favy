import { RegisterInput } from "@/src/app/(sign)/sign-up/page";
import { createHash } from "crypto";
import { cookies } from "next/headers";
import { AUTH_COOKIE_KEY } from "../constants";
import { USER_MAX_FAV_NUM } from "../envLoader";
import { getFileNameExt } from "../utils";
import prisma from "./prisma";
import s3Helper from "./s3";
import {
  createToken,
  getLoginTokenExpireTime,
  verifyToken,
} from "./tokenService";

type PrismaUserSelect = Exclude<
  Parameters<typeof prisma.user.findFirst>[0],
  undefined
>["select"];

const dbTransactions = {
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
          email: true,
          avatar: true,
        },
        take: 5,
      });

      return res;
    },
    async createUser(ri: RegisterInput) {
      const { email, password, passwordRepeat, username } = ri;
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
    async findUserByEmail(email: string) {
      const res = await prisma.user.findFirst({
        where: { email },
        select: { id: true, username: true, email: true },
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
        const user = await this.getCurrentUserDB({ avatar: true });

        if (user == null) return;

        //: remove previous file if exist
        if (user.avatar != null) {
          //: delete s3
          s3Helper.deleteFile(user.avatar);
        }

        const fileName = `avatar_u(${user.username})_t(${Math.floor(
          Date.now() / 1000
        )}).${getFileNameExt(avatarFile.name)}`;

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
      async deleteMovie(movieId: string) {
        const user = await this.getCurrentUser();
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
    async addMovie(name: string, year: string, posterImg: File | null) {},
    async searchMovie(query: string) {},
  },
};

function getPassHash(pass: string) {
  return createHash("SHA256")
    .update(process.env.APP_KEY ?? "a key")
    .digest("base64");
}
