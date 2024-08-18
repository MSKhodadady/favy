"use client";

import { signOutAct } from "./action";

export default function UserPage() {
  return (
    <div>
      <p>Hello!</p>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={async () => {
          await signOutAct();
        }}
      >
        خروج
      </button>
    </div>
  );
}
