"use server";

import { dbIsUniqueError, dbTransactions } from "@/src/lib/server/db";
import { sendRegistrationMail } from "@/src/lib/server/emailer";
import { WEBSITE_URL } from "@/src/lib/server/envGetter";
import { createToken } from "@/src/lib/server/tokenService";
import { RegisterInput } from "./page";

export async function registerAct(ri: RegisterInput) {
  const user = await (async () => {
    try {
      console.info("[register-user] create user");
      const user = await dbTransactions.user.createUser(ri);

      return user;
    } catch (error: any) {
      if (dbIsUniqueError(error).res) {
        return "user-exist";
      }

      console.error("[register-user][create] error:");
      console.error(error);
      return "server-error";
    }
  })();

  if (user == "server-error" || user == "user-exist") return user;

  const { email, username } = ri;
  const jwt = await createToken({
    email,
    username,
    id: user.id,
  });

  try {
    const link = `${WEBSITE_URL}/sign-up/verify?token=${jwt}`;

    console.info("[register-user] sending email");
    await sendRegistrationMail(ri.email, link);

    return "success";
  } catch (error) {
    //: remove user if created
    await dbTransactions.user.unCreateUser(user.id);

    console.error("[register-user][send email] error:");
    console.error(error);

    return "server-error";
  }
}
