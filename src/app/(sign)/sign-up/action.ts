"use server";

import { userApi } from "@/src/api/user";
import { sendRegistrationMail } from "@/src/lib/server/emailer";
import { WEBSITE_URL } from "@/src/lib/server/envGetter";
import { createToken } from "@/src/lib/server/tokenService";
import { hasErrorWithCode } from "@/src/lib/utils";
import { RegisterInput } from "./page";

export async function registerAct(ri: RegisterInput) {
  try {
    console.info("[register-user] create user");
    const user = await userApi.createUser(ri);

    const { email, username } = ri;
    const jwt = await createToken({
      email,
      username,
      id: user.id,
    });

    const link = `${WEBSITE_URL}/sign-up/verify?token=${jwt}`;

    console.info("[register-user] sending email");
    await sendRegistrationMail(ri.email, link);

    return "success";
  } catch (error: any) {
    if (hasErrorWithCode(error, "RECORD_NOT_UNIQUE")) {
      return "user-exist";
    }

    console.error("[register-user] error:");
    console.error(error);

    return "server-error";
  }
}
