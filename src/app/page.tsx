"use client";

import AppLogo from "@/public/favy-logo.svg";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export default function HomePage() {
  const [showSearch, setShowSearch] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="
        pt-3 min-h-lvh overflow-hidden flex flex-col items-center
        md:flex-row
      "
      style={{
        background: "linear-gradient(134.68deg, #D76161 0.56%, #A70000 100%)",
      }}
    >
      <div
        className="
          w-full md:w-1/2 md:p-5
        "
      >
        <div
          className="
           rounded-2xl bg-white flex flex-col text-center py-10 items-center w-[102%] 
          "
        >
          <Image src={AppLogo} alt="app logo" className="w-1/2 h-auto" />
          <h1 className="text-5xl my-5">فِیوی</h1>
          <h2 className="text-xl">
            <em>علایقت رو با دوستات به اشتراک بذار!</em>
          </h2>
        </div>
      </div>

      <div
        className="
          text-white text-lg mt-3 text-center py-5 gap-2 p-2 w-full
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
        {!showSearch ? (
          <button
            type="button"
            className="btn btn-outline  w-full rounded-full"
            onClick={() => {
              setShowSearch(true);
              setTimeout(() => {
                searchInputRef.current?.focus();
              });
            }}
          >
            علایق دوستت رو پیدا کن!
          </button>
        ) : (
          <div className="flex items-center rounded-full bg-white p-2">
            <button
              type="button"
              className="btn btn-primary rounded-full  p-3 min-h-fit h-fit "
            >
              &#128269;
            </button>
            <input
              type="text"
              ref={searchInputRef}
              name=""
              id=""
              className="input flex-grow text-black ms-2 border-none active:border-none h-100% placeholder:text-sm w-full"
              placeholder="علایق دوستت رو پیدا کن!"
            />
            <button
              type="button"
              className="btn btn-ghost rounded-full text-slate-400 text-lg px-3 pt-2 pb-1 min-h-fit h-fit"
              onClick={() => setShowSearch(false)}
            >
              &#10799;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
