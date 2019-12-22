import { TestAnalisisRow } from "./csvWritter";

function calculateAge(birthday: string): number {
  // birthday is a date
  if (birthday === "Missing Data") {
    return NaN;
  }
  const splitBday = birthday.split("/");
  [splitBday[0], splitBday[1]] = [splitBday[1], splitBday[0]];

  const formattedDate = splitBday.join("/");
  const birthdayDate = new Date(formattedDate);
  const ageDifMs = Date.now() - birthdayDate.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function parseResult(text: string, fileName: string): TestAnalisisRow {
  const data: TestAnalisisRow = new TestAnalisisRow();
  data.cepa = fileName;
  const antibioticGroupRegex = new RegExp(
    // tslint:disable-next-line: trailing-comma
    /Grupo\s*de\s*\s*test\s*de\s*antibiótico([\w\W]*)Marcadores\s*de\s*resistencia\s*/
  );
  const match = antibioticGroupRegex.exec(text);
  const antibioticsGroupTextBlob = match && match[1];
  // console.log(antibiotics);

  const singleAntibioticRegex = new RegExp(
    // tslint:disable-next-line: trailing-comma
    /[SRIX]\s*[ABCOU]\s*\d*\s*[RX]?\s*[SRI]\s*([<>=]{0,2}[/\d,]+)([A-Z][a-zí]+[A-Z-]{0,2}[a-zí]+)\s*/g
  );
  let singleAntibioticMatch = singleAntibioticRegex.exec(
    antibioticsGroupTextBlob!
  );

  while (singleAntibioticMatch != null) {
    singleAntibioticMatch.shift();
    data[singleAntibioticMatch[1] as keyof TestAnalisisRow] =
      singleAntibioticMatch[0];
    singleAntibioticMatch = singleAntibioticRegex.exec(
      antibioticsGroupTextBlob!
    );
  }

  // CEPA    FECHARECOGIDA  SERVICIO    TIPO DE MUESTRA     EDAD    GÉNERO
  const patientDataBlockRegex = new RegExp(
    /QUITO\s*-\s*ECUADOR\s*([\w\W]*)Antibioterapia:\s*Número de aislado:Ninguno\s*Crecimiento y detecciónTipos de tests:\s*Nombre del test:UROCULTIVO/
  );
  const patientBlockMatch = patientDataBlockRegex.exec(text);
  const patientBlockText = patientBlockMatch && patientBlockMatch[1];

  const recollectionDayRegex = new RegExp(
    /Fecha de recibo:\s*([\d\/]*)\s*[\d:]*Fecha de recogida:/
  );
  const recollectionDayMatch =
    recollectionDayRegex.exec(patientBlockText!)![1] || "Missing Data";

  data.fechaDeRecogida = recollectionDayMatch;

  const serviceNameRegex = new RegExp(
    /muestra:\s*([A-Za-zÀ-ÖØ-öø-ÿ\s*]*)Servicio de/
  );
  const serviceNameMatch =
    serviceNameRegex.exec(patientBlockText!)![1] || "Missing Data";

  data.servicio = serviceNameMatch;

  const sampleTypeRegex = new RegExp(
    /N° de acceso:\s*([A-Za-zÀ-ÖØ-öø-ÿ]*)Tipo de muestra:/
  );
  const sampleTypeMatch =
    sampleTypeRegex.exec(patientBlockText!)![1] || "Missing Data";

  data.tipoDeMuestra = sampleTypeMatch;

  const genderAndAgeRegex = new RegExp(
    /\d+\s*(\w*)Sexo del paciente:([\d\/]*)/
  );
  const genderAndAgeMatches = genderAndAgeRegex.exec(patientBlockText!);

  const genderMatch = genderAndAgeMatches![1] || "Missing Data";
  const ageMatch = calculateAge(genderAndAgeMatches![2] || "Missing Data");

  data.genero = genderMatch;
  data.edad = ageMatch.toString();
  console.log("parsed data", data);
  return data;
}
