const fs = require("fs");
const path = require("path");

const envPath = "./solutions/PPALMCore/environmentvariabledefinitions";

function analyzeEnvironmentVariables() {
  if (!fs.existsSync(envPath)) return [];

  return fs
    .readdirSync(envPath)
    .filter((folder) => fs.statSync(path.join(envPath, folder)).isDirectory());
}

function printReport(schemaNames) {
  console.log("");
  console.log("Environment Variables");
  console.log("---------------------");
  if (schemaNames.length === 0) {
    console.log("No Environment Variables Found");
  } else {
    schemaNames.forEach((name) => console.log(`✅ ${name}`));
  }
}

// Continua funcionando via `node analyzers/environment-variable-analyzer.js`
if (require.main === module) {
  printReport(analyzeEnvironmentVariables());
}

module.exports = { analyzeEnvironmentVariables };
