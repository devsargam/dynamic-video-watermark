import axios, { AxiosError } from "axios";
import fs from "fs";

const BUNNY_STORAGE_API_KEY = process.env.BUNNY_STORAGE_API_KEY;
const BUNNY_STORAGE_HOSTNAME = process.env.BUNNY_STORAGE_HOSTNAME;
const BUNNY_STORAGE_USERNAME = process.env.BUNNY_STORAGE_USERNAME;

// Should look like https://storage.bunnycdn.com/100xdevs
const BUNNY_STORAGE_BASE_URL =
  "https://" + BUNNY_STORAGE_HOSTNAME + "/" + BUNNY_STORAGE_USERNAME + "/";

export const uploadToBunnyStorage = async (
  filePath: string,
  destination: string
) => {
  const fileStream = fs.createReadStream(filePath);
  const url = BUNNY_STORAGE_BASE_URL + destination;

  try {
    await axios.put(url, fileStream, {
      headers: {
        AccessKey: BUNNY_STORAGE_API_KEY,
        "Content-Type": "application/octet-stream",
      },
    });
    // @ts-ignore
  } catch (error: AxiosError<unknown>) {
    console.log(error);
  }
};

// uploadToBunnyStorage(
//   "/Users/sargampoudel/Downloads/new/converted/480p/plain/plain003.ts",
//   "plain003.ts"
// );
