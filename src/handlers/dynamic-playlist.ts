import { Response } from "express"
import { generatePlaylist } from "../utils/get-m3u8"

export function handleDynamicPlaylist({ id, res, quality }: { id: number, res: Response, quality: string }) {
  // TODO: Handle quality
  const playlist = generatePlaylist(id, "content/plain.m3u8", "content/watermarked.m3u8", "content/output.m3u8")
  res.send(playlist);
}
