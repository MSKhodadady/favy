"use server";

import { moviesApi } from "@/src/api/movies";
import { userApi } from "@/src/api/user";
import {
  AUTH_COOKIE_KEY,
  USER_DESC_CHART_COUNT,
  USER_DESC_LINE_COUNT,
  USERNAME_COOKIE_KEY,
} from "@/src/lib/constants";
import { actionCommonErrChecker } from "@/src/lib/server/actionCommonErrChecker";
import { getUsernameCookie } from "@/src/lib/server/cookieManager";
import { dbTransactions } from "@/src/lib/server/db";
import { getDirectusFileLink } from "@/src/lib/server/directusClient";
import { isString } from "@/src/lib/utils";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function revalidateUserPage() {
  revalidatePath(`/u/${getUsernameCookie()}`);
}

export async function searchMovieAct(q: string) {
  const res = await moviesApi.searchMovie(q);
  return res.map((i) => ({
    id: i.id,
    name: i.Name,
    endYear: i.end_year,
    posterLink: getDirectusFileLink(i.poster),
  }));
}

//: NEED LOGIN ACTION ---------------------------------------------------------
export async function signOutAct() {
  const cks = cookies();
  cks.delete(AUTH_COOKIE_KEY);
  cks.delete(USERNAME_COOKIE_KEY);

  redirect("/sign-in");
}

export async function changeUserDescAct(description: string) {
  return actionCommonErrChecker(async () => {
    const _desc = description.trim();
    if (
      _desc.length > USER_DESC_CHART_COUNT ||
      _desc.split("\n").length > USER_DESC_LINE_COUNT
    ) {
      return "long-desc";
    }

    try {
      await dbTransactions.user.currentUser.changeUserDesc(_desc);

      revalidateUserPage();

      return "success";
    } catch (error: any) {
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

export async function addMovieAct(movieId: string) {
  return actionCommonErrChecker(async () => {
    await userApi.addMovie(movieId);
    revalidateUserPage();
    return "success";
  });
}

export async function deleteMovieFromUserAct(movieId: string) {
  return actionCommonErrChecker(async () => {
    const res = await userApi.deleteMovie(movieId);

    revalidateUserPage();
    return "success";
  });
}
