import { createObjectCsvWriter as createCsvWriter } from "csv-writer";

export const outputPath = "./results";
export const outputFilename = "out.csv";

export const csvWriter = createCsvWriter({
  header: [
    { id: "name", title: "Name" },
    { id: "surname", title: "Surname" },
    { id: "age", title: "Age" },
    { id: "gender", title: "Gender" }
  ],
  path: outputPath + outputFilename
});
export interface IDataExample {
  age: number;
  gender: string;
  name: string;
  surname: string;
}

export const data: IDataExample[] = [
  {
    age: 26,
    gender: "M",
    name: "John",
    surname: "Snow"
  },
  {
    age: 33,
    gender: "F",
    name: "Clair",
    surname: "White"
  }
];

// csvWriter
//   .writeRecords(data)
//   .then(() => console.log("The CSV file was written successfully"));
