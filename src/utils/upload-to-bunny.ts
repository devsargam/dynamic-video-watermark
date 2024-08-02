import axios from "axios";
import fs from "fs";

const BUNNY_STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY;
const BUNNY_STORAGE_HOSTNAME = process.env.BUNNY_STORAGE_HOSTNAME;
const BUNNY_STORAGE_USERNAME = process.env.BUNNY_STORAGE_USERNAME;

// Should look like https://storage.bunnycdn.com/100xdevs
const BUNNY_STORAGE_BASE_URL =
  "https://" + BUNNY_STORAGE_HOSTNAME + "/" + BUNNY_STORAGE_USERNAME;

export const uploadToBunnyStorage = async (
  filePath: string,
  destination: string
) => {
  const fileStream = fs.createReadStream(filePath);
  const url = BUNNY_STORAGE_BASE_URL + destination;

  await axios.put(url, fileStream, {
    headers: {
      AccessKey: BUNNY_STORAGE_API_KEY,
      "Content-Type": "application/octet-stream",
    },
  });
  console.log(`${filePath} uploaded to BunnyCDN as ${destination}`);
};

// uploadToBunnyStorage(
//   "/Users/sargampoudel/Downloads/new/converted/480p/watermarked003.ts",
//   "/watermarked003.ts"
// ).then(() => {
//   console.log("Done!!!");
// });
