import { readdirSync } from "fs-extra";

// keep wrapped in case to convert it to async later
export const readFilesFromPath = (path: string) => {
  const fileNameList: string[] = readdirSync(path);
  console.log("Test reports: " + fileNameList);
  return fileNameList;
};
