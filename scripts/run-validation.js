const { execSync } = require("child_process");

console.log("");
console.log("================================");
console.log("PPALM Validation Engine");
console.log("================================");
console.log("");

try {

  console.log("Running Publisher Validator...");
  execSync(
    "node validators/publisher-validator.js",
    { stdio: "inherit" }
  );

  console.log("");

  console.log("Running Solution Variable Scanner...");
  execSync(
    "node validators/solution-variable-scanner.js",
    { stdio: "inherit" }
  );

  console.log("");

  console.log("Running Environment Diff...");
  execSync(
    "node validators/environment-diff.js",
    { stdio: "inherit" }
  );

  console.log("");

  console.log("Validation completed successfully.");

} catch (error) {

  console.error("");
  console.error("Validation failed.");
  process.exit(1);

}
