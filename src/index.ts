import express from "express";
import "dotenv/config";
import cors from "cors";
import { multiUpload, upload } from "./multer-init";
import { bitrateService } from "./services/bitrate-service";
import { createId } from "@paralleldrive/cuid2";
import { uploadToBunnyStorage } from "./utils/upload-to-bunny";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (_, res) => {
  res.send("Server is running");
});

app.post("/upload", (req, res) => {
  multiUpload(req, res, async (err) => {
    if (err) {
      return res.sendStatus(400);
    }
    const uniqueCuid = createId();
    // @ts-ignore
    const plainVideoPath = req.files.plain[0].path;
    // @ts-ignore
    const watermarkedVideoPath = req.files.watermarked[0].path;

    // Upload the main video file
    uploadToBunnyStorage(plainVideoPath, `${uniqueCuid}/video.mp4`);
    bitrateService(plainVideoPath, uniqueCuid, "plain");
    bitrateService(watermarkedVideoPath, uniqueCuid, "watermarked");

    return res.status(201).send({
      id: uniqueCuid,
    });
  });
});

app.listen(PORT, () => {
  console.clear();
  console.info(`Server is running on port ${PORT}`);
});
