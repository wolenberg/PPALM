const fs = require("fs");
const path = require("path");

const variablesPath =
  "./solutions/PPALMCore/environmentvariabledefinitions";

console.log("");
console.log("Environment Variables Found:");
console.log("");

const folders =
  fs.readdirSync(variablesPath);

folders.forEach(folder => {

  const fullPath =
    path.join(variablesPath, folder);

  if (fs.statSync(fullPath).isDirectory()) {

    console.log(`✅ ${folder}`);

  }

});
