const fs = require("fs");
const path = require("path");

const expectedPrefix = "ppa";

const solutionPath = "./solutions/PPALMCore";

function scanDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      scanDirectory(fullPath);
    } else {
      validateFile(fullPath);
    }
  }
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  const matches = content.match(
    new RegExp(`${expectedPrefix}_`, "gi")
  );

  if (matches) {
    console.log(`✅ OK: ${filePath}`);
  }
}

console.log("Running Publisher Validator...");
scanDirectory(solutionPath);
console.log("Validation finished.");
