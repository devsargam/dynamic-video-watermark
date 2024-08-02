import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export const bitrateService = async (fileName: string) => {
  const filePath = path.join(__dirname, "../..", "uploads", fileName);
  const convertedDir = path.join(__dirname, "../..", "converted");

  const resolutions = [
    // { name: "1080p", size: "1920x1080" },
    // { name: "720p", size: "1280x720" },
    { name: "480p", size: "854x480" },
  ];

  resolutions.forEach((resolution) => {
    ["plain", "watermarked"].forEach((type) => {
      const watermarkedPath = path.join(
        __dirname,
        "../..",
        "assets",
        "watermark.png"
      );
      console.log(`Starting conversion of ${type} to ${resolution.name}`);
      const outputDir = path.join(convertedDir, resolution.name, type);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // ffmpeg -i t.mp4 -codec:v libx264 -codec:a aac -strict -2 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls plain.m3u8

      // ffmpeg -i t.mp4 -i logo.png -filter_complex "overlay=10:10" -codec:v libx264 -codec:a aac -strict -2 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls watermarked.m3u8
      const options = [
        // '-vf', `scale=${resolution.size}`,
        // '-c:v', 'libx264',
        // '-crf', '20',
        "-preset",
        "fast",
        "-c:a",
        "aac",
        "-hls_time",
        "10",
        "-hls_playlist_type",
        "vod",
        "-force_key_frames",
        "expr:gte(t,n_forced*10)",
        `-hls_segment_filename`,
        `${outputDir}/${type}%03d.ts`,
      ];

      const command = ffmpeg()
        .input(filePath)
        .output(path.join(outputDir, `${type}.m3u8`));
      if (type === "watermarked") {
        command.input(watermarkedPath).complexFilter([
          {
            filter: "scale",
            // options: { w: 'iw*0.1', h: 'ih*0.1' },
            options: { w: "iw", h: "ih" },
            inputs: "1:v",
            outputs: "scaled",
          },
          {
            filter: "overlay",
            options: { x: 300, y: 100 },
            inputs: ["0:v", "scaled"],
          },
        ]);
      }

      command
        .outputOptions(options)
        .on("progress", (progress) => {
          console.log(
            `Processing: ${type} ${resolution.name} = ${progress.percent}% done`
          );
        })
        .on("end", () => {
          console.log(`Converted to ${type} HLS ${resolution.name}`);
        })
        .on("error", (err) => {
          console.error(
            `Error converting ${type} to HLS ${resolution.name}: `,
            err.message
          );
        })
        .run();
    });
  });
};
