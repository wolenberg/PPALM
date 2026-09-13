const fs = require("fs");
const path = require("path");

const entitiesPath =
  "./solutions/PPALMCore/Entities";

console.log("");
console.log("Tables");
console.log("---------------------");

if (!fs.existsSync(entitiesPath)) {

  console.log("No Tables Found");

  process.exit(0);

}

const folders =
  fs.readdirSync(entitiesPath);

folders.forEach(folder => {

  const fullPath =
    path.join(entitiesPath, folder);

  if (fs.statSync(fullPath).isDirectory()) {

    console.log(`✅ ${folder}`);

  }

});
