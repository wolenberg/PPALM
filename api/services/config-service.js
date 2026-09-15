const fs = require("fs");
const path = require("path");

const CONFIG_DIR = path.join(process.cwd(), "config");
const APP_REG_PATH = path.join(CONFIG_DIR, "app-registration.json");

// Guardamos só o clientId (client público do Entra ID, sem secret — ver
// docs/VALIDATION-ENGINE.md). Não há nada sensível aqui: um client id de
// client público não é segredo, então é seguro manter em config/.
function getAppRegistration() {
  if (!fs.existsSync(APP_REG_PATH)) {
    return { clientId: null, configured: false };
  }
  const data = JSON.parse(fs.readFileSync(APP_REG_PATH, "utf8"));
  return { ...data, configured: Boolean(data.clientId) };
}

function saveAppRegistration({ clientId }) {
  if (!clientId || typeof clientId !== "string") {
    throw new Error("clientId é obrigatório");
  }
  fs.writeFileSync(APP_REG_PATH, JSON.stringify({ clientId }, null, 2));
  return getAppRegistration();
}

module.exports = { getAppRegistration, saveAppRegistration };
