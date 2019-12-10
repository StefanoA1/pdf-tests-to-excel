import fs from "fs";
import { ensureDirSync } from "fs-extra";
import pdf from "pdf-parse";
import { csvWriter, data, outputPath } from "./csvWritter";

const dataBuffer = fs.readFileSync("./test-reports/c72.pdf");

pdf(dataBuffer).then(function(data) {
  // number of pages
  console.log("numpages: \n", data.numpages);
  // number of rendered pages
  console.log("numrender: \n", data.numrender);
  // PDF info
  console.log("info: \n", data.info);
  // PDF metadata
  console.log("metadata: \n", data.metadata);
  // PDF.js version
  // check https://mozilla.github.io/pdf.js/getting_started/
  console.log("version: \n", data.version);
  // PDF text
  console.warn("text: \n", data.text);
});

// ensureDirSync(this.settings.outDir);

// TODO: ouput on config file
ensureDirSync(outputPath);

csvWriter
  .writeRecords(data)
  .then(() => console.log("The CSV file was written successfully"));
