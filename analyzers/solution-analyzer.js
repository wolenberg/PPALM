const fs = require("fs");
const path = require("path");

const { analyzeEnvironmentVariables } = require("./environment-variable-analyzer");
const { analyzeConnectionReferences } = require("./connection-reference-analyzer");
const { analyzeTables } = require("./table-analyzer");
const { analyzeFlows } = require("./flow-analyzer");

const SOLUTION_XML_PATH = "./solutions/PPALMCore/Other/Solution.xml";
const REQUIREMENTS_PATH = path.join(__dirname, "requirements.json");

function getSolutionInfo() {
  const xml = fs.readFileSync(SOLUTION_XML_PATH, "utf8");
  const nameMatch = xml.match(/<UniqueName>(.*?)<\/UniqueName>/);
  const versionMatch = xml.match(/<Version>(.*?)<\/Version>/);

  return {
    name: nameMatch ? nameMatch[1] : "Unknown",
    version: versionMatch ? versionMatch[1] : "0.0.0.0",
  };
}

function printSection(title, items) {
  console.log("");
  console.log(title);
  console.log("-".repeat(title.length));
  if (items.length === 0) {
    console.log(`No ${title} Found`);
  } else {
    items.forEach((item) => console.log(`✅ ${item}`));
  }
}

// Ponto central: roda todos os sub-analyzers, imprime o mesmo relatório de
// sempre no console E grava analyzers/requirements.json — o contrato que o
// Environment Validator consome para saber o que a solução exige.
function run() {
  console.log("");
  console.log("=================================");
  console.log("PPALM Solution Analyzer");
  console.log("=================================");

  const environmentVariables = analyzeEnvironmentVariables();
  const connectionReferences = analyzeConnectionReferences();
  const tables = analyzeTables();
  const flows = analyzeFlows();
  const solution = getSolutionInfo();

  printSection("Environment Variables", environmentVariables);
  printSection("Connection References", connectionReferences);
  printSection("Tables", tables);
  printSection("Flows", flows);

  console.log("");
  console.log("Solution");
  console.log("---------------------");
  console.log(`Version: ${solution.version}`);

  const requirements = {
    solution: solution.name,
    version: solution.version,
    generatedAt: new Date().toISOString(),
    environmentVariables: environmentVariables.map((schemaName) => ({ schemaName })),
    connectionReferences: connectionReferences.map((logicalName) => ({ logicalName })),
    tables,
    flows,
  };

  fs.writeFileSync(REQUIREMENTS_PATH, JSON.stringify(requirements, null, 2));

  console.log("");
  console.log(`✅ requirements.json atualizado (${REQUIREMENTS_PATH})`);
  console.log("✅ Analysis Completed");

  return requirements;
}

if (require.main === module) {
  run();
}

module.exports = { run };
