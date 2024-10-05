"use server";

import { userApi } from "@/src/api/user";
import { sendRegistrationMail } from "@/src/lib/server/emailer";
import { WEBSITE_URL } from "@/src/lib/server/envGetter";
import { createToken } from "@/src/lib/server/tokenService";

export async function sendLinkAgainAct(email: string) {
  const user = await userApi.findUserByEmail(email, ["id", "username"]);

  if (user == null) return "user-not-found";

  try {
    const jwt = await createToken({
      email,
      username: user.username,
      id: user.id,
    });
    const link = `${WEBSITE_URL}/sign-up/verify?token=${jwt}`;

    console.info("[/send-link] sending email");
    await sendRegistrationMail(email, link);

    return "success";
  } catch (error) {
    console.error("[/send-link] error:");
    console.error(error);

    return "server-error";
  }
}
