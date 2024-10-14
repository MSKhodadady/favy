"use server";

import { dbTransactions } from "../lib/server/db";

export async function searchUsernameAct(q: string) {
  if (q == "") {
    return [];
  }

  const res = await dbTransactions.user.searchUsername(q);

  return res;
}
