import { moviesApi } from "@/src/api/movies";
import { userApi } from "@/src/api/user";
import { favyLogoWithTitle } from "@/src/lib/client/assets";
import { AUTH_COOKIE_KEY, USERNAME_COOKIE_KEY } from "@/src/lib/constants";
import { getDirectusFileLink } from "@/src/lib/server/directusClient";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
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
      return await userApi.findUserByUsername(username, [
        "id",
        "description",
        "username",
        "fav_movie.Movie_id",
        "avatar",
      ]);
    } catch (error) {
      console.error(error);
      return "error";
    }
  })();

  if (serverUser == "error") redirect("/internal-server-error");

  if (serverUser == null) return <SignLayout title="چنین کاربری وجود ندارد!" />;

  const userMovies = (
    await Promise.all(
      (serverUser.fav_movie as { Movie_id: string }[]).map(({ Movie_id }) =>
        moviesApi.getMovie(Movie_id)
      )
    )
  ).filter((i) => i != null);

  const cookiesStore = cookies();
  const usernameCookie = cookiesStore.get(USERNAME_COOKIE_KEY)?.value ?? "";
  const authToken = cookiesStore.get(AUTH_COOKIE_KEY)?.value;

  const isLoggedIn = authToken != undefined && username == usernameCookie;

  return (
    <div className="bg-primary">
      <title>{username}</title>
      <div className=" bg-white rounded-b-2xl">
        <div className="flex flex-row-reverse justify-between items-center p-3">
          <Link href={"/"}>
            <Image
              src={favyLogoWithTitle}
              alt="favy logo"
              className="w-auto h-10"
            />
          </Link>

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
                serverUser.avatar
                  ? getDirectusFileLink(serverUser.avatar)
                  : null
              }
              username={username}
            />
          ) : serverUser.avatar ? (
            <AvatarViewer
              avatarLink={getDirectusFileLink(serverUser.avatar)}
              username={username}
            />
          ) : (
            <AvatarPlaceHolder />
          )}

          <div className="text-xl font-bold">{serverUser.username}</div>
          {isLoggedIn ? (
            <ChangeDescModal
              username={username}
              desc={serverUser.description}
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
                name={i.Name}
                startYear={i.start_year}
                endYear={i.end_year}
                posterLink={i.poster}
                loggedIn={isLoggedIn}
              />
            ))}
            {isLoggedIn && <AddMovieModal />}
          </div>
        </div>
      </div>
    </div>
  );
}
