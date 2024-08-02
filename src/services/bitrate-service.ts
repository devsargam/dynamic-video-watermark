import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import {
  uploadQualityToBunny,
  VideoQuality,
  VideoType,
} from "./upload-service";

export const bitrateService = async (
  fileName: string,
  cuid: string,
  type: VideoType
) => {
  const filePath = path.join(__dirname, "../..", fileName);
  const convertedDir = path.join(__dirname, "../..", "converted", cuid);

  const resolutions = [
    { name: "1080p", size: "1920:1080" },
    { name: "720p", size: "1280:720" },
    { name: "480p", size: "854:480" },
  ];

  resolutions.forEach((resolution) => {
    console.log(`Starting conversion of ${type} to ${resolution.name}`);
    const outputDir = path.join(convertedDir, resolution.name, type);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // ffmpeg -i t.mp4 -codec:v libx264 -codec:a aac -strict -2 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls plain.m3u8

    // ffmpeg -i t.mp4 -i logo.png -filter_complex "overlay=10:10" -codec:v libx264 -codec:a aac -strict -2 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls watermarked.m3u8
    const options = [
      "-vf",
      `scale=${resolution.size}`,
      "-c:a",
      "aac",
      "-hls_time",
      "10",
      "-hls_playlist_type",
      "vod",
      "-force_key_frames",
      "expr:gte(t,n_forced*10)",
      "-hls_segment_filename",
      `${outputDir}/${type}%03d.ts`,
    ];

    let count = 0;
    ffmpeg()
      .input(filePath)
      .output(path.join(outputDir, `${type}.m3u8`))
      .outputOptions(options)
      .on("progress", (progress) => {
        count++;
        if (count % 10 !== 0) return;
        console.log(
          `Processing: ${type} ${resolution.name} ${progress.percent.toFixed(
            1
          )}% done`
        );
      })
      .on("end", async () => {
        console.log(`Converted to ${type} HLS ${resolution.name}`);
        await uploadQualityToBunny(
          cuid,
          type as VideoType,
          resolution.name as VideoQuality
        );
      })
      .on("error", (err) => {
        console.error(
          `Error converting ${type} to HLS ${resolution.name}: `,
          err.message
        );
      })
      .run();
  });
};
