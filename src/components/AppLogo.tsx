"use client";

import Image from "next/image";
import Link from "next/link";
import { favyLogoWithTitle, yamaLogo } from "../lib/client/assets";

export function AppLogo() {
  return (
    <Link href={"/"}>
      <Image src={favyLogoWithTitle} alt="favy logo" className="w-auto h-10" />
    </Link>
  );
}

export function YamaLogo(P: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center text-white  ${
        P.className ?? ""
      }`}
    >
      <div className="me-3">محصولی از</div>
      <Image src={yamaLogo} alt="yama logo" className="w-7 h-7" />
    </div>
  );
}

export function AppLogoWithTitle() {
  return (
    <Image
      src={favyLogoWithTitle}
      alt="favy logo with title"
      className="w-2/3 h-auto"
    />
  );
}
