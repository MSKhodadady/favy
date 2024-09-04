"use client";

import {
  AlertType,
  hideAlert,
  showAlert as showAlertAction,
} from "@/src/lib/client/redux/slices/alert";
import { useAppDispatch, useAppSelector } from "@/src/lib/client/redux/store";

export function useShowAlertTimeout() {
  const s = useAppSelector((s) => s.alert);

  const dispatch = useAppDispatch();

  function showAlertTimeout(
    text: string,
    type: AlertType = "error",
    expireTime = 2000
  ) {
    dispatch(showAlertAction({ text, type }));

    setTimeout(() => {
      dispatch(hideAlert());
    }, expireTime);
  }

  return { showAlertTimeout };
}
