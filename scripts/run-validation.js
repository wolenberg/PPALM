const { execSync } =
require("child_process");

console.log("");
console.log("=================================");
console.log("PPALM Validation Engine");
console.log("=================================");

try {

    console.log("");
    console.log("Running Solution Analyzer");

    execSync(
      "node scripts/analyze-solution.js",
      { stdio: "inherit" }
    );

    console.log("");
    console.log("Running Environment Validator");

    execSync(
      "node validators/environment-validator.js",
      { stdio: "inherit" }
    );

    console.log("");
    console.log("Running Environment Diff");

    execSync(
      "node validators/environment-diff.js",
      { stdio: "inherit" }
    );

    console.log("");
    console.log("✅ Validation Completed");

}
catch(error){

    console.error("");
    console.error("❌ Validation Failed");

    process.exit(1);

}
