const fs = require("fs");

const workflowFolder = "./solutions/PPALMCore/Workflows";

function analyzeFlows() {
  if (!fs.existsSync(workflowFolder)) return [];

  return fs.readdirSync(workflowFolder).filter((file) => file.endsWith(".json"));
}

function printReport(flows) {
  console.log("");
  console.log("Flows");
  console.log("---------------------");
  if (flows.length === 0) {
    console.log("No Flows Found");
  } else {
    flows.forEach((f) => console.log(`✅ ${f}`));
  }
}

if (require.main === module) {
  printReport(analyzeFlows());
}

module.exports = { analyzeFlows };
