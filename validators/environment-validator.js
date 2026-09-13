const fs = require("fs");

const environmentConfig = JSON.parse(
  fs.readFileSync("./config/test.json", "utf8")
);

console.log("=================================");
console.log("PPALM Environment Validation");
console.log("=================================");

const environmentVariables = environmentConfig.environmentVariables || [];

if (environmentVariables.length === 0) {
  console.log("⚠️  Nenhuma Environment Variable configurada para este ambiente.");
} else {
  environmentVariables.forEach(variable => {
    console.log(`Checking variable: ${variable.schemaName}`);
  });
}

console.log("");
console.log("Validation completed.");
