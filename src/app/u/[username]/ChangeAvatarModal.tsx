"use client";

import { LoadingBar } from "@/src/components/LoadingBar";
import { useActionResChecker } from "@/src/lib/client/hooks/useActionResChecker";
import { useLoading } from "@/src/lib/client/hooks/useLoading";
import {
  faPen,
  faTrashCan,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useRef, useState } from "react";
import {
  AvatarPlaceHolder,
  AvatarViewer,
} from "../../../components/AvatarViewer";
import { changeUserAvatarAct, deleteUserAvatarAct } from "./action";

export function ChangeAvatarModal(P: {
  avatarId: string | null;
  avatarLink: string | null;
  username: string;
}) {
  const { withLoading, loading } = useLoading();
  const actionChecker = useActionResChecker();

  const inputFileRef = useRef<null | HTMLInputElement>(null);
  const dialogChangeRef = useRef<null | HTMLDialogElement>(null);
  const dialogDeleteRef = useRef<null | HTMLDialogElement>(null);

  const [inputAvatarImg, setInputAvatarImg] = useState(null as null | File);

  function onInputFile(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (files && files.length > 0) {
      const f = files[0];
      setInputAvatarImg(f);

      dialogChangeRef.current?.showModal();
    }
  }

  function onRegisterAvatar() {
    withLoading(async () => {
      if (!inputAvatarImg) return;

      const fd = new FormData();

      fd.append("avatar-img", inputAvatarImg);

      actionChecker({
        res: await changeUserAvatarAct(fd),
        onSuccess() {
          dialogChangeRef.current?.close();
        },
      });
    });
  }

  function onDeleteAvatar() {
    withLoading(async () => {
      actionChecker({
        res: await deleteUserAvatarAct(),
        onSuccess() {
          dialogDeleteRef.current?.close();
        },
      });
    });
  }

  return (
    <>
      <div className="relative">
        {P.avatarLink ? (
          <>
            <AvatarViewer avatarLink={P.avatarLink} username={P.username} />
            {/* CHANGE AVATAR */}
            <button
              type="button"
              className="btn btn-ghost btn-circle
            bg-white hover:bg-white active:bg-white shadow-lg
              w-7 h-7 min-h-fit m-1 
              absolute bottom-0 left-0"
              onClick={() => {
                inputFileRef?.current?.click();
              }}
            >
              <FontAwesomeIcon icon={faPen} className="w-3 h-3" color="black" />
            </button>
            {/* DELETE AVATAR */}
            <button
              type="button"
              className="btn btn-ghost btn-circle
            bg-white hover:bg-white active:bg-white shadow-lg
              w-7 h-7 min-h-fit m-1 
              absolute bottom-0 right-0"
              onClick={() => {
                dialogDeleteRef.current?.showModal();
              }}
            >
              <FontAwesomeIcon
                icon={faTrashCan}
                className="w-3 h-3"
                color="black"
              />
            </button>
          </>
        ) : (
          <AvatarPlaceHolder>
            {/* ADD AVATAR */}
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
                className="w-6 h-6"
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

      {/* CONFIRM CHANGE MODAL */}
      <dialog
        ref={dialogChangeRef}
        id="change_user_avatar_modal"
        className="modal"
      >
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
              {loading ? <LoadingBar /> : "ثبت"}
            </button>
          </div>
        </div>
        {/* BACKDROP WITH CLOSE */}
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

      <dialog ref={dialogDeleteRef} className="modal">
        <div className="modal-box">
          <h1>آیا مطمئن هستید؟</h1>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-primary w-full"
              disabled={loading}
              onClick={onDeleteAvatar}
            >
              {loading ? (
                <progress className="progress progress-success w-full"></progress>
              ) : (
                "ثبت"
              )}
            </button>
          </div>
        </div>
        {/* BACKDROP WITH CLOSE */}
        <form method="dialog" className="modal-backdrop">
          <button type="submit">close</button>
        </form>
      </dialog>
    </>
  );
}
