"use client";

import { ReactNode } from "react";
import { AlertType } from "../lib/client/redux/slices/alert";
import { useAppSelector } from "../lib/client/redux/store";
import { Provider } from "react-redux";
import { store } from "../lib/client/redux/store";

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AlertViewer />
      {children}
    </Provider>
  );
}

function AlertViewer() {
  const s = useAppSelector((s) => s.alert);
  return (
    s.show && (
      <div
        className={`alert z-10 right-0 bottom-0 w-fit fixed m-5 
          flex 
          ${alertTypeClassName(s.type)}`}
      >
        &#9432;
        <p>{s.text}</p>
      </div>
    )
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
