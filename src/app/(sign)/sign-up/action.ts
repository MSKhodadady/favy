"use server";

import { directusServerClient } from "@/src/lib/server/directusClient";
import { sendRegistrationMail } from "@/src/lib/server/emailer";
import { createVerificationToken } from "@/src/lib/server/tokenService";
import { createUser } from "@directus/sdk";
import { RegisterInput } from "./page";
import { WEBSITE_URL } from "@/src/lib/server/envGetter";
import { hasErrorWithCode } from "@/src/lib/utils";

export async function registerAct(ri: RegisterInput) {
  const jwt = await createVerificationToken(ri);
  const link = `${WEBSITE_URL}/sign-up/verify?token=${jwt}`;

  try {
    console.info("[register-user] create user");
    await directusServerClient.request(
      createUser({
        email: ri.email,
        password: ri.password,
        // @ts-ignore
        username: ri.username,
      })
    );

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
