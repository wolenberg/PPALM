const fs = require('fs');
const path = require('path');
const { getEnvironmentVariableValues, getConnectionReferences } = require('../lib/dataverseClient');

const REQUIREMENTS_PATH = path.join(__dirname, '..', 'analyzers', 'requirements.json');
const TARGET_CONFIG_PATH = process.env.PPALM_TARGET_CONFIG || './config/test.json';
const REPORT_PATH = path.join(__dirname, '..', 'releases', 'validation-report.json');

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function diffEnvironmentVariables(required, actual) {
  const actualBySchema = new Map(actual.map((v) => [v.schemaname, v]));

  return required.map((req) => {
    const found = actualBySchema.get(req.schemaName);
    const values = found?.environmentvariabledefinition_environmentvariablevalue || [];
    const hasValue = values.length > 0 && Boolean(values[0].value);

    let status = 'OK';
    if (!found) status = 'MISSING_DEFINITION';
    else if (!hasValue) status = 'MISSING_VALUE';

    return { schemaName: req.schemaName, existsInEnvironment: Boolean(found), hasValue, status };
  });
}

function diffConnectionReferences(required, actual) {
  const actualByName = new Map(actual.map((c) => [c.connectionreferencelogicalname, c]));

  return required.map((req) => {
    const found = actualByName.get(req.logicalName);
    let status = 'OK';
    if (!found) status = 'MISSING_REFERENCE';
    else if (!found.connectionid) status = 'NOT_BOUND';

    return {
      logicalName: req.logicalName,
      existsInEnvironment: Boolean(found),
      isBound: Boolean(found?.connectionid),
      status,
    };
  });
}

function printSection(title, rows, labelKey) {
  console.log(title);
  console.log('-'.repeat(title.length));
  if (rows.length === 0) {
    console.log('Nenhum item exigido pela solução.');
  } else {
    rows.forEach((r) => {
      const icon = r.status === 'OK' ? '✅' : '❌';
      console.log(`${icon} ${r[labelKey]} (${r.status})`);
    });
  }
  console.log('');
}

async function run() {
  console.log('=================================');
  console.log('PPALM Environment Validation');
  console.log('=================================');

  const requirements = loadJson(REQUIREMENTS_PATH);
  const targetConfig = loadJson(TARGET_CONFIG_PATH);

  console.log(`Ambiente: ${targetConfig.url}`);
  console.log(`Solução:  ${requirements.solution}`);
  console.log('');

  // Na primeira execução (ou quando o token expira) isso imprime o código
  // de dispositivo — complete o login em https://microsoft.com/devicelogin
  const onDeviceCode = (message) => console.log(`\n${message}\n`);

  const [envVarsInEnvironment, connectionRefsInEnvironment] = await Promise.all([
    getEnvironmentVariableValues(targetConfig.url, { onDeviceCode }),
    getConnectionReferences(targetConfig.url, { onDeviceCode }),
  ]);

  const environmentVariables = diffEnvironmentVariables(
    requirements.environmentVariables || [],
    envVarsInEnvironment
  );
  const connectionReferences = diffConnectionReferences(
    requirements.connectionReferences || [],
    connectionRefsInEnvironment
  );

  printSection('Environment Variables', environmentVariables, 'schemaName');
  printSection('Connection References', connectionReferences, 'logicalName');

  const failures = [...environmentVariables, ...connectionReferences].filter((r) => r.status !== 'OK');

  const report = {
    environment: targetConfig.url,
    solution: requirements.solution,
    checkedAt: new Date().toISOString(),
    environmentVariables,
    connectionReferences,
    readiness: failures.length === 0,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log(
    report.readiness
      ? '✅ Ambiente pronto para deploy.'
      : `❌ ${failures.length} pendência(s) encontrada(s). Veja releases/validation-report.json`
  );

  process.exitCode = report.readiness ? 0 : 1;
}

run().catch((err) => {
  console.error('Erro ao validar ambiente:', err.message);
  process.exitCode = 1;
});
