"use server";

import { AUTH_COOKIE_KEY, USERNAME_COOKIE_KEY } from "@/src/lib/constants";
import { setCookieFromServer } from "@/src/lib/server/cookieManager";
import { dbTransactions } from "@/src/lib/server/db";

export async function loginAct(email: string, password: string) {
  try {
    const loginData = await dbTransactions.user.loginEmail(email, password);

    if (loginData == null) return { mode: "not-correct" };

    setCookieFromServer(
      AUTH_COOKIE_KEY,
      loginData.token,
      new Date(Date.now() + loginData.expireTime)
    );

    setCookieFromServer(
      USERNAME_COOKIE_KEY,
      loginData.username,
      new Date(Date.now() + loginData.expireTime)
    );

    return { mode: "success", username: loginData.username };
  } catch (error) {
    console.error("[/sign-in]");
    console.error(error);

    return { mode: "server-error" };
  }
}
