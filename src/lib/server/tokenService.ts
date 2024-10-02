import { jwtVerify, SignJWT } from "jose";

const APP_KEY = process.env.APP_KEY!;

type EmailVerificationTokenPayload = {
  email: string;
  username: string;
};

export async function createVerificationToken({
  email,
  username,
}: EmailVerificationTokenPayload) {
  const jwt = await new SignJWT({ email, username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("favy")
    .setAudience(email)
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(APP_KEY));

  return jwt;
}

export async function verifyEmailVerificationToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.APP_KEY!);
    const { payload } = await jwtVerify<EmailVerificationTokenPayload>(
      token,
      secret
    );

    return payload;
  } catch (error) {
    // @ts-ignore
    if (error?.code === "ERR_JWT_EXPIRED") {
      return "expired";
    }

    return "invalid-token";
  }
}
