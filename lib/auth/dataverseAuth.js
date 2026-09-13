const { PublicClientApplication } = require('@azure/msal-node');

// Client PÚBLICO (sem secret) registrado para o PPALM no Azure AD/Entra ID.
// Ver docs/VALIDATION-ENGINE.md > "Autenticação com o Dataverse" para o motivo
// de não reaproveitarmos o cache de token do próprio pac CLI (ele não expõe
// uma API para outros processos lerem o token já emitido).
const CLIENT_ID = process.env.PPALM_CLIENT_ID || '<seu-client-id-aqui>';
const AUTHORITY = 'https://login.microsoftonline.com/organizations';

const msalApp = new PublicClientApplication({
  auth: { clientId: CLIENT_ID, authority: AUTHORITY },
});

// Cache simples em memória, por ambiente (origem da URL). Suficiente para
// uma execução de validação; não persiste em disco.
const tokenCache = new Map();

/**
 * Obtém um access token para o Dataverse do ambiente informado, disparando
 * o fluxo de device code na primeira vez (ou quando o token expira).
 *
 * @param {string} environmentUrl - ex: https://org-test.crm.dynamics.com
 * @param {Object} [opts]
 * @param {(message: string) => void} [opts.onDeviceCode] - callback para
 *   exibir o código de dispositivo (console.log por padrão; no futuro pode
 *   ser plugado no console em tempo real da web UI).
 */
async function getAccessToken(environmentUrl, { onDeviceCode } = {}) {
  const resource = new URL(environmentUrl).origin;
  const scope = `${resource}/.default`;

  const cached = tokenCache.get(resource);
  if (cached && cached.expiresOn > Date.now() + 60_000) {
    return cached.accessToken;
  }

  const result = await msalApp.acquireTokenByDeviceCode({
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
}

module.exports = { getAccessToken };
