const fs = require("fs");
const path = require("path");

const entitiesPath = "./solutions/PPALMCore/Entities";

function analyzeTables() {
  if (!fs.existsSync(entitiesPath)) return [];

  return fs
    .readdirSync(entitiesPath)
    .filter((folder) => fs.statSync(path.join(entitiesPath, folder)).isDirectory());
}

function printReport(tables) {
  console.log("");
  console.log("Tables");
  console.log("---------------------");
  if (tables.length === 0) {
    console.log("No Tables Found");
  } else {
    tables.forEach((t) => console.log(`✅ ${t}`));
  }
}

if (require.main === module) {
  printReport(analyzeTables());
}

module.exports = { analyzeTables };
