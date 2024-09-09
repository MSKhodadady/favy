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
  withToken,
} from "@directus/sdk";
import { RegisterInput } from "../app/(sign)/sign-up/page";
import { getAuthCookie } from "../lib/server/cookieManager";
import {
  directusPublicClient,
  directusServerClient,
  directusUserClient,
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
    const authCookie = getAuthCookie();
    if (authCookie == undefined) throw Error("no-such-user");

    const currentUser = await directusUserClient.request(
      withToken(authCookie, readMe({ fields }))
    );
    if (!currentUser) throw Error("no-such-user");

    return { currentUser, authCookie };
  },

  async changeUserDesc(description: string) {
    const authCookie = getAuthCookie();

    if (authCookie == undefined) return;

    if (description.length > getUserDescLimit()) {
      throw Error("LONG-DESC");
    }

    await directusUserClient.request(
      withToken(
        authCookie,
        updateMe({
          description: description.trim(),
        })
      )
    );
  },

  async changeAvatar(avatarFile: File) {
    const authCookie = getAuthCookie();

    if (authCookie == undefined) return;

    const currentUser = await directusUserClient.request(
      withToken(authCookie, readMe({ fields: ["avatar"] }))
    );

    if (!currentUser) throw Error("no-such-user");

    //: delete previous avatar file if exists
    const { avatar } = currentUser;
    if (avatar != null) {
      await directusUserClient.request(
        withToken(authCookie, updateMe({ avatar: null }))
      );
      await directusServerClient.request(deleteFile(avatar));
    }

    //:
    const fd = new FormData();
    fd.append("file", avatarFile);
    const f = await directusServerClient.request(uploadFiles(fd));

    //:
    await directusUserClient.request(
      withToken(authCookie, updateMe({ avatar: f.id }))
    );
  },

  async deleteAvatar() {
    const { currentUser, authCookie } = await this.getCurrentUser(["avatar"]);

    const { avatar } = currentUser;
    if (avatar != null) {
      await directusUserClient.request(
        withToken(authCookie, updateMe({ avatar: null }))
      );
      await directusServerClient.request(deleteFile(avatar));
    }
  },

  async addMovie(movieId: string) {
    const { currentUser, authCookie } = await this.getCurrentUser(["id"]);

    const r = await directusUserClient.request(
      withToken(
        authCookie,
        createItem("MovieFav", {
          Movie_id: movieId,
          user_id: currentUser.id,
        })
      )
    );
  },
  //: }
};
