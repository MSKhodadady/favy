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
