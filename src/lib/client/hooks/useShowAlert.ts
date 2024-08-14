import {
  AlertType,
  hideAlert,
  showAlert as showAlertAction,
} from "@/src/redux/slices/alert";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";

export function useShowAlert() {
  const s = useAppSelector((s) => s.alert);

  const dispatch = useAppDispatch();

  function showAlert(
    text: string,
    type: AlertType = "error",
    expireTime = 1000
  ) {
    dispatch(showAlertAction({ text, type }));

    setTimeout(() => {
      dispatch(hideAlert());
    }, expireTime);
  }

  return { showAlert };
}
