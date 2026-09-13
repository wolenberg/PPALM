const fs = require("fs");

const expected =
JSON.parse(
  fs.readFileSync(
    "./config/test.json",
    "utf8"
  )
);

const solutionVariables = [
  "ppa_API_URL",
  "ppa_NOTIFICATION_EMAIL"
];

console.log("");

expected.environmentVariables.forEach(
  variable => {

    if (
      solutionVariables.includes(
        variable.schemaName
      )
    ) {

      console.log(
        `✅ ${variable.schemaName}`
      );

    } else {

      console.log(
        `❌ Missing ${variable.schemaName}`
      );

    }
  }
);
