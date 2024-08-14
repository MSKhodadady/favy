import jose from "jose";

const APP_KEY = process.env.APP_KEY!;

export async function createVerificationToken(email: string) {
  const jwt = await new jose.SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("favy")
    .setAudience(email)
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(APP_KEY));

  return jwt;
}
