"use server";

import { userApi } from "@/src/api/user";
import { AUTH_COOKIE_KEY, USERNAME_COOKIE_KEY } from "@/src/lib/constants";
import { setCookieFromServer } from "@/src/lib/server/cookieManager";
import { hasErrorWithCode } from "@/src/lib/utils";

export async function loginAct(email: string, password: string) {
  try {
    const user = await userApi.findUserByEmail(email, [
      "username",
      "email_verified",
    ]);

    if (user == null) return { mode: "not-correct" };

    if (!user.email_verified) return { mode: "email-not-verified" };

    const loginData = await userApi.loginEmail(email, password);

    setCookieFromServer(
      AUTH_COOKIE_KEY,
      loginData.access_token ?? "",
      new Date(Date.now() + (loginData.expires ?? 900000))
    );

    setCookieFromServer(
      USERNAME_COOKIE_KEY,
      user.username,
      new Date(Date.now() + (loginData.expires ?? 900000))
    );

    return { mode: "success", username: user.username };
  } catch (error) {
    if (hasErrorWithCode(error, "INVALID_CREDENTIALS")) {
      return { mode: "not-correct" };
    }

    console.error("[/sign-in]");
    console.error(error);

    return { mode: "server-error" };
  }
}
