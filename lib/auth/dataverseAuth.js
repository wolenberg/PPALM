const fs = require('fs');
const path = require('path');
const { PublicClientApplication } = require('@azure/msal-node');

const APP_REG_PATH = path.join(__dirname, '..', '..', 'config', 'app-registration.json');
const AUTHORITY = 'https://login.microsoftonline.com/organizations';

// Resolve o Client ID na hora (não mais uma vez só, no carregamento do
// módulo) — assim, se você salvar um novo Client ID pela aba "App
// Registration" do frontend, a próxima autenticação já usa o valor certo.
function resolveClientId() {
  if (process.env.PPALM_CLIENT_ID) return process.env.PPALM_CLIENT_ID;

  if (fs.existsSync(APP_REG_PATH)) {
    const data = JSON.parse(fs.readFileSync(APP_REG_PATH, 'utf8'));
    if (data.clientId) return data.clientId;
  }

  throw new Error(
    'Nenhum Client ID configurado. Salve um na aba "App Registration" do ' +
      'frontend, ou defina PPALM_CLIENT_ID no .env.'
  );
}

let msalApp = null;
function getMsalApp() {
  if (!msalApp) {
    msalApp = new PublicClientApplication({
      auth: { clientId: resolveClientId(), authority: AUTHORITY },
    });
  }
  return msalApp;
}

const tokenCache = new Map();
// Evita que duas chamadas concorrentes (ex: env vars + connection refs, que
// rodam em Promise.all) disparem dois fluxos de device code ao mesmo tempo
// para o mesmo ambiente — a segunda chamada simplesmente aguarda a primeira.
const inFlight = new Map();

async function getAccessToken(environmentUrl, { onDeviceCode } = {}) {
  const resource = new URL(environmentUrl).origin;
  const scope = `${resource}/.default`;

  const cached = tokenCache.get(resource);
  if (cached && cached.expiresOn > Date.now() + 60_000) {
    return cached.accessToken;
  }

  if (inFlight.has(resource)) {
    return inFlight.get(resource);
  }

  const promise = (async () => {
    const app = getMsalApp();
    const result = await app.acquireTokenByDeviceCode({
      scopes: [scope],
      deviceCodeCallback: (response) => {
        if (onDeviceCode) onDeviceCode(response.message);
        else console.log(response.message);
      },
    });

    tokenCache.set(resource, {
      accessToken: result.accessToken,
      expiresOn: result.expiresOn.getTime(),
    });

    return result.accessToken;
  })();

  inFlight.set(resource, promise);
  try {
    return await promise;
  } finally {
    inFlight.delete(resource);
  }
}

module.exports = { getAccessToken };
