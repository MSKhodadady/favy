import Image from "next/image";
import { ReactNode } from "react";

export function AvatarViewer(P: {
  avatarLink: string;
  username?: string;
  changeMode?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="avatar">
      <div
        className={`mask mask-squircle  ${
          P.changeMode ? "w-36" : P.compact ? "w-10" : "w-28"
        }`}
      >
        <Image
          src={P.avatarLink}
          alt={P.changeMode ? "change avatar" : `avatar of ${P.username}`}
          width={100}
          height={100}
          className={` object-cover ${
            P.changeMode ? "w-36 h-36" : P.compact ? "w-10 h-10" : "w-28 h-28"
          }`}
        />
      </div>
    </div>
  );
}

export function AvatarPlaceHolder(P: {
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`bg-primary mask mask-squircle ${
        P.compact ? "w-10 h-10" : "w-28 h-28"
      } flex justify-center items-center`}
    >
      {P.children}
    </div>
  );
}
