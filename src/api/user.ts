import {
  createUser as dCreateUser,
  login,
  readUsers,
  updateUser,
} from "@directus/sdk";
import {
  directusClient,
  directusServerClient,
} from "../lib/server/directusClient";
import { RegisterInput } from "../app/(sign)/sign-up/page";

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
    return directusClient.request(login(email, password));
  },
};
