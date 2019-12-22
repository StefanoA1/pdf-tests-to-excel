import fs from "fs";
import { ensureDirSync } from "fs-extra";
import pdf from "pdf-parse";
import { csvWriter, outputPath, TestAnalisisRow } from "./csvWritter";
import { parseResult } from "./example";
import { readFilesFromPath } from "./fileReader";

const testReportsFilePath = "./test-reports";

// (async () => {
//   await readFilesFromPath(testReportsFilePath);
// })();

const testReportNameList: string[] = readFilesFromPath(testReportsFilePath);

console.log("files: " + testReportNameList);
const rows: TestAnalisisRow[] = [];
async function iterateFiles() {
  for (const testReportName of testReportNameList) {
    const dataBuffer = fs.readFileSync(
      testReportsFilePath + "/" + testReportName
    );

    // TODO: get pdfData types
    const pdfData = await pdf(dataBuffer);
    console.log(testReportName.replace(".pdf", ""));
    rows.push(parseResult(pdfData.text, testReportName.replace(".pdf", "")));
  }
  console.log("rows", rows);
  csvWriter
    .writeRecords(rows)
    .then(() => console.log("The CSV file was written successfully"));
}

// ensureDirSync(this.settings.outDir);

// TODO: ouput on config file
ensureDirSync(outputPath);

iterateFiles().then(() => {
  console.log("Ok.");
});
