const fs = require("fs");
const path = require("path");

const CONFIG_PATH =
path.join(
  process.cwd(),
  "config"
);

function getEnvironmentConfigs() {

  const files =
    fs.readdirSync(CONFIG_PATH);

  return files
    .filter(
      file =>
      file.endsWith(".json")
    )
    .map(file => {

      const fullPath =
        path.join(
          CONFIG_PATH,
          file
        );

      const content =
        JSON.parse(
          fs.readFileSync(
            fullPath,
            "utf8"
          )
        );

      return {

        name:
          file.replace(
            ".json",
            ""
          ),

        ...content

      };

    });

}

function getEnvironmentByName(
  environmentName
) {

  const environments =
    getEnvironmentConfigs();

  return environments.find(
    env =>
    env.name.toLowerCase() ===
    environmentName.toLowerCase()
  );

}

function getEnvironmentNames() {

  return getEnvironmentConfigs()
    .map(env => env.name);

}

module.exports = {

  getEnvironmentConfigs,

  getEnvironmentByName,

  getEnvironmentNames

};
