"use server";

import { moviesApi } from "@/src/api/movies";
import { userApi } from "@/src/api/user";
import { AUTH_COOKIE_KEY, USERNAME_COOKIE_KEY } from "@/src/lib/constants";
import { actionCommonErrChecker } from "@/src/lib/server/actionCommonErrChecker";
import { getUsernameCookie } from "@/src/lib/server/cookieManager";
import { isString } from "@/src/lib/utils";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function revalidateUserPage() {
  revalidatePath(`/u/${getUsernameCookie()}`);
}

export async function signOutAct() {
  const cks = cookies();
  cks.delete(AUTH_COOKIE_KEY);
  cks.delete(USERNAME_COOKIE_KEY);

  redirect("/sign-in");
}

export async function changeUserDescAct(description: string) {
  return actionCommonErrChecker(async () => {
    try {
      await userApi.changeUserDesc(description);

      revalidateUserPage();

      return "success";
    } catch (error: any) {
      if (error?.message == "LONG-DESC") {
        return "long-desc";
      }

      throw error;
    }
  });
}

export async function changeUserAvatarAct(fd: FormData) {
  const avatarFile = fd.get("avatar-img");

  if (avatarFile == null || typeof avatarFile == "string") return "bad-req";

  return actionCommonErrChecker(async () => {
    await userApi.changeAvatar(avatarFile);

    revalidateUserPage();

    return "success";
  });
}

export async function deleteUserAvatarAct() {
  return actionCommonErrChecker(async () => {
    await userApi.deleteAvatar();
    revalidateUserPage();

    return "success";
  });
}

export async function createMovieAct(fd: FormData) {
  const cks = cookies().get(AUTH_COOKIE_KEY)?.value;
  if (!cks) return "no-user";

  const name = fd.get("name");
  const year = fd.get("year");
  const poster = fd.get("poster");

  if (
    (poster != null && typeof poster == "string") ||
    !name ||
    !isString(name) ||
    !year ||
    !isString(year)
  ) {
    return "bad-req";
  }

  return actionCommonErrChecker(async () => {
    const movie = await moviesApi.addMovie(name, year, poster);

    await userApi.addMovie(movie.id);

    revalidateUserPage();

    return "success";
  });
}
