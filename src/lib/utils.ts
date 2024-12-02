export const matchCase = (m: Record<string, any>, s: string) => m[s];

export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
export const passwordPatternError =
  "حداقل ۸ حرف شامل حرف بزرگ انگلیسی، حرف کوچک و عدد انگلیسی";

export const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/;

export const usernamePattern =
  /^(?=.{6,})[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z0-9_]+)*$/;
export const usernamePatternErr =
  "حداقل ۶ حرف از حروف و عدد انگلیسی و _، شامل بخش های جدا شده با نقطه با یک حرف در آغاز";

export function emailErrorText(errorEmail: any) {
  return matchCase(
    {
      required: "لازم است",
      pattern: "نادرست است",
      value: errorEmail?.message,
      "": "",
    },
    errorEmail?.type ?? ""
  );
}

export function hasErrorWithCode(error: any, code: string) {
  return (
    error?.errors &&
    Array.isArray(error?.errors) &&
    error.errors.length > 0 &&
    error.errors[0]?.extensions?.code == code
  );
}

export function isString(s: any) {
  return typeof s == "string";
}

export function getFileNameExt(fileName: string) {
  const reg = /.+\.(.+)/;
  const res = reg.exec(fileName);

  if (res != null) {
    const ext = res[1];

    return ext ?? "";
  }

  return "";
}

export function nanDefaulter(n: any, defaultN: number) {
  const k = Number(n);
  return Number.isNaN(k) ? defaultN : k;
}

export function logErr(act: string, location: string, err: any) {
  console.error(`error while [${act}] in [${location}] -- text:`);
  console.error(err);
}
