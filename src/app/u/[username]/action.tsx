"use server";

import { userApi } from "@/src/api/user";
import { AUTH_COOKIE_KEY, USERNAME_COOKIE_KEY } from "@/src/lib/constants";
import { getUsernameCookie } from "@/src/lib/server/cookieManager";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOutAct() {
  const cks = cookies();
  cks.delete(AUTH_COOKIE_KEY);
  cks.delete(USERNAME_COOKIE_KEY);

  redirect("/sign-in");
}

export async function changeUserDescAct(description: string) {
  try {
    await userApi.changeUserDesc(description);

    revalidatePath(`/u/${getUsernameCookie()}`);

    return "success";
  } catch (error: any) {
    if (error?.message == "LONG-DESC") {
      return "long-desc";
    } else {
      return "internal-error";
    }
  }
}
