"use client";

import { useShowAlertTimeout } from "@/src/lib/client/hooks/useShowAlert";
import { USER_DESC_LINE_COUNT } from "@/src/lib/constants";
import { useEffect, useState } from "react";
import { changeUserDescAct } from "./action";

export function ChangeDescModal(P: { username: string; desc: string }) {
  const [description, setDescription] = useState(P.desc);
  const { showAlertTimeout } = useShowAlertTimeout();

  useEffect(() => {
    setDescription(P.desc);
  }, [P.desc]);

  function onClick() {
    return (
      document.getElementById("change_user_desc_modal") as HTMLDialogElement
    ).showModal();
  }

  async function onSubmit() {
    const res = await changeUserDescAct(description);

    switch (res) {
      case "long-desc":
        showAlertTimeout("متن طولانی است.");
        break;
      case "internal-error":
        showAlertTimeout("خطای سرور", "warning");
        break;
      case "success":
        setDescription(description.trim());
        //: close modal
        (
          document.getElementById("change_user_desc_modal") as HTMLDialogElement
        ).close();
    }
  }

  return (
    <>
      {P.desc ? (
        <div className="w-full px-3 my-3 whitespace-pre-wrap">
          {P.desc}
          <button
            type="button"
            className="btn btn-ghost text-lg"
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
            rows={USER_DESC_LINE_COUNT}
            onChange={(e) => {
              const { value } = e.target;
              const lines = value.split("\n").length;

              if (lines <= USER_DESC_LINE_COUNT) {
                setDescription(value);
              }
            }}
          />

          <div className="modal-action">
            <button className="btn btn-primary w-full" onClick={onSubmit}>
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
