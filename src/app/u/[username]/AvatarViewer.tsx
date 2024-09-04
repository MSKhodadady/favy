import Image from "next/image";
import { ReactNode } from "react";

export function AvatarViewer(P: {
  avatarLink: string;
  username?: string;
  changeMode?: boolean;
}) {
  return (
    <div className={`mask mask-squircle ${P.changeMode ? "w-36" : "w-28"}`}>
      <Image
        src={P.avatarLink}
        alt={P.changeMode ? "change avatar" : `avatar of ${P.username}`}
        width={100}
        height={100}
        className={` object-cover ${P.changeMode ? "w-36 h-36" : "w-28 h-28"}`}
      />
    </div>
  );
}

export function AvatarPlaceHolder(P: { children?: ReactNode }) {
  return (
    <div className="bg-primary mask mask-squircle w-28 h-28 flex justify-center items-center">
      {P.children}
    </div>
  );
}
