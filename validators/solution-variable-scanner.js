const fs = require("fs");
const path = require("path");

const variables = [];

function scanFolder(folder) {
  const files = fs.readdirSync(folder);

  files.forEach(file => {

    const fullPath = path.join(folder, file);

    if (fs.statSync(fullPath).isDirectory()) {
      scanFolder(fullPath);
      return;
    }

    const content = fs.readFileSync(fullPath, "utf8");

    const regex =
      /ppa_[A-Za-z0-9_]+/g;

    const matches =
      content.match(regex);

    if (matches) {
      variables.push(...matches);
    }
  });
}

scanFolder("./solutions/PPALMCore");

const uniqueVariables =
  [...new Set(variables)];

console.log("Variables Found:");

uniqueVariables.forEach(v => {
  console.log(v);
});
