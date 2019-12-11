import fs from "fs";
import { ensureDirSync } from "fs-extra";
import pdf from "pdf-parse";
import { csvWriter, data, outputPath } from "./csvWritter";

const testReportsFilePath = "./test-reports";

const testReportNameList: string[] = [];

fs.readdir(testReportsFilePath, (readErr, fileNames) => {
  for (const fileName of fileNames) {
    console.log("Test report: " + fileName);
    testReportNameList.push(fileName);
    // fs.stat(testReport, (statErr, stats) => {
    //   console.log(testReport);
    //   console.log(stats.size);
    // });
  }
});

const dataBuffer = fs.readFileSync("./test-reports/c72.pdf");

// TODO: get pdfData types
pdf(dataBuffer).then((pdfData: any) => {
  // number of pages
  console.log("numpages: \n", pdfData.numpages);
  // number of rendered pages
  console.log("numrender: \n", pdfData.numrender);
  // PDF info
  console.log("info: \n", pdfData.info);
  // PDF metadata
  console.log("metadata: \n", pdfData.metadata);
  // PDF.js version
  // check https://mozilla.github.io/pdf.js/getting_started/
  console.log("version: \n", pdfData.version);
  // PDF text
  console.warn("text: \n", pdfData.text);
});

// ensureDirSync(this.settings.outDir);

// TODO: ouput on config file
ensureDirSync(outputPath);

csvWriter
  .writeRecords(data)
  .then(() => console.log("The CSV file was written successfully"));
