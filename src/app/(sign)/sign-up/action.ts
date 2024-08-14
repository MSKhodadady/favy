import { createVerificationToken } from "@/src/lib/server/tokenService";
import { RegisterInput } from "./page";
import { sendRegistrationMail } from "@/src/lib/server/emailer";

const WEBSITE_URL = process.env.WEBSITE_URL!;

export async function registerAct(ri: RegisterInput) {
  const jwt = await createVerificationToken(ri.email);

  const link = `${WEBSITE_URL}/sign-up/verify?token=${jwt}`;

  const emailSendRes = await sendRegistrationMail(ri.email, link);

  return emailSendRes;
}
