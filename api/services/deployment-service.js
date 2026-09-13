const { execSync } =
require("child_process");

function exportSolution({
  environment,
  solutionName,
  output
}) {

  const command = `
    pac solution export \
    --environment ${environment} \
    --name ${solutionName} \
    --path ${output}
  `;

  const result =
    execSync(command);

  return result.toString();
}

function importSolution({
  environment,
  packagePath
}) {

  const command = `
    pac solution import \
    --environment ${environment} \
    --path ${packagePath}
  `;

  const result =
    execSync(command);

  return result.toString();
}

module.exports = {

  exportSolution,

  importSolution

};
