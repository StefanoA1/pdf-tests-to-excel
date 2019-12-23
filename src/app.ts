import fs from "fs";
import { ensureDirSync } from "fs-extra";
import pdf from "pdf-parse";
import { csvWriter, outputPath, TestAnalisisRow } from "./csvWritter";
import { FailReasons, parseResult } from "./example";
import { readFilesFromPath } from "./fileReader";

const testReportsFilePath = "./test-reports";

// (async () => {
//   await readFilesFromPath(testReportsFilePath);
// })();

const testReportNameList: string[] = readFilesFromPath(testReportsFilePath);

console.log("files: " + testReportNameList);
const rows: TestAnalisisRow[] = [];
const failedRowsCompleteFail: string[] = [];
const failedRowsUserParseFail: string[] = [];
const failedRowsAntibFail: string[] = [];
let failCount: number = 0;
let totalNumberOfFiles: number = 0;
async function iterateFiles() {
  for (const testReportName of testReportNameList) {
    totalNumberOfFiles++;
    const dataBuffer = fs.readFileSync(
      testReportsFilePath + "/" + testReportName
    );

    // TODO: get pdfData types
    const pdfData = await pdf(dataBuffer);
    const res = parseResult(pdfData.text, testReportName.replace(".pdf", ""));
    if (!res.opRes) {
      failCount++;
      switch (res.reason) {
        case FailReasons.unparsable:
          failedRowsCompleteFail.push(testReportName.replace(".pdf", ""));
          break;
        case FailReasons.user_parse_fail:
          failedRowsUserParseFail.push(testReportName.replace(".pdf", ""));
          break;
        case FailReasons.antib_parse_fail:
          failedRowsAntibFail.push(testReportName.replace(".pdf", ""));
          break;

        default:
          break;
      }
    }
    rows.push(res.data);
  }
  // console.log("rows", rows);
  if (failedRowsCompleteFail.length) {
    console.error("complete fail for: ", failedRowsCompleteFail.join("  "));
  }

  if (failedRowsUserParseFail.length) {
    console.error("user parse fail for: ", failedRowsUserParseFail.join("  "));
  }

  if (failedRowsAntibFail.length) {
    console.error("antib parse fail for: ", failedRowsAntibFail.join("  "));
  }

  console.info("Total # of files: " + totalNumberOfFiles);

  console.info("Total # of files with errors: " + failCount);

  csvWriter
    .writeRecords(rows)
    .then(() => console.log("The CSV file was written successfully"));
}

// ensureDirSync(this.settings.outDir);

// TODO: ouput on config file
ensureDirSync(outputPath);

iterateFiles()
  .then(() => {
    console.log("Ok.");
  })
  .catch((err: any) => console.error("Error:", err));
