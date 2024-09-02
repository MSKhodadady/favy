import {
  createUser as dCreateUser,
  login,
  readUsers,
  updateMe,
  updateUser,
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

  async changeUserDesc(description: string) {
    const authCookie = getAuthCookie();

    if (description.length > getUserDescLimit()) {
      throw Error("LONG-DESC");
    }

    await directusUserClient.request(
      withToken(
        authCookie,
        updateMe({
          description,
        })
      )
    );
  },
};
