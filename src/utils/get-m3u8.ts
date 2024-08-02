import * as fs from "fs";

export function generatePlaylist(
  userId: number,
  plainFile: string,
  watermarkedFile: string,
  outputFile: string,
): string {
  const userIdBin = userId.toString(2).padStart(20, "0");

  const plainContent = fs.readFileSync(plainFile, "utf8").split("\n");
  const watermarkedContent = fs
    .readFileSync(watermarkedFile, "utf8")
    .split("\n");

  const plainSegments = plainContent.filter((line) => line.endsWith(".ts"));
  const watermarkedSegments = watermarkedContent.filter((line) =>
    line.endsWith(".ts"),
  );

  const plainMetadata = plainContent.filter(
    (line) => !line.endsWith(".ts") && !line.startsWith("#EXTINF"),
  );

  const combinedMetadata = [...plainMetadata];

  const plainEXTINF = plainContent.filter((line) => line.startsWith("#EXTINF"));
  const watermarkedEXTINF = watermarkedContent.filter((line) =>
    line.startsWith("#EXTINF"),
  );

  const newPlaylist: string[] = [];

  newPlaylist.push(...combinedMetadata);

  let count = 0;
  while (newPlaylist.length / 2 < plainEXTINF.length + 8) {
    const bit = userIdBin[count % userIdBin.length];
    if (bit === "0") {
      newPlaylist.push(plainEXTINF[count]);
      newPlaylist.push(plainSegments[count]);
    } else {
      newPlaylist.push(watermarkedEXTINF[count]);
      newPlaylist.push(watermarkedSegments[count]);
    }
    count++;
  }

  fs.writeFileSync(outputFile, newPlaylist.join("\n"), "utf8");

  return newPlaylist.join("\n");
}

const userId = 2 ** 18 - 1;
const plainFile = "content/plain.m3u8";
const watermarkedFile = "content/watermarked.m3u8";
const outputFile = "content/output.m3u8";

const output = generatePlaylist(userId, plainFile, watermarkedFile, outputFile);

console.log(output);
