const ffmpeg = require("fluent-ffmpeg");

const inputVideo = "/Users/sargampoudel/Downloads/new/uploads/v.mp4";
const watermarkImage = "/Users/sargampoudel/Downloads/new/assets/watermark.png";
const outputVideo = "/Users/sargampoudel/Downloads/new/assets/output.mp4";

ffmpeg(inputVideo)
  .input(watermarkImage)
  .complexFilter([
    {
      filter: "overlay",
      options: { x: "main_w-overlay_w-100", y: "main_h-overlay_h-10" }, // bottom-right corner with 10px margin
    },
  ])
  .output(outputVideo)
  .on("progress", function (progress) {
    console.log("Processing: " + progress.percent + "% done");
  })
  .on("end", () => {
    console.log("Watermark added successfully!");
  })
  .on("error", (err) => {
    console.error("Error occurred:", err);
  })
  .run();
