"use client";

import { useRouter } from "next/navigation";
import { useShowAlertTimeout } from "./useShowAlert";

type ResType<T> = "internal-error" | "success" | "log-out" | "bad-req" | T;

/**
 * This _hook_, is a tool for responding to common errors came from server when calling actions.
 *
 * @see `actionCommonErrChecker`: this function, checks for common errors in actions and sends them.
 */
export function useActionResChecker() {
  const _showAlertTimeout = useShowAlertTimeout();
  const { showInternalErr, showMustLogin } = _showAlertTimeout;
  const router = useRouter();

  return function <T>(P: {
    res: ResType<T>;
    onSuccess: (
      alertShower: ReturnType<typeof useShowAlertTimeout>,
      router: ReturnType<typeof useRouter>
    ) => void;
    onOther?: (
      r: T,
      alertShower: ReturnType<typeof useShowAlertTimeout>,
      router: ReturnType<typeof useRouter>
    ) => void;
  }) {
    switch (P.res) {
      case "bad-req":
      case "internal-error":
        showInternalErr();
        break;
      case "log-out":
        showMustLogin();
        setTimeout(() => {
          router.replace("/sign-in");
        }, 1000);
        break;
      case "success":
        P.onSuccess(_showAlertTimeout, router);
        break;
      default:
        if (P.onOther) {
          P.onOther(P.res, _showAlertTimeout, router);
        } else {
          showInternalErr();
        }
    }
  };
}
