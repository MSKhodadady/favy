import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getFileNameExt } from "../utils";

function S3Helper() {
  const envConfig = {
    STORAGE_S3_ROOT: process.env.STORAGE_S3_ROOT ?? "",
    STORAGE_S3_KEY: process.env.STORAGE_S3_KEY,
    STORAGE_S3_SECRET: process.env.STORAGE_S3_SECRET,
    STORAGE_S3_BUCKET: process.env.STORAGE_S3_BUCKET,
    STORAGE_S3_REGION: process.env.STORAGE_S3_REGION ?? "default",
    STORAGE_S3_ENDPOINT: process.env.STORAGE_S3_ENDPOINT,
  };

  Object.entries(envConfig).forEach(([k, v]) => {
    if (!v) {
      throw Error(`env ${k} not found!`);
    }
  });

  const client = new S3Client({
    region: "default",
    endpoint: envConfig.STORAGE_S3_ENDPOINT,

    credentials: {
      accessKeyId: envConfig.STORAGE_S3_KEY!,
      secretAccessKey: envConfig.STORAGE_S3_SECRET!,
    },
  });

  const bucketName = envConfig.STORAGE_S3_BUCKET!;

  const folderName = envConfig.STORAGE_S3_ROOT;

  return {
    async uploadFile(f: File, fileName: string) {
      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Body: f,
          Key: folderName + fileName,
        })
      );
    },

    async deleteFile(fileName: string) {
      await client.send(
        new DeleteObjectCommand({
          Key: folderName + fileName,
          Bucket: bucketName,
        })
      );
    },

    async getLink(fileName: string) {
      return await getSignedUrl(
        client,
        new GetObjectCommand({
          Key: folderName + fileName,
          Bucket: bucketName,
        })
      );
    },
  };
}

const s3Helper = S3Helper();

export default s3Helper;

export function userAvatarFileName(username: string, uploadedFileName: string) {
  return `avatar_u(${username})_t(${Math.floor(
    Date.now() / 1000
  )}).${getFileNameExt(uploadedFileName)}`;
}

export function movieFileName(movieId: number, uploadedFileName: string) {
  return `movie_id(${String(movieId)})_t(${Math.floor(
    Date.now() / 1000
  )}).${getFileNameExt(uploadedFileName)}`;
}
