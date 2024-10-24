import { AppLogo, YamaLogo } from "@/src/components/AppLogo";
import { AUTH_COOKIE_KEY, USERNAME_COOKIE_KEY } from "@/src/lib/constants";
import { dbTransactions } from "@/src/lib/server/db";
import { getDirectusFileLink } from "@/src/lib/server/directusClient";
import s3Helper from "@/src/lib/server/s3";
import { logErr } from "@/src/lib/utils";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignLayout } from "../../(sign)/SignLayout";
import {
  AvatarPlaceHolder,
  AvatarViewer,
} from "../../../components/AvatarViewer";
import { MovieCard } from "../../../components/MovieCard";
import { AddMovieModal } from "./AddMovieModal";
import { ChangeAvatarModal } from "./ChangeAvatarModal";
import { ChangeDescModal } from "./ChangeDescModal";
import { SignOutBtn } from "./SignOutBtn";

export const revalidate = 86400;

export const metadata: Metadata = {
  icons: [
    {
      url: "small-logo.svg",
      type: "image/x-icon",
    },
  ],
};

export default async function UserPage({
  params: { username },
}: {
  params: { username?: string };
}) {
  if (username == undefined) redirect("/");

  const serverUser = await (async () => {
    try {
      return await dbTransactions.user.findUserByUsername(username);
    } catch (error) {
      logErr("fetch server user", `/u/${username}`, error);
      return "error";
    }
  })();

  if (serverUser == "error") redirect("/internal-server-error");

  if (serverUser == null) return <SignLayout title="چنین کاربری وجود ندارد!" />;

  const isStorageFilesPublic =
    process.env.STORAGE_S3_BUCKET_IS_PUBLIC == "true";

  const userMovies = await Promise.all(
    serverUser.favMovies.map(async (i) => ({
      ...i.movie,
      posterLink: i.movie.poster
        ? isStorageFilesPublic
          ? s3Helper.getPublicLink(i.movie.poster)
          : await s3Helper.getLink(i.movie.poster)
        : null,
    }))
  );

  const cookiesStore = cookies();
  const usernameCookie = cookiesStore.get(USERNAME_COOKIE_KEY)?.value ?? "";
  const authToken = cookiesStore.get(AUTH_COOKIE_KEY)?.value;

  const isLoggedIn = authToken != undefined && username == usernameCookie;

  return (
    <div className="bg-primary">
      <title>{username}</title>
      <div className=" bg-white rounded-b-2xl">
        <div className="flex flex-row-reverse justify-between items-center p-3">
          <AppLogo />

          {isLoggedIn ? (
            <SignOutBtn />
          ) : (
            <Link
              href="/sign-in"
              type="button"
              className="btn btn-outline btn-primary  rounded-full italic text-xs h-fit min-h-fit py-1 px-1"
            >
              علایقت خودت رو وارد کن!
            </Link>
          )}
        </div>

        <div className="flex flex-col justify-center pt-10 items-center gap-2">
          {/* AVATAR */}
          {isLoggedIn ? (
            <ChangeAvatarModal
              avatarId={serverUser.avatar}
              avatarLink={
                //: FIXME:
                serverUser.avatar ? getDirectusFileLink("---ERROR---") : null
              }
              username={username}
            />
          ) : serverUser.avatar ? (
            <AvatarViewer
              //: FIXME:
              avatarLink={getDirectusFileLink("---ERROR---")}
              username={username}
            />
          ) : (
            <AvatarPlaceHolder />
          )}

          <div className="text-xl font-bold">{serverUser.username}</div>
          {isLoggedIn ? (
            <ChangeDescModal
              username={username}
              desc={serverUser.description ?? ""}
            />
          ) : (
            <div className="w-full px-3 my-3 whitespace-pre-wrap">
              {serverUser.description ?? ""}
            </div>
          )}
        </div>
      </div>

      <div className="bg-primary min-h-screen">
        <div className="p-3">
          <div className="my-3 text-white">فیلم های مورد علاقه</div>
          <div className="flex flex-col gap-2">
            {userMovies.map((i) => (
              <MovieCard
                key={i.id}
                id={i.id}
                name={i.name}
                startYear={i.startYear}
                endYear={i.endYear}
                posterLink={i.posterLink}
                loggedIn={isLoggedIn}
              />
            ))}
            {isLoggedIn && <AddMovieModal />}
          </div>
        </div>
      </div>

      <YamaLogo className="mt-9 pb-3" />
    </div>
  );
}
