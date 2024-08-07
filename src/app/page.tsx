"use client";

import { useRef, useState } from "react";
import AppLogo from "@/public/favy-logo.svg";
import Image from "next/image";

export default function HomePage() {
  const [showSearch, setShowSearch] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-primary pt-3 min-h-lvh overflow-hidden flex flex-col items-center">
      <div
        className="rounded-2xl bg-white flex flex-col text-center py-10 items-center"
        style={{ width: "102%" }}
      >
        <Image src={AppLogo} alt="app logo" className="w-1/2 h-auto" />
        <h1 className="text-5xl my-5">فِیوی</h1>
        <h2 className="text-xl">
          <em>علایقت رو به دوستات نشون بده!</em>
        </h2>
      </div>

      <div className="text-white text-lg mt-3 text-center py-5 space-y-2 p-2 w-full">
        <button type="button" className="btn btn-outline  w-full rounded-full">
          همین الان علایقت رو وارد کن!
        </button>
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
          <div className="flex items-center rounded-full bg-white overflow-clip p-2">
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
              className="input flex-grow text-black ms-2 border-none active:border-none h-100%"
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
