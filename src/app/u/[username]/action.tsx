"use server";

import {
  AUTH_COOKIE_KEY,
  USER_AVATAR_MAX_VOLUME,
  USER_DESC_CHART_COUNT,
  USER_DESC_LINE_COUNT,
  USERNAME_COOKIE_KEY,
} from "@/src/lib/constants";
import { actionCommonErrChecker } from "@/src/lib/server/actionCommonErrChecker";
import { getUsernameCookie } from "@/src/lib/server/cookieManager";
import { dbTransactions } from "@/src/lib/server/db";
import s3Helper from "@/src/lib/server/s3";
import { isString } from "@/src/lib/utils";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function revalidateUserPage() {
  revalidatePath(`/u/${getUsernameCookie()}`);
}

export async function searchMovieAct(q: string) {
  const res = await dbTransactions.movie.searchMovie(q);

  const newRes = res.map(({ id, name, end_year, poster }) => ({
    id,
    name,
    endYear: end_year,
    posterLink: poster ? s3Helper.getPublicLink(poster) : null,
  }));

  return newRes;
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
  return actionCommonErrChecker(async () => {
    const avatarFile = fd.get("avatar-img");

    if (avatarFile == null || typeof avatarFile == "string")
      return "bad-req" as const;

    if (avatarFile.size > USER_AVATAR_MAX_VOLUME) return "high-volume" as const;

    await dbTransactions.user.currentUser.changeAvatar(avatarFile);

    revalidateUserPage();

    return "success" as const;
  });
}

export async function deleteUserAvatarAct() {
  return actionCommonErrChecker(async () => {
    await dbTransactions.user.currentUser.deleteAvatar();
    revalidateUserPage();

    return "success";
  });
}

export async function createMovieAct(fd: FormData) {
  return actionCommonErrChecker(async () => {
    const name = fd.get("name");
    const year = fd.get("year");
    const poster = fd.get("poster");

    if (
      (poster != null &&
        (typeof poster == "string" || poster.size > USER_AVATAR_MAX_VOLUME)) ||
      //
      !name ||
      !isString(name) ||
      //
      !year ||
      !isString(year) ||
      Number.isNaN(Number(year))
    ) {
      return "bad-req";
    }

    const movie = await dbTransactions.movie.addMovie(
      name,
      Number(year),
      poster
    );

    if (movie == null) return "log-out";

    await dbTransactions.user.currentUser.addMovie(movie.id);

    revalidateUserPage();

    if (movie.message == "movie-exists") {
      return "movie-exists";
    } else {
      return "success";
    }
  });
}

export async function addMovieAct(movieId: number) {
  return actionCommonErrChecker(async () => {
    await dbTransactions.user.currentUser.addMovie(movieId);
    revalidateUserPage();
    return "success";
  });
}

export async function deleteMovieFromUserAct(movieId: number) {
  return actionCommonErrChecker(async () => {
    await dbTransactions.user.currentUser.deleteMovie(movieId);

    revalidateUserPage();
    return "success";
  });
}
