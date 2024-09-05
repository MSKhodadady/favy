import { moviesApi } from "@/src/api/movies";
import { userApi } from "@/src/api/user";
import { favyLogoWithTitle } from "@/src/lib/client/assets";
import { AUTH_COOKIE_KEY, USERNAME_COOKIE_KEY } from "@/src/lib/constants";
import { getDirectusFileLink } from "@/src/lib/server/directusClient";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignLayout } from "../../(sign)/SignLayout";
import { AvatarPlaceHolder, AvatarViewer } from "./AvatarViewer";
import { ChangeAvatarModal } from "./ChangeAvatarModal";
import { ChangeDescModal } from "./ChangeDescModal";
import { SignOutBtn } from "./SignOutBtn";

export const metadata = {
  title: "صفحه کاربر",
};

export default async function UserPage({
  params: { username },
  searchParams,
}: {
  params: { username?: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  if (username == undefined) redirect("/");

  const serverUser = await userApi.findUserByUsername(username, [
    "id",
    "description",
    "username",
    "fav_movie.Movie_id",
    "avatar",
  ]);

  if (serverUser == null) return <SignLayout title="چنین کاربری وجود ندارد!" />;

  const userMovies = await Promise.all(
    (serverUser.fav_movie as { Movie_id: string }[]).map(({ Movie_id }) =>
      moviesApi.getMovie(Movie_id)
    )
  );

  const cookiesStore = cookies();
  const usernameCookie = cookiesStore.get(USERNAME_COOKIE_KEY)?.value ?? "";
  const authToken = cookiesStore.get(AUTH_COOKIE_KEY)?.value;

  const isLoggedIn = authToken != undefined && username == usernameCookie;

  return (
    <div className="bg-primary">
      <div className=" bg-white rounded-b-2xl">
        <div className="flex flex-row-reverse justify-between  p-3">
          <Link href={"/"}>
            <Image
              src={favyLogoWithTitle}
              alt="favy logo"
              className="w-auto h-10"
            />
          </Link>

          {isLoggedIn && <SignOutBtn />}
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
          {userMovies.map((i) => (
            <MovieCard
              key={i.id}
              name={i.Name}
              startYear={i.start_year}
              endYear={i.end_year}
              posterLink={i.poster}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MovieCard(P: {
  posterLink: string;
  name: string;
  startYear: string;
  endYear: string;
}) {
  return (
    <div className="bg-white rounded-lg flex p-3">
      <div className="bg-white w-32 h-auto relative me-3">
        <Image
          src={getDirectusFileLink(P.posterLink)}
          alt={`"${P.name}" poster`}
          title={`"${P.name}" poster`}
          width={100}
          height={100}
          className="rounded-lg"
        />
      </div>
      <div className="flex flex-col justify-around">
        <div className="text-2xl">{P.name}</div>
        <div className="text-lg">{P.startYear}</div>
      </div>
    </div>
  );
}
