"use client";

import { useShowAlert } from "@/src/lib/client/hooks/useShowAlert";
import { useEffect, useState } from "react";
import { changeUserDescAct } from "./action";

export function ChangeDescModal(P: { username: string; desc: string }) {
  const [description, setDescription] = useState(P.desc);
  const { showAlert } = useShowAlert();

  useEffect(() => {
    setDescription(P.desc);
  }, [P.desc]);

  function onClick() {
    return (
      document.getElementById("change_user_desc_modal") as HTMLDialogElement
    ).showModal();
  }

  return (
    <>
      {P.desc ? (
        <div className="w-full px-3 my-3">
          {P.desc}
          <button
            type="button"
            className="btn btn-ghost text-lg  "
            onClick={onClick}
          >
            &#9998;
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-ghost w-full text-gray-500 italic my-3"
          onClick={onClick}
        >
          اضافه کردن توضیحات
        </button>
      )}
      <dialog id="change_user_desc_modal" className="modal">
        <div className="modal-box">
          <textarea
            className="textarea textarea-bordered w-full h-full"
            placeholder="توضیحات"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={async () => {
                const res = await changeUserDescAct(description);

                switch (res) {
                  case "long-desc":
                    showAlert("متن طولانی است.");
                    break;
                  case "internal-error":
                    showAlert("خطای سرور", "warning");
                    break;
                  case "success":
                    //: close modal
                    (
                      document.getElementById(
                        "change_user_desc_modal"
                      ) as HTMLDialogElement
                    ).close();
                }
              }}
            >
              ثبت
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="submit">close</button>
        </form>
      </dialog>
    </>
  );
}
