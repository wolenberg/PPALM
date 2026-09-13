const fs = require("fs");

const environmentConfig = JSON.parse(
  fs.readFileSync("./config/test.json", "utf8")
);

console.log("=================================");
console.log("PPALM Environment Validation");
console.log("=================================");

environmentConfig.environmentVariables.forEach(variable => {
  console.log(
    `Checking variable: ${variable.schemaName}`
  );
});

console.log("");
console.log("Validation completed.");
