export const matchCase = (m: Record<string, any>, s: string) => m[s];

export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;

export const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/;

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
