import { getDirectusFileLink } from "@/src/lib/server/directusClient";
import Image from "next/image";
import { MovieDelete } from "../app/u/[username]/MovieDelete";

export function MovieCard(P: {
  id: string;
  posterLink: string;
  name: string;
  startYear?: string;
  endYear: string;
  loggedIn: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-lg flex p-3 relative ${
        P.loggedIn ? "rounded-bl-3xl" : ""
      }`}
    >
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
        <div className="text-lg">
          {P.startYear == P.endYear || P.startYear == undefined
            ? P.endYear
            : `${P.startYear}-${P.endYear}`}
        </div>
      </div>

      {P.loggedIn && <MovieDelete movieId={P.id} />}
    </div>
  );
}
