const fs = require("fs");
const path = require("path");

const connPath = "./solutions/PPALMCore/connectionreferences";

function analyzeConnectionReferences() {
  if (!fs.existsSync(connPath)) return [];

  return fs
    .readdirSync(connPath)
    .filter((folder) => fs.statSync(path.join(connPath, folder)).isDirectory());
}

function printReport(names) {
  console.log("");
  console.log("Connection References");
  console.log("---------------------");
  if (names.length === 0) {
    console.log("No Connection References Found");
  } else {
    names.forEach((name) => console.log(`✅ ${name}`));
  }
}

if (require.main === module) {
  printReport(analyzeConnectionReferences());
}

module.exports = { analyzeConnectionReferences };
