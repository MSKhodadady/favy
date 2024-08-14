"use server";

import { getUser } from "@/src/api/user";
import { redirect } from "next/navigation";

const phoneNumVerified = (phoneNum: string) =>
  typeof phoneNum == "string" && /09[0-9]{9}/.test(phoneNum);

export async function phoneSendAct(phoneNum: string) {
  if (!phoneNumVerified) return;

  getRand(phoneNum);
}

export async function randVerify(
  phonNum: string,
  randObj: RandObj,
  rand: string
) {
  if (!phoneNumVerified) return;
  if (
    typeof randObj.objHash != "string" ||
    typeof randObj.objStr != "string" ||
    typeof rand != "string"
  )
    return;

  const randVerified = verifyRand(rand, randObj);

  if (randVerified != "correct") return randVerified;

  const user = getUser(phonNum);

  if (!user) redirect("/register");
  else {
  }
}
