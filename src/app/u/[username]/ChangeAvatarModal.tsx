"use client";

import { useLoading } from "@/src/lib/client/hooks/useLoading";
import { useShowAlertTimeout } from "@/src/lib/client/hooks/useShowAlert";
import { faPen, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useRef, useState } from "react";
import { changeUserAvatarAct } from "./action";
import { AvatarPlaceHolder, AvatarViewer } from "./AvatarViewer";

export function ChangeAvatarModal(P: {
  avatarId: string | null;
  avatarLink: string | null;
  username: string;
}) {
  const { showAlertTimeout } = useShowAlertTimeout();
  const { withLoading, loading } = useLoading();

  const inputFileRef = useRef<null | HTMLInputElement>(null);
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const [inputAvatarImg, setInputAvatarImg] = useState(null as null | File);

  function onInputFile(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (files && files.length > 0) {
      const f = files[0];
      setInputAvatarImg(f);

      dialogRef.current?.showModal();
    }
  }

  function onRegisterAvatar() {
    withLoading(async () => {
      if (!inputAvatarImg) return;

      const fd = new FormData();

      fd.append("avatar-img", inputAvatarImg);

      const res = await changeUserAvatarAct(fd);

      switch (res) {
        case "success":
          dialogRef.current?.close();
          break;

        case "bad-req":
        case "internal-error":
          showAlertTimeout("خطای سرور", "warning");
          break;

        default:
          break;
      }
    });
  }

  return (
    <>
      <div className="relative">
        {P.avatarLink ? (
          <>
            <AvatarViewer avatarLink={P.avatarLink} username={P.username} />
            <button
              type="button"
              className="btn btn-ghost btn-circle
            bg-white
              w-7 h-7 min-h-fit m-1 
              absolute bottom-0 left-0"
              onClick={() => {
                inputFileRef?.current?.click();
              }}
            >
              <FontAwesomeIcon icon={faPen} className="w-3 h-3" color="black" />
            </button>
          </>
        ) : (
          <AvatarPlaceHolder>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                inputFileRef?.current?.click();
              }}
            >
              <FontAwesomeIcon
                icon={faUserPlus}
                color="white"
                width="3rem"
                height="3rem"
              />
            </button>
          </AvatarPlaceHolder>
        )}

        <input
          type="file"
          onChange={onInputFile}
          ref={inputFileRef}
          className="hidden"
          accept="image/*"
        />
      </div>

      <dialog ref={dialogRef} id="change_user_avatar_modal" className="modal">
        <div className="modal-box">
          <div className="w-full flex justify-center items-center">
            {inputAvatarImg && (
              <AvatarViewer
                avatarLink={URL.createObjectURL(inputAvatarImg)}
                changeMode
              />
            )}
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-primary w-full"
              disabled={loading}
              onClick={onRegisterAvatar}
            >
              {loading ? (
                <progress className="progress progress-success w-full"></progress>
              ) : (
                "ثبت"
              )}
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button
            type="submit"
            onClick={() => {
              setInputAvatarImg(null);
              if (inputFileRef.current?.value) {
                inputFileRef.current.value = "";
              }
            }}
          >
            close
          </button>
        </form>
      </dialog>
    </>
  );
}
