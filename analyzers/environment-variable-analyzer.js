const fs = require("fs");
const path = require("path");

const envPath =
  "./solutions/PPALMCore/environmentvariabledefinitions";

console.log("");
console.log("Environment Variables");
console.log("---------------------");

if (!fs.existsSync(envPath)) {
  console.log("No Environment Variables Found");
  process.exit(0);
}

const folders =
  fs.readdirSync(envPath);

folders.forEach(folder => {

  const fullPath =
    path.join(envPath, folder);

  if (fs.statSync(fullPath).isDirectory()) {

    console.log(`✅ ${folder}`);

  }

});
