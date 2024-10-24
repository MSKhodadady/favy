import {
  createItem,
  deleteFile,
  deleteItem,
  readItems,
  readMe,
  updateMe,
  uploadFiles,
} from "@directus/sdk";
import {
  directusServerClient,
  directusUserClientRequestWithAuthCookie,
} from "../lib/server/directusClient";

export const userApi = {
  /* async searchUsername(
    q: string
  ): Promise<{ avatarLink?: string; username: string }[]> {
    const res = await directusPublicClient.request(
      readUsers({
        filter: {
          username: {
            _contains: q,
          },
        },
        fields: ["username", "avatar"],
        limit: 10,
      })
    );

    return res.map((i) => ({
      username: i.username,
      avatarLink: i.avatar == null ? undefined : getDirectusFileLink(i.avatar),
    }));
  }, */

  /* async createUser(ri: RegisterInput) {
    return directusServerClient.request(
      dCreateUser({
        email: ri.email,
        password: ri.password,
        // @ts-ignore
        username: ri.username,
      })
    );
  }, */

  /* async findUserByEmail(email: string, fields = ["*"]) {
    const users = await directusServerClient.request(
      readUsers({
        fields,
        filter: {
          email,
        },
      })
    );
    return users.length == 0 ? null : users[0];
  }, */

  /* async setVerified(email: string) {
    const user = await this.findUserByEmail(email);

    if (user == null) return "user-not-exist";

    return directusServerClient.request(
      updateUser(user["id"], {
        // @ts-ignore
        email_verified: true,
      })
    );
  }, */

  /* async loginEmail(email: string, password: string) {
    return directusUserClient.request(login(email, password));
  }, */

  /* async findUserByUsername(username: string, fields = ["username"]) {
    const users = await directusPublicClient.request(
      readUsers({
        fields,
        filter: {
          username,
        },
      })
    );
    return users.length == 0 ? null : users[0];
  }, */

  //: for logged in users {
  async getCurrentUser(fields = ["id"]) {
    return await directusUserClientRequestWithAuthCookie(readMe({ fields }));
  },

  /* async changeUserDesc(description: string) {
    if (description.length > getUserDescLimit()) {
      throw Error("LONG-DESC");
    }

    await directusUserClientRequestWithAuthCookie(
      updateMe({
        description: description.trim(),
      })
    );
  }, */

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

  async deleteMovie(movieId: string) {
    const currentUser = await this.getCurrentUser();

    const items = await directusUserClientRequestWithAuthCookie(
      readItems("MovieFav", {
        filter: {
          Movie_id: movieId,
          user_id: currentUser.id,
        },
      })
    );

    if (items.length > 0) {
      const movieFavItem = items[0];

      await directusUserClientRequestWithAuthCookie(
        deleteItem("MovieFav", movieFavItem.id)
      );
    }

    return true;
  },
  //: }
};
