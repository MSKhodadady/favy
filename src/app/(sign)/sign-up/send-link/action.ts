"use server";

import { dbTransactions } from "@/src/lib/server/db";
import { sendRegistrationMail } from "@/src/lib/server/emailer";
import { WEBSITE_URL } from "@/src/lib/server/envGetter";
import { createToken } from "@/src/lib/server/tokenService";

export async function sendLinkAgainAct(email: string) {
  const user = await dbTransactions.user.findUserByEmail(email);

  if (user == null) return "user-not-found";

  if (user.email_verified) return "verified;";

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
