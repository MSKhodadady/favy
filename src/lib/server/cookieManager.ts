import { cookies } from "next/headers";
import { AUTH_COOKIE_KEY, USERNAME_COOKIE_KEY } from "../constants";

export function setCookieFromServer(
  name: string,
  value: string,
  expires: number | Date,
  path = "/"
) {
  cookies().set({
    name,
    value,
    expires,
    path,
  });
}

export function getAuthCookie() {
  return cookies().get(AUTH_COOKIE_KEY)?.value ?? "no-auth";
}

export function getUsernameCookie() {
  return cookies().get(USERNAME_COOKIE_KEY)?.value ?? "";
}
