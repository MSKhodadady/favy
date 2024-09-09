import { forwardRef, ReactNode, useImperativeHandle, useRef } from "react";

export type ModalHandle = {
  showModal: () => void;
  closeModal: () => void;
};

export const Modal = forwardRef<
  ModalHandle,
  {
    withoutBackDrop?: boolean;
    actions?: ReactNode;
    children?: ReactNode;
    onBackDropClick?: () => void;
  }
>(function Modal(P, ref) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => {
    return {
      showModal() {
        dialogRef.current?.showModal();
      },

      closeModal() {
        dialogRef.current?.close();
      },
    };
  });

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box">
        {P.children}
        {P.actions && <div className="modal-action">{P.actions}</div>}
      </div>
      {!P.withoutBackDrop && (
        <form method="dialog" className="modal-backdrop">
          <button type="submit" onClick={P.onBackDropClick}>
            close
          </button>
        </form>
      )}
    </dialog>
  );
});
