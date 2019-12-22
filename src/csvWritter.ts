import { createObjectCsvWriter as createCsvWriter } from "csv-writer";

export const outputPath = "./results/";
export const outputFilename = "out.csv";

// CEPA	FECHA RECOGIDA	SERVICIO	TIPO DE MUESTRA 	EDAD	GÉNERO
/**
 * Directly in spanish as the ouput is going to be used solely in that
 * language.
 */
export class TestAnalisisRow {
  public cepa: string = "";

  /**
   * Fecha de recogida
   */
  public fechaDeRecogida: string = "";

  public servicio: string = "";

  public tipoDeMuestra: string = "";

  public edad: string = "";

  public genero: string = "";

  public Amikacina: string = "";

  public "Amoxicilina-Clavulanato": string = "";

  public Aztreonam: string = "";

  public Cefalotina: string = "";

  public Cefepima: string = "";

  public Cefoxitina: string = "";

  public Ceftazidima: string = "";

  public Ceftriaxona: string = "";

  public Cefuroxima: string = "";

  public Ciprofloxacino: string = "";

  public Colistina: string = "";

  public Ertapenem: string = "";

  public Gentamicina: string = "";

  public Imipenem: string = "";

  public Levofloxacino: string = "";

  public Meropenem: string = "";

  public "Nitrofurantoína": string = "";

  public "Piperacilina-Tazobactam": string = "";

  public Tigeciclina: string = "";

  public "Trimetoprim-Sulfametoxazol": string = "";
}

interface IHeader {
  id: keyof TestAnalisisRow;
  title: keyof TestAnalisisRow;
}

function getHeadersFromData() {
  const keys: Array<keyof TestAnalisisRow> = Object.keys(
    new TestAnalisisRow()
  ) as Array<keyof TestAnalisisRow>;
  const headers: IHeader[] = [];

  for (const key of keys) {
    headers.push({
      id: key,
      title: key
    });
  }
  return headers;
}

export const csvWriter = createCsvWriter({
  header: getHeadersFromData(),
  path: outputPath + outputFilename
});

// csvWriter
//   .writeRecords(data)
//   .then(() => console.log("The CSV file was written successfully"));
