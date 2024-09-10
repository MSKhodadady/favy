import {
  createItem,
  createUser as dCreateUser,
  deleteFile,
  login,
  readMe,
  readUsers,
  updateMe,
  updateUser,
  uploadFiles,
} from "@directus/sdk";
import { RegisterInput } from "../app/(sign)/sign-up/page";
import {
  directusPublicClient,
  directusServerClient,
  directusUserClient,
  directusUserClientRequestWithAuthCookie,
} from "../lib/server/directusClient";
import { getUserDescLimit } from "../lib/server/envGetter";

export const userApi = {
  async createUser(ri: RegisterInput) {
    return directusServerClient.request(
      dCreateUser({
        email: ri.email,
        password: ri.password,
        // @ts-ignore
        username: ri.username,
      })
    );
  },

  async findUserByEmail(email: string, fields = ["*"]) {
    const users = await directusServerClient.request(
      readUsers({
        fields,
        filter: {
          email,
        },
      })
    );
    return users.length == 0 ? null : users[0];
  },

  async setVerified(email: string) {
    const user = await this.findUserByEmail(email);

    if (user == null) return "user-not-exist";

    return directusServerClient.request(
      updateUser(user["id"], {
        // @ts-ignore
        email_verified: true,
      })
    );
  },

  async loginEmail(email: string, password: string) {
    return directusUserClient.request(login(email, password));
  },

  async findUserByUsername(username: string, fields = ["username"]) {
    const users = await directusPublicClient.request(
      readUsers({
        fields,
        filter: {
          username,
        },
      })
    );
    return users.length == 0 ? null : users[0];
  },

  //: for logged in users {
  async getCurrentUser(fields: string[]) {
    return await directusUserClientRequestWithAuthCookie(readMe({ fields }));
  },

  async changeUserDesc(description: string) {
    if (description.length > getUserDescLimit()) {
      throw Error("LONG-DESC");
    }

    await directusUserClientRequestWithAuthCookie(
      updateMe({
        description: description.trim(),
      })
    );
  },

  async changeAvatar(avatarFile: File) {
    const currentUser = await this.getCurrentUser(["avatar"]);

    //: delete previous avatar file if exists
    const { avatar } = currentUser;
    if (avatar != null) {
      await directusUserClientRequestWithAuthCookie(updateMe({ avatar: null }));
      await directusServerClient.request(deleteFile(avatar));
    }

    //:
    const fd = new FormData();
    fd.append("file", avatarFile);
    const f = await directusServerClient.request(uploadFiles(fd));

    //:
    await directusUserClientRequestWithAuthCookie(updateMe({ avatar: f.id }));
  },

  async deleteAvatar() {
    const currentUser = await this.getCurrentUser(["avatar"]);

    const { avatar } = currentUser;
    if (avatar != null) {
      await directusUserClientRequestWithAuthCookie(updateMe({ avatar: null }));
      await directusServerClient.request(deleteFile(avatar));
    }
  },

  async addMovie(movieId: string) {
    const currentUser = await this.getCurrentUser(["id", "fav_movie.Movie_id"]);

    if (
      !(currentUser.fav_movie as { Movie_id: string }[]).some(
        ({ Movie_id }) => Movie_id == movieId
      )
    ) {
      const r = await directusUserClientRequestWithAuthCookie(
        createItem("MovieFav", {
          Movie_id: movieId,
          user_id: currentUser.id,
        })
      );
    }
  },
  //: }
};
