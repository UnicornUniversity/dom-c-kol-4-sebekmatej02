/**
 * Hlavní funkce programu - generuje zaměstnance a vypočítá statistiky.
 * @param {object} dtoIn Vstupní objekt obsahující: count (počet zaměstnanců), age {min, max} (věkové rozpětí).
 * @returns {object} dtoOut - Objekt obsahující seznam zaměstnanců a jejich statistiky.
 */
export function main(dtoIn) {
  // Vygenerování seznamu zaměstnanců
  const employeeList = generateEmployeeData(dtoIn);

  // Výpočet statistik ze seznamu zaměstnanců
  const statistics = getEmployeeStatistics(employeeList);

  // Vytvoření a vrácení výstupního objektu
  const dtoOut = {
    employees: employeeList,
    sortedByWorkload: statistics.sortedByWorkload,
    ...statistics,
  };

  return dtoOut;
}

/**
 * Generuje náhodný seznam zaměstnanců.
 * @param {object} dtoIn Vstupní objekt obsahující: count (počet zaměstnanců), age {min, max} (věkové rozpětí).
 * @returns {Array} Pole zaměstnanců.
 */
export function generateEmployeeData(dtoIn) {
  const employees = [];

  for (let i = 0; i < dtoIn.count; i++) {
    const employee = generateEmployee(dtoIn.age.min, dtoIn.age.max);
    employees.push(employee);
  }

  return employees;
}

/**
 * Vypočítá statistiky ze seznamu zaměstnanců.
 * @param {Array} employees Pole zaměstnanců.
 * @returns {object} Objekt obsahující všechny požadované statistiky.
 */
export function getEmployeeStatistics(employees) {
  // Počet zaměstnanců
  const total = employees.length;

  // Počet zaměstnanců podle úvazku
  const workloadCounts = getWorkloadCounts(employees);

  // Získání věků všech zaměstnanců
  const ages = employees.map((emp) => calculateAge(emp.birthdate));

  // Průměrný věk
  const averageAge = calculateAverage(ages);

  // Minimální a maximální věk (zaokrouhlené na celá čísla)
  const minAge = Math.floor(Math.min(...ages));
  const maxAge = Math.floor(Math.max(...ages));

  // Medián věku (zkrácený na celé číslo)
  const ageMedian = Math.floor(calculateMedian(ages));

  // Medián úvazku
  const workloads = employees.map((emp) => emp.workload);
  const workloadMedian = calculateMedian(workloads);

  // Průměrný úvazek žen
  const femaleAverageWorkload = calculateFemaleAverageWorkload(employees);

  // Seřazení zaměstnanců podle úvazku
  const sortedByWorkload = sortEmployeesByWorkload(employees);

  return {
    total: total,
    workload10: workloadCounts["10"],
    workload20: workloadCounts["20"],
    workload30: workloadCounts["30"],
    workload40: workloadCounts["40"],
    averageAge: averageAge,
    minAge: minAge,
    maxAge: maxAge,
    medianAge: ageMedian,
    medianWorkload: workloadMedian,
    averageWomenWorkload: femaleAverageWorkload,
    sortedByWorkload: sortedByWorkload,
  };
}

/**
 * Spočítá počet zaměstnanců pro každou kategorii úvazku.
 * @param {Array} employees Pole zaměstnanců.
 * @returns {object} Objekt s počty pro každý úvazek.
 */
function getWorkloadCounts(employees) {
  const counts = {
    10: 0,
    20: 0,
    30: 0,
    40: 0,
  };

  for (let employee of employees) {
    counts[employee.workload.toString()]++;
  }

  return counts;
}

/**
 * Vypočítá věk zaměstnance na základě data narození.
 * @param {string} birthdate Datum narození ve formátu ISO 8601.
 * @returns {number} Věk v letech jako desetinné číslo.
 */
function calculateAge(birthdate) {
  const birth = new Date(birthdate);
  const now = new Date();

  // Přesný věk v letech (včetně desetinné části)
  const age = (now - birth) / (1000 * 60 * 60 * 24 * 365.25);

  return age;
}

/**
 * Vypočítá průměr z pole čísel.
 * @param {Array} numbers Pole čísel.
 * @returns {number} Průměr zaokrouhlený na jedno desetinné místo.
 */
function calculateAverage(numbers) {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const average = sum / numbers.length;
  return Math.round(average * 10) / 10;
}

/**
 * Vypočítá medián z pole čísel.
 * @param {Array} numbers Pole čísel.
 * @returns {number} Medián.
 */
function calculateMedian(numbers) {
  // Vytvoříme kopii pole a seřadíme ji
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  // Pokud je sudý počet prvků, vrátíme průměr prostředních dvou
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  // Pokud je lichý počet prvků, vrátíme prostřední prvek
  return sorted[middle];
}

/**
 * Vypočítá průměrný úvazek žen.
 * @param {Array} employees Pole zaměstnanců.
 * @returns {number} Průměrný úvazek žen zaokrouhlený na jedno desetinné místo.
 */
function calculateFemaleAverageWorkload(employees) {
  const femaleEmployees = employees.filter((emp) => emp.gender === "female");

  if (femaleEmployees.length === 0) {
    return 0;
  }

  const femaleWorkloads = femaleEmployees.map((emp) => emp.workload);
  return calculateAverage(femaleWorkloads);
}

/**
 * Seřadí zaměstnance podle úvazku od nejmenšího po největší.
 * @param {Array} employees Pole zaměstnanců.
 * @returns {Array} Seřazené pole zaměstnanců.
 */
function sortEmployeesByWorkload(employees) {
  // Vytvoříme kopii pole, abychom neměnili originál
  return [...employees].sort((a, b) => a.workload - b.workload);
}

// Datová pole
const maleNames = [
  "Jan",
  "Petr",
  "Pavel",
  "Tomáš",
  "Jiří",
  "Josef",
  "Martin",
  "Jaroslav",
  "Miroslav",
  "František",
];

const femaleNames = [
  "Jana",
  "Marie",
  "Eva",
  "Anna",
  "Hana",
  "Věra",
  "Lenka",
  "Petra",
  "Lucie",
  "Kateřina",
];

const maleSurnames = [
  "Novák",
  "Svoboda",
  "Novotný",
  "Dvořák",
  "Černý",
  "Procházka",
  "Kučera",
  "Veselý",
  "Horák",
  "Němec",
];

const femaleSurnames = [
  "Nováková",
  "Svobodová",
  "Novotná",
  "Dvořáková",
  "Černá",
  "Procházková",
  "Kučerová",
  "Veselá",
  "Horáková",
  "Němcová",
];

const workloads = [10, 20, 30, 40];

/**
 * Vygeneruje náhodného zaměstnance.
 * @param {number} minAge Minimální věk zaměstnance.
 * @param {number} maxAge Maximální věk zaměstnance.
 * @returns {object} Objekt zaměstnance s vlastnostmi name, surname, gender, birthdate, workload.
 */
function generateEmployee(minAge, maxAge) {
  const gender = Math.random() < 0.5 ? "male" : "female";

  let name, surname;
  if (gender === "male") {
    name = maleNames[Math.floor(Math.random() * maleNames.length)];
    surname = maleSurnames[Math.floor(Math.random() * maleSurnames.length)];
  } else {
    name = femaleNames[Math.floor(Math.random() * femaleNames.length)];
    surname = femaleSurnames[Math.floor(Math.random() * femaleSurnames.length)];
  }

  const birthdate = generateBirthdate(minAge, maxAge);
  const workload = workloads[Math.floor(Math.random() * workloads.length)];

  return {
    name: name,
    surname: surname,
    gender: gender,
    birthdate: birthdate,
    workload: workload,
  };
}

/**
 * Vygeneruje náhodné datum narození tak, aby věk byl v intervalu minAge až maxAge.
 * @param {number} minAge Minimální věk.
 * @param {number} maxAge Maximální věk.
 * @returns {string} Datum narození ve formátu ISO 8601.
 */
function generateBirthdate(minAge, maxAge) {
  const now = new Date();

  // Přibližný počet milisekund v roce (365.25 dne)
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;

  // Nejstarší možné datum narození (pro maximální věk)
  const oldestDate = now.getTime() - maxAge * msPerYear;

  // Nejmladší možné datum narození (pro minimální věk)
  const youngestDate = now.getTime() - minAge * msPerYear;

  // Vygenerujeme náhodný timestamp mezi těmito hranicemi
  const randomTimestamp =
    oldestDate + Math.random() * (youngestDate - oldestDate);

  // Vytvoříme datum a vrátíme ve formátu ISO
  const birthdate = new Date(randomTimestamp);

  return birthdate.toISOString();
}
