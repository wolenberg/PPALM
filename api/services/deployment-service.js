const { execFile } = require("child_process");
const { promisify } = require("util");
const execFileAsync = promisify(execFile);

const { getEnvironmentByName } = require("./environment-service");

// Nunca aceitamos a URL do ambiente vinda direto do body: resolvemos o
// "environment" (nome) contra os arquivos em config/*.json. Isso impede que
// alguém aponte o pac CLI para uma org arbitrária via API, e é a mesma
// defesa que elimina a injeção de comando (ver nota abaixo).
function resolveEnvironmentUrl(environmentName) {
  const env = getEnvironmentByName(environmentName);
  if (!env) {
    throw new Error(`Ambiente "${environmentName}" não encontrado em config/`);
  }
  return env.url;
}

function assertValidSolutionName(solutionName) {
  if (!solutionName || !/^[a-zA-Z0-9_]+$/.test(solutionName)) {
    throw new Error("Nome de solução inválido (use apenas letras, números e _)");
  }
}

// IMPORTANTE: usamos execFile com argumentos em ARRAY, não execSync com uma
// string interpolada. Isso é o que efetivamente elimina a injeção de
// comando — cada elemento do array vira um argumento literal do processo
// "pac", nunca é interpretado por um shell.
async function exportSolution({ environment, solutionName, output }) {
  const environmentUrl = resolveEnvironmentUrl(environment);
  assertValidSolutionName(solutionName);

  if (!output || typeof output !== "string") {
    throw new Error("output é obrigatório");
  }

  const { stdout } = await execFileAsync("pac", [
    "solution",
    "export",
    "--environment",
    environmentUrl,
    "--name",
    solutionName,
    "--path",
    output,
  ]);

  return stdout;
}

async function importSolution({ environment, packagePath }) {
  const environmentUrl = resolveEnvironmentUrl(environment);

  if (!packagePath || typeof packagePath !== "string") {
    throw new Error("packagePath é obrigatório");
  }

  const { stdout } = await execFileAsync("pac", [
    "solution",
    "import",
    "--environment",
    environmentUrl,
    "--path",
    packagePath,
  ]);

  return stdout;
}

module.exports = { exportSolution, importSolution };
