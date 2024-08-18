"use server";

import { AUTH_COOKIE_KEY, USERNAME_COOKIE_KEY } from "@/src/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOutAct() {
  const cks = cookies();
  cks.delete(AUTH_COOKIE_KEY);
  cks.delete(USERNAME_COOKIE_KEY);

  redirect("/sign-in");
}
