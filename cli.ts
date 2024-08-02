import { program } from "commander";
import ffmpeg from "fluent-ffmpeg";
import path from "path";

program
  .name("100x-uploader")
  .description(
    "Takes a video create a watermarked version of it trnascodes and uploades to bunny"
  );

program
  .command("convert")
  .description("Convert a normal video to a watermarked version of it")
  .option("--video <path>", "path to the video")
  .option("--image <path>", "path to the watermark image")
  .action((options) => {
    const inputVideo = options.video;
    const watermarkImage = options.image;

    if (!inputVideo || !watermarkImage) {
      console.error("Both --video and --image options are required");
      process.exit(1);
    }

    const outputVideo = path.join(
      path.dirname(inputVideo),
      `${path.basename(
        inputVideo,
        path.extname(inputVideo)
      )}_watermarked${path.extname(inputVideo)}`
    );

    ffmpeg(inputVideo)
      .input(watermarkImage)
      .complexFilter([
        {
          filter: "overlay",
          options: { x: "main_w-overlay_w-10", y: "main_h-overlay_h-10" }, // bottom-right corner with 10px margin
        },
      ])
      .output(outputVideo)
      .on("end", () => {
        console.log(
          `Watermark added successfully! Output file: ${outputVideo}`
        );
      })
      .on("error", (err) => {
        console.error("Error occurred:", err);
      })
      .run();
  });

program.parse(process.argv);
