"use client";

import { ShutdownIcon } from "@/src/components/icons/ShutDown";
import { signOutAct } from "./action";

export function SignOutBtn() {
  return (
    <button
      type="button"
      className="btn btn-primary min-h-fit
      bg-primary w-10 h-10 p-1 rounded-full"
      onClick={async () => {
        await signOutAct();
      }}
    >
      <ShutdownIcon className="w-full h-full fill-white" />
    </button>
  );
}
