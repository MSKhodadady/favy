"use client";

import AppLogo from "@/public/favy-logo.svg";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { AvatarPlaceHolder, AvatarViewer } from "../components/AvatarViewer";
import { searchUsernameAct } from "./actions";

export default function HomePage() {
  const [showSearch, setShowSearch] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [userSearchResults, setUserSearchResults] = useState(
    [] as { avatarLink?: string; username: string }[]
  );

  const doSearchUsers = useDebouncedCallback((q: string) => {
    if (q == "") {
      setUserSearchResults([]);
    } else {
      searchUsernameAct(q).then(setUserSearchResults);
    }
  }, 1000);

  return (
    <div
      className="
        pt-3 min-h-screen overflow-x-hidden  flex flex-col items-center
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
          <div
            className={`dropdown ${
              userSearchResults.length > 0 ? "dropdown-open" : ""
            }`}
          >
            <form
              className="flex items-center rounded-full bg-white p-2 h-12"
              onSubmit={(e) => {
                e.preventDefault();
                doSearchUsers(searchInputRef.current?.value ?? "");
              }}
              tabIndex={0}
              role="button"
            >
              <button
                type="submit"
                className="btn btn-primary rounded-full  p-3 min-h-fit h-fit "
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
              <input
                type="text"
                ref={searchInputRef}
                onChange={(e) => {
                  doSearchUsers(e.target.value);
                }}
                className="input flex-grow text-black ms-2 border-none active:border-none h-full placeholder:text-sm w-full"
                placeholder="علایق دوستت رو پیدا کن!"
              />
              <button
                type="button"
                className="btn btn-ghost rounded-full text-slate-400 text-lg px-3 pt-2 pb-1 min-h-fit h-fit"
                onClick={() => {
                  if (searchInputRef.current) {
                    searchInputRef.current.value = "";
                  }
                  setShowSearch(false);
                  setUserSearchResults([]);
                }}
              >
                &#10799;
              </button>
            </form>

            {userSearchResults.length > 0 && (
              <ul
                className="dropdown-content z-20  mt-1 pb-8 w-full"
                tabIndex={0}
              >
                <div className="bg-white text-black rounded-box shadow w-full">
                  {userSearchResults.map((i) => (
                    <Link
                      key={i.username}
                      href={`/u/${i.username}`}
                      className="btn btn-ghost flex justify-start p-1"
                    >
                      {i.avatarLink != null ? (
                        <AvatarViewer compact avatarLink={i.avatarLink} />
                      ) : (
                        <AvatarPlaceHolder compact />
                      )}
                      <p>{i.username}</p>
                    </Link>
                  ))}
                </div>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
