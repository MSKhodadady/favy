import { cookies } from "next/headers";

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
