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
    endpoint: "https://" + envConfig.STORAGE_S3_ENDPOINT,

    credentials: {
      accessKeyId: envConfig.STORAGE_S3_KEY!,
      secretAccessKey: envConfig.STORAGE_S3_SECRET!,
    },
  });

  const bucketName = envConfig.STORAGE_S3_BUCKET!;

  const folderName = envConfig.STORAGE_S3_ROOT;

  const fn = (f: string) => `${folderName}/${f}`;

  return {
    async uploadFile(f: File, fileName: string) {
      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Body: Buffer.from(await f.arrayBuffer()),
          Key: fn(fileName),
        })
      );
    },

    async deleteFile(fileName: string) {
      await client.send(
        new DeleteObjectCommand({
          Key: fn(fileName),
          Bucket: bucketName,
        })
      );
    },
    getPublicLink(fileName: string) {
      return `https://${envConfig.STORAGE_S3_BUCKET}.${
        envConfig.STORAGE_S3_ENDPOINT
      }/${folderName}/${encodeURIComponent(fileName)}`;
    },
    async getLink(fileName: string) {
      try {
        const link = await getSignedUrl(
          client,
          new GetObjectCommand({
            Key: fn(fileName),
            Bucket: bucketName,
          })
        );

        return link;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  };
}

const s3Helper = S3Helper();

export default s3Helper;

export const fileNameGenerator = {
  userAvatar(username: string, uploadedFileName: string) {
    return `avatar_u(${username})_t(${Math.floor(
      Date.now() / 1000
    )}).${getFileNameExt(uploadedFileName)}`;
  },
  moviePoster(movieId: number, uploadedFileName: string) {
    return `movie_id(${String(movieId)})_t(${Math.floor(
      Date.now() / 1000
    )}).${getFileNameExt(uploadedFileName)}`;
  },
};
