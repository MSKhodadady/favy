"use client";

import {
  AlertType,
  hideAlert,
  showAlert as showAlertAction,
} from "@/src/lib/client/redux/slices/alert";
import { useAppDispatch, useAppSelector } from "@/src/lib/client/redux/store";

export function useShowAlertTimeout(expireTime = 2000) {
  const s = useAppSelector((s) => s.alert);

  const dispatch = useAppDispatch();

  function showAlertTimeout(text: string, type: AlertType = "error") {
    dispatch(showAlertAction({ text, type }));

    setTimeout(() => {
      dispatch(hideAlert());
    }, expireTime);
  }

  function showInternalErr() {
    showAlertTimeout("خطای سرور", "warning");
  }

  function showMustLogin() {
    showAlertTimeout("باید وارد شوید!", "info");
  }

  return { showAlertTimeout, showInternalErr, showMustLogin };
}
