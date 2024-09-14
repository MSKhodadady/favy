"use client";

import { Modal, ModalHandle } from "@/src/components/Modal";
import { useActionResChecker } from "@/src/lib/client/hooks/useActionResChecker";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { deleteMovieFromUserAct } from "./action";

export function MovieDelete(P: { movieId: string }) {
  const actionChecker = useActionResChecker();
  const modalRef = useRef<ModalHandle>(null);
  return (
    <>
      <button
        type="button"
        className="btn btn-secondary absolute bottom-0 left-0 rounded-none rounded-tr-3xl rounded-bl-3xl "
        onClick={() => {
          modalRef.current?.showModal();
        }}
      >
        <FontAwesomeIcon icon={faTrashCan} className="w-5 h-5 text-white" />
      </button>

      <Modal
        ref={modalRef}
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={async () => {
              actionChecker({
                res: await deleteMovieFromUserAct(P.movieId),
                onSuccess() {
                  return;
                },
              });
              modalRef.current?.closeModal();
            }}
          >
            بله
          </button>
        }
      >
        <p className="my-3 text-xl">آیا مطمئن هستید؟</p>
      </Modal>
    </>
  );
}
