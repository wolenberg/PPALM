const { execSync } =
require("child_process");

console.log("");
console.log("=================================");
console.log("PPALM Solution Analyzer");
console.log("=================================");

try {

    execSync(
      "node analyzers/environment-variable-analyzer.js",
      { stdio: "inherit" }
    );

    execSync(
      "node analyzers/connection-reference-analyzer.js",
      { stdio: "inherit" }
    );

    execSync(
      "node analyzers/table-analyzer.js",
      { stdio: "inherit" }
    );
    execSync(
      "node analyzers/flow-analyzer.js",
      { stdio:"inherit" }
    );
    execSync(
      "node analyzers/solution-analyzer.js",
      { stdio:"inherit" }
      );
    console.log("");
    console.log("✅ Analysis Completed");

}
catch(err){

    console.error("");
    console.error("❌ Analysis Failed");

    process.exit(1);

}
