import path from "path";
import fs from "fs/promises";
import { uploadToBunnyStorage } from "../utils/upload-to-bunny";

export type VideoType = "plain" | "watermarked";
export type VideoQuality = "1080p" | "720p" | "480p";

export async function uploadQualityToBunny(
  cuid: string,
  type: VideoType,
  quality: VideoQuality
) {
  const qualityPath = path.join(
    __dirname,
    "../..",
    "converted/",
    cuid,
    quality,
    "/",
    type
  );

  // https://docs.bunny.net/reference/api-limits
  const UPLOAD_BATCH_SIZE = +process.env.UPLOAD_BATCH_SIZE! ?? 50;
  const uploadArray: { path: string; destination: string }[] = [];

  const files = await fs.readdir(qualityPath);

  for (const file of files) {
    uploadArray.push({
      path: qualityPath + "/" + file,
      destination: `${cuid}/${quality}/${type}/${file}`,
    });
  }

  for (let i = 0; i < uploadArray.length; i += UPLOAD_BATCH_SIZE) {
    const currentUploadBatch = uploadArray.slice(i, i + UPLOAD_BATCH_SIZE);
    const startTime = Date.now();
    await Promise.all(
      currentUploadBatch.map((file) =>
        uploadToBunnyStorage(file.path, file.destination)
      )
    );

    const endTime = Date.now();
    console.log(
      `Batch ${i / UPLOAD_BATCH_SIZE + 1} uploaded in ${endTime - startTime}ms`
    );
  }
}
