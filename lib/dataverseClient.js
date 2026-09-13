const { getAccessToken } = require('./auth/dataverseAuth');

/**
 * GET genérico no Dataverse Web API, com paginação automática via
 * @odata.nextLink. Usa o fetch nativo do Node (18+).
 */
async function webApiGet(environmentUrl, path, { onDeviceCode } = {}) {
  const token = await getAccessToken(environmentUrl, { onDeviceCode });
  const baseUrl = `${environmentUrl.replace(/\/$/, '')}/api/data/v9.2/${path}`;

  const results = [];
  let nextUrl = baseUrl;

  while (nextUrl) {
    const res = await fetch(nextUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
      },
    });

    if (!res.ok) {
      throw new Error(`Dataverse Web API retornou ${res.status}: ${await res.text()}`);
    }

    const body = await res.json();
    results.push(...(body.value || []));
    nextUrl = body['@odata.nextLink'] || null;
  }

  return results;
}

/**
 * Retorna as Environment Variable Definitions do ambiente, já com o valor
 * configurado (se existir) via $expand na relação 1:N para
 * environmentvariablevalue.
 */
function getEnvironmentVariableValues(environmentUrl, opts) {
  return webApiGet(
    environmentUrl,
    'environmentvariabledefinitions' +
      '?$select=schemaname,displayname' +
      '&$expand=environmentvariabledefinition_environmentvariablevalue($select=value)',
    opts
  );
}

/**
 * Retorna as Connection References do ambiente. connectionid vazio/nulo
 * significa que a referência existe mas não está associada a uma conexão
 * real (ou seja, precisa ser configurada antes do deploy funcionar).
 */
function getConnectionReferences(environmentUrl, opts) {
  return webApiGet(
    environmentUrl,
    'connectionreferences' +
      '?$select=connectionreferencelogicalname,connectionreferencedisplayname,connectionid',
    opts
  );
}

module.exports = { getEnvironmentVariableValues, getConnectionReferences };
