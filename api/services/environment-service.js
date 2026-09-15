const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join(process.cwd(), "config");

function getEnvironmentConfigs() {
  const files = fs.readdirSync(CONFIG_PATH);

  return files
    .filter((file) => file.endsWith(".json") && file !== "app-registration.json")
    .map((file) => {
      const fullPath = path.join(CONFIG_PATH, file);
      const content = JSON.parse(fs.readFileSync(fullPath, "utf8"));

      return {
        name: file.replace(".json", ""),
        ...content,
      };
    });
}

function getEnvironmentByName(environmentName) {
  const environments = getEnvironmentConfigs();

  return environments.find(
    (env) => env.name.toLowerCase() === String(environmentName).toLowerCase()
  );
}

function getEnvironmentNames() {
  return getEnvironmentConfigs().map((env) => env.name);
}

// Cria um novo config/<nome>.json — a "configuração mínima" de um ambiente
// (URL + IDs). Nunca aceita segredos aqui; autenticação é via device code.
function createEnvironment({ name, url, environmentId, tenantId }) {
  if (!name || !/^[a-zA-Z0-9_-]+$/.test(name)) {
    throw new Error("Nome de ambiente inválido (use apenas letras, números, - e _)");
  }
  if (!url) {
    throw new Error("url é obrigatório");
  }
  if (getEnvironmentByName(name)) {
    throw new Error(`Já existe um ambiente chamado "${name}"`);
  }

  const filePath = path.join(CONFIG_PATH, `${name}.json`);
  const content = {
    environmentId: environmentId || null,
    tenantId: tenantId || null,
    url,
    solution: "PPALMCore",
  };

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  return { name, ...content };
}

module.exports = {
  getEnvironmentConfigs,
  getEnvironmentByName,
  getEnvironmentNames,
  createEnvironment,
};
