"useServer";

import { readUsers } from "@directus/sdk";
import { directusServerClient } from "../lib/server/directusClient";

export async function getUser(email: string) {
  const users = await directusServerClient.request(
    readUsers({
      fields: ["phone_num"],
      filter: {
        email,
      },
    })
  );
  return users.length == 0 ? null : users[0];
}
