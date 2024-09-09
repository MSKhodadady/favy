import { hasErrorWithCode } from "../utils";

/**
 * This function, checks for common errors in actions,
 * when calling directus functions. It catches the error
 * and checks for common errors.
 * If you have any other error that you want to check,
 * you must catch them and do what you want, then throw again other errors.
 * @param f
 * @returns the result of `f` if not error, else the common errors.
 *
 * @see  `useActionResChecker`: you must use this function in front to do the proper actions for common errors.
 */
export async function actionCommonErrChecker<T>(f: () => Promise<T>) {
  try {
    const r = await f();
    return r;
  } catch (error) {
    if (
      hasErrorWithCode(error, "TOKEN_EXPIRED") ||
      hasErrorWithCode(error, "INVALID_CREDENTIALS")
    ) {
      return "log-out";
    } else {
      console.error(error);
      return "internal-error";
    }
  }
}
