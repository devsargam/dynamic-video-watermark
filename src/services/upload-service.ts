import path from "path";

type VideoType = "plain" | "watermarked";
type VideoQuality = "1080p" | "720p" | "480p";

export function uploadQualityToBunny(type: VideoType, quality: VideoQuality) {
  console.log(path.join(__dirname, "../..", "converted/", quality, "/", type));
}

// uploadQualityToBunny("plain", "1080p");
