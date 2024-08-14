"use client";

import { ReactNode } from "react";
import { AlertType } from "../redux/slices/alert";
import { useAppSelector } from "../redux/store";

export function AlertViewer() {
  const s = useAppSelector((s) => s.alert);

  return (
    <>
      {s.show && (
        <div
          className={
            "alert z-10 left-6 bottom-6 w-fit fixed" +
            " " +
            alertTypeClassName(s.type)
          }
        >
          <p>{s.text}</p>
        </div>
      )}
    </>
  );
}

export function alertTypeClassName(t: AlertType) {
  switch (t) {
    case "error":
      return "alert-error";
    case "info":
      return "alert-info";
    case "success":
      return "alert-success";
    case "warning":
      return "alert-warning";
    default:
      return "alert-error";
  }
}
