import { missingDataMarker, TestAnalisisRow } from "./csvWritter";

function calculateAge(birthday: string): number {
  // birthday is a date
  if (birthday === missingDataMarker) {
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
export enum FailReasons {
  unparsable = "unparsable",
  user_parse_fail = "user_parse_fail",
  antib_parse_fail = "antib_parse_fail"
}

export function parseResult(
  text: string,
  fileName: string
): { data: TestAnalisisRow; opRes: boolean; reason?: FailReasons } {
  console.info("processing file:" + fileName);
  const data: TestAnalisisRow = new TestAnalisisRow();
  data.cepa = fileName;
  const antibioticGroupRegex = new RegExp(
    // tslint:disable-next-line: trailing-comma
    /Grupo\s*de\s*\s*test\s*de\s*antibiótico([\w\W]*)Marcadores\s*de\s*resistencia\s*/
  );
  const match = antibioticGroupRegex.exec(text);
  if (!match) {
    console.error("--X-- file: " + fileName + " could not be parsed. FAIL");
    return {
      data,
      opRes: false,
      reason: FailReasons.unparsable
    };
  }
  const antibioticsGroupTextBlob = match && match[1];

  const singleAntibioticRegex = new RegExp(
    // tslint:disable-next-line: trailing-comma
    /[SRIX]\s*[ABCOU]\s*\d*\s*[RX]?\s*[SRI]\s*([<>=]{0,2}[/\d,]+)([A-Z][a-zí]+[A-Z-]{0,2}[a-zí]+)\s*/g
  );
  let singleAntibioticMatch = singleAntibioticRegex.exec(
    antibioticsGroupTextBlob!
  );
  if (!singleAntibioticMatch[1]) {
    console.error("--X-- file: " + fileName + " could not be parsed. FAIL");
    return {
      data,
      opRes: false,
      reason: FailReasons.antib_parse_fail
    };
  }

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
    /QUITO\s*-\s*ECUADOR\s*([\w\W]*)Antibioterapia:\s*Número de aislado:Ninguno\s*Crecimiento y detecciónTipos de tests:\s*Nombre del test:(UROCULTIVO|ABSCESO|CULTIVO DE LÍQUIDOS|CULTIVO DE SECRECIONES|COPROCULTIVO|BACTEC FX PEDS Plus\/F|BACTEC FX Lytic\/10 Anaerobic\/F|BACTEC FX PLUS Aerobic\/F|BACTEC FX Plus Anaerobic\/F)/
  );
  const patientBlockMatch = patientDataBlockRegex.exec(text);
  // if (!patientBlockMatch[1]) {
  //   console.warn(text);
  // }
  const patientBlockText = patientBlockMatch && patientBlockMatch[1];

  if (!patientBlockText) {
    console.error(
      "--X-- file: " + fileName + " user data could not be parsed. FAIL"
    );
    return {
      data,
      opRes: false,
      reason: FailReasons.user_parse_fail
    };
  }

  const recollectionDayRegex = new RegExp(
    /Fecha de recibo:\s*([\d\/]*)\s*[\d:]*Fecha de recogida:/
  );

  const recollectionDayMatch = recollectionDayRegex.exec(patientBlockText!);

  data.fechaDeRecogida =
    recollectionDayMatch && recollectionDayMatch.length >= 1
      ? recollectionDayMatch[1]
      : missingDataMarker;

  const serviceNameRegex = new RegExp(
    /muestra:\s*([A-Za-zÀ-ÖØ-öø-ÿ\s*]*)Servicio de/
  );
  const serviceNameMatch = serviceNameRegex.exec(patientBlockText!);
  data.servicio =
    serviceNameMatch && serviceNameMatch.length >= 1
      ? serviceNameMatch[1]
      : "Missing Data";

  const sampleTypeRegex = new RegExp(
    /N° de acceso:\s*([A-Za-zÀ-ÖØ-öø-ÿ\s]*)Tipo de muestra:/
  );
  const sampleTypeMatch = sampleTypeRegex.exec(patientBlockText!);
  data.tipoDeMuestra =
    sampleTypeMatch && sampleTypeMatch.length >= 1
      ? sampleTypeMatch[1]
      : missingDataMarker;

  const genderAndAgeRegex = new RegExp(
    /\d+\s*(\w*)Sexo del paciente:([\d\/]*)/
  );
  const genderAndAgeMatches = genderAndAgeRegex.exec(patientBlockText!);

  const genderMatch =
    genderAndAgeMatches && genderAndAgeMatches.length >= 1
      ? genderAndAgeMatches![1]
      : missingDataMarker;
  const ageMatch =
    genderAndAgeMatches && genderAndAgeMatches.length > 1
      ? calculateAge(genderAndAgeMatches![2])
      : missingDataMarker;

  data.genero = genderMatch;
  data.edad = ageMatch.toString();
  // console.log("parsed data", data);
  console.info("file:" + fileName + " parsed successfully. OK");
  return {
    data,
    opRes: true
  };
}
