import express from "express";
import "dotenv/config";
import { handleDynamicPlaylist } from "./handlers/dynamic-playlist";
import cors from "cors";
import { upload } from "./multer-init";
import { bitrateService } from "./services/bitrate-service";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (_, res) => {
  res.send("Server is running");
});

app.post("/upload", upload.single("raw"), (req, res) => {
  if (!req.file) return res.sendStatus(400);

  bitrateService(req.file?.originalname);
  return res.sendStatus(201);
});

app.get("/id.m3u8", (req, res) => {
  if (!req.query.id) {
    return res.send(400).send("Id is required");
  }
  const id = +req.query.id;
  if (Number.isNaN(id)) {
    return res.status(400).send("Invalid Id");
  }
  const quality = (req.query.q as string) ?? "720";

  handleDynamicPlaylist({ id, quality, res });
});

app.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}`);
});

import "./utils/upload-to-bunny";
import "./services/upload-service";
