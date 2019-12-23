import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
/**
 * Types Object.assign JS method. Use it simply as typedObjectAssign(obj1, obj2)
 * it will detect the Class autmatically or provide it by typedObjectAssign<YourClass>(obj1, obj2)
 *
 */
export function typedObjectAssign<SpecificClass>(
  targetObj: SpecificClass,
  sourceObj: Partial<SpecificClass>
) {
  // tslint:disable-next-line: prefer-object-spread
  return Object.assign(targetObj, sourceObj);
}

export const outputPath = "./results/";
export const outputFilename = "out.csv";
export const missingDataMarker = "Missing Data";
// CEPA	FECHA RECOGIDA	SERVICIO	TIPO DE MUESTRA 	EDAD	GÉNERO
/**
 * Directly in spanish as the ouput is going to be used solely in that
 * language.
 */
export class TestAnalisisRow {
  public cepa: string = missingDataMarker;

  public fechaDeRecogida: string = missingDataMarker;

  public servicio: string = missingDataMarker;

  public tipoDeMuestra: string = missingDataMarker;

  public edad: string = missingDataMarker;

  public genero: string = missingDataMarker;

  public Amikacina: string = missingDataMarker;

  public "Amoxicilina-Clavulanato": string = missingDataMarker;

  public Aztreonam: string = missingDataMarker;

  public Cefalotina: string = missingDataMarker;

  public Cefepima: string = missingDataMarker;

  public Cefoxitina: string = missingDataMarker;

  public Ceftazidima: string = missingDataMarker;

  public Ceftriaxona: string = missingDataMarker;

  public Cefuroxima: string = missingDataMarker;

  public Ciprofloxacino: string = missingDataMarker;

  public Colistina: string = missingDataMarker;

  public Ertapenem: string = missingDataMarker;

  public Gentamicina: string = missingDataMarker;

  public Imipenem: string = missingDataMarker;

  public Levofloxacino: string = missingDataMarker;

  public Meropenem: string = missingDataMarker;

  public "Nitrofurantoína": string = missingDataMarker;

  public "Piperacilina-Tazobactam": string = missingDataMarker;

  public Tigeciclina: string = missingDataMarker;

  public "Trimetoprim-Sulfametoxazol": string = missingDataMarker;
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
