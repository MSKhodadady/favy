"use client";

import {
  AlertContext,
  alertTypeClassName,
} from "@/src/components/AlertProvider";
import {
  LoginDispatchContext,
  LoginStateContext,
} from "@/src/components/LoginProvider";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { LoginButton } from "./LoginButton";

export function AppNavBar() {
  const loginState = useContext(LoginStateContext);
  const loginDispatch = useContext(LoginDispatchContext);

  const alertProvider = useContext(AlertContext);

  const logOut = () => {
    loginDispatch!({ type: "logout" });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const exp = Number(localStorage.getItem("exp"));

    if (token) {
      const nowEpochSeconds = Math.floor(new Date().valueOf() / 1000);
      if (exp >= nowEpochSeconds)
        loginDispatch!({
          type: "login",
          payload: {
            username: localStorage.getItem("username")!,
            token: localStorage.getItem("token")!,
            exp: Number(localStorage.getItem("exp")!),
          },
        });
      else loginDispatch!({ type: "logout" });
    }
  }, []);

  return (
    <nav className="mb-3">
      <ul className="flex bg-gray-200 p-2 rounded-md justify-center">
        <li className="grow text-4xl">
          <Link href={"/"}>&#128253; فِیوی</Link>
        </li>
        {loginState.isLoggedIn ? (
          <div className="dropdown dropdown-hover dropdown-left p-2">
            <label tabIndex={0} className="text-lg">
              Hello{" "}
              <span className="inline font-bold">{loginState.username}</span>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href={`/u/${loginState.username}`}>صفحه کاربر</Link>
              </li>
              <li>
                <a onClick={logOut}>خروج</a>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <li>
              <LoginButton text="ورود" link="/sign-in" />
            </li>
            <li>
              <LoginButton text="ثبت نام" link="/sign-up"></LoginButton>
            </li>
          </>
        )}
      </ul>
      {alertProvider.alertState.show && (
        <div
          className={
            "alert z-10 left-6 bottom-6 w-fit fixed" +
            " " +
            alertTypeClassName(alertProvider.alertState.type)
          }
        >
          <p>{alertProvider.alertState.text}</p>
        </div>
      )}
    </nav>
  );
}
