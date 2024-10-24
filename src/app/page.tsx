"use client";

import AppLogo from "@/public/favy-logo.svg";
import Image from "next/image";
import Link from "next/link";

import { YamaLogo } from "../components/AppLogo";
import { SearchUsername } from "./SearchUsername";

export default function HomePage() {
  return (
    <div
      className="min-h-screen overflow-x-hidden w-full flex flex-col"
      style={{
        background: "linear-gradient(134.68deg, #D76161 0.56%, #A70000 100%)",
      }}
    >
      <div className="pt-3 flex-grow flex flex-col items-center md:flex-row">
        <div className="w-full md:w-1/2 md:p-5">
          <div className="rounded-2xl bg-white flex flex-col text-center py-10 items-center w-[102%]">
            <Image src={AppLogo} alt="app logo" className="w-1/2 h-auto" />
            <h1 className="text-5xl my-5">فِیوی</h1>
            <h2 className="text-xl">
              <em>علایقت رو با دوستات به اشتراک بذار!</em>
            </h2>
          </div>
        </div>

        <div
          className="text-white text-lg mt-3 text-center py-5 gap-2 p-2 w-full
          flex flex-col items-stretch justify-center
          md:w-1/2 md:p-3"
        >
          <Link href={"/sign-in"}>
            <button
              type="button"
              className="btn btn-outline  w-full rounded-full"
            >
              همین الان علایقت رو وارد کن!
            </button>
          </Link>
          <div>یا</div>
          <SearchUsername />
        </div>
      </div>

      <YamaLogo className="mt-9 mb-3" />
    </div>
  );
}
