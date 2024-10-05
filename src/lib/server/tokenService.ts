import { jwtVerify, SignJWT } from "jose";

const APP_KEY = process.env.APP_KEY!;

type TokenPayload = {
  email: string;
  username: string;
  id: string;
};

export async function createToken(
  payload: TokenPayload,
  expireTime: number | string = "1h"
) {
  const { email } = payload;
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("favy")
    .setAudience(email)
    .setExpirationTime(expireTime)
    .sign(new TextEncoder().encode(APP_KEY));

  return jwt;
}

export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.APP_KEY!);
    const { payload } = await jwtVerify<TokenPayload>(token, secret);

    return payload;
  } catch (error) {
    // @ts-ignore
    if (error?.code === "ERR_JWT_EXPIRED") {
      return "expired";
    }

    return "invalid-token";
  }
}

export function getLoginTokenExpireTime() {
  const nowSeconds = Math.floor(Date.now() / 1000); //: now epoch in seconds
  const LOGIN_EXPIRE_TIME_ADD = Number(process.env.LOGIN_EXPIRE_TIME_ADD);
  const addSeconds = Number.isNaN(LOGIN_EXPIRE_TIME_ADD)
    ? 86400
    : LOGIN_EXPIRE_TIME_ADD;

  const expireTime = nowSeconds + addSeconds;

  return expireTime;
}
