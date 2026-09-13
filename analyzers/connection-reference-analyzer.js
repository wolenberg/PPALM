const fs = require("fs");
const path = require("path");

const connPath =
  "./solutions/PPALMCore/connectionreferences";

console.log("");
console.log("Connection References");
console.log("---------------------");

if (!fs.existsSync(connPath)) {
  console.log("No Connection References Found");
  process.exit(0);
}

const folders =
  fs.readdirSync(connPath);

folders.forEach(folder => {

  const fullPath =
    path.join(connPath, folder);

  if (fs.statSync(fullPath).isDirectory()) {

    console.log(`✅ ${folder}`);

  }

});
