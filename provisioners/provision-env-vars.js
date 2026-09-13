const fs = require("fs");

const config = JSON.parse(
  fs.readFileSync(
    "./config/test.json",
    "utf8"
  )
);

console.log("");
console.log("Provisioning Variables");

config.environmentVariables.forEach(
  variable => {

    console.log(
      `Creating ${variable.schemaName}`
    );

  }
);
