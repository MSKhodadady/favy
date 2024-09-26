"use server";

import { userApi } from "../api/user";

export async function searchUsernameAct(q: string) {
  if (q == "") {
    return [];
  }

  const res = await userApi.searchUsername(q);

  return res;
}
