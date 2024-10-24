import { nanDefaulter } from "./utils";

export const USER_MAX_FAV_NUM = nanDefaulter(process.env.USER_MAX_FAV_NUM, 5);

export const envUploadFileMaxSize = nanDefaulter(
  process.env.NEXT_PUBLIC_UPLOAD_FILE_MAX_SIZE,
  1024 * 1024 * 10
);

export function maxFileSizeStr() {
  return `${(envUploadFileMaxSize / 1024 / 1024).toFixed(3)} MB`;
}
