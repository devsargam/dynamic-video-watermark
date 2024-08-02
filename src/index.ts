import express from "express";
import "dotenv/config";
import cors from "cors";
import { upload } from "./multer-init";
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

app.post("/upload", upload.single("raw"), (req, res) => {
  if (!req.file) return res.sendStatus(400);

  const uniqueCuid = createId();
  uploadToBunnyStorage(
    req.file?.path,
    `${uniqueCuid}/${req.file?.originalname}`
  );
  bitrateService(req.file?.originalname, uniqueCuid);
  return res.sendStatus(201);
});

app.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}`);
});
