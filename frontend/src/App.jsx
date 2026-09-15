import { useEffect, useState } from "react";
import "./App.css";
import {
  listEnvironments,
  createEnvironment,
  getAppRegistration,
  saveAppRegistration,
  analyzeSolution,
  validateSolution,
  exportSolution,
  importSolution,
} from "./services/api";

const TABS = ["ambientes", "appRegistration", "solucao", "deploy"];
const TAB_LABELS = {
  ambientes: "Ambientes",
  appRegistration: "App Registration",
  solucao: "Solução",
  deploy: "Deploy",
};

function ResultPanel({ result, error }) {
  if (!result && !error) return null;
  return (
    <pre className={`result-panel ${error ? "result-error" : ""}`}>
      {error || JSON.stringify(result, null, 2)}
    </pre>
  );
}

function AmbientesTab() {
  const [environments, setEnvironments] = useState([]);
  const [form, setForm] = useState({ name: "", url: "", environmentId: "", tenantId: "" });
  const [error, setError] = useState(null);

  const load = () => listEnvironments().then((d) => setEnvironments(d.environments));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createEnvironment(form);
      setForm({ name: "", url: "", environmentId: "", tenantId: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="tab-panel">
      <h2>Ambientes cadastrados</h2>
      <ul className="env-list">
        {environments.map((env) => (
          <li key={env.name}>
            <strong>{env.name}</strong> — {env.url}
          </li>
        ))}
      </ul>

      <h2>Novo ambiente</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nome (dev, test, prod...)
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label>
          URL do ambiente
          <input
            type="url"
            placeholder="https://minhaorg.crm.dynamics.com"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            required
          />
        </label>
        <label>
          Environment ID (opcional)
          <input
            value={form.environmentId}
            onChange={(e) => setForm({ ...form, environmentId: e.target.value })}
          />
        </label>
        <label>
          Tenant ID (opcional)
          <input
            value={form.tenantId}
            onChange={(e) => setForm({ ...form, tenantId: e.target.value })}
          />
        </label>
        <button type="submit">Salvar ambiente</button>
      </form>
      <ResultPanel error={error} />
    </div>
  );
}

function AppRegistrationTab() {
  const [clientId, setClientId] = useState("");
  const [configured, setConfigured] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAppRegistration().then((d) => {
      setClientId(d.appRegistration.clientId || "");
      setConfigured(d.appRegistration.configured);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    try {
      const d = await saveAppRegistration({ clientId });
      setConfigured(d.appRegistration.configured);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="tab-panel">
      <h2>App Registration (Entra ID)</h2>
      <p className="hint">
        Client público, sem secret — usado para autenticar no Dataverse via device
        code. Veja <code>docs/VALIDATION-ENGINE.md</code> para o passo a passo de
        criação no Azure Portal.
      </p>
      <p>
        Status atual:{" "}
        <span className={configured ? "status-ok" : "status-pending"}>
          {configured ? "configurado" : "pendente"}
        </span>
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          Client ID
          <input
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="00000000-0000-0000-0000-000000000000"
            required
          />
        </label>
        <button type="submit">Salvar</button>
      </form>
      {saved && <p className="status-ok">Salvo.</p>}
      <ResultPanel error={error} />
    </div>
  );
}

function SolucaoTab() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [environment, setEnvironment] = useState("test");
  const [environments, setEnvironments] = useState([]);

  useEffect(() => {
    listEnvironments().then((d) => setEnvironments(d.environments));
  }, []);

  const run = async (fn) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const d = await fn();
      setResult(d.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-panel">
      <h2>Análise e Validação</h2>
      <div className="button-row">
        <button onClick={() => run(analyzeSolution)} disabled={loading}>
          Analisar solução
        </button>
        <label className="inline-label">
          Ambiente
          <select value={environment} onChange={(e) => setEnvironment(e.target.value)}>
            {environments.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <button onClick={() => run(() => validateSolution({ environment }))} disabled={loading}>
          Validar ambiente
        </button>
      </div>
      {loading && <p className="hint">Executando... isso pode disparar um login por device code no terminal do servidor.</p>}
      <ResultPanel result={result} error={error} />
    </div>
  );
}

function DeployTab() {
  const [environments, setEnvironments] = useState([]);
  const [solutionName, setSolutionName] = useState("PPALMCore");
  const [sourceEnv, setSourceEnv] = useState("");
  const [targetEnv, setTargetEnv] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listEnvironments().then((d) => {
      setEnvironments(d.environments);
      if (d.environments.length >= 2) {
        setSourceEnv(d.environments[0]);
        setTargetEnv(d.environments[1]);
      }
    });
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const exportPath = `./exports/${solutionName}.zip`;
      const exportResult = await exportSolution({
        environment: sourceEnv,
        solutionName,
        output: exportPath,
      });
      const importResult = await importSolution({
        environment: targetEnv,
        packagePath: exportPath,
      });
      setResult({ export: exportResult.result, import: importResult.result });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-panel">
      <h2>Transposição entre Ambientes</h2>
      <form onSubmit={handleTransfer}>
        <label>
          Nome da solução
          <input value={solutionName} onChange={(e) => setSolutionName(e.target.value)} required />
        </label>
        <label>
          Ambiente de origem
          <select value={sourceEnv} onChange={(e) => setSourceEnv(e.target.value)} required>
            <option value="" disabled>
              Selecione
            </option>
            {environments.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Ambiente de destino
          <select value={targetEnv} onChange={(e) => setTargetEnv(e.target.value)} required>
            <option value="" disabled>
              Selecione
            </option>
            {environments.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Executando..." : "Exportar e Importar"}
        </button>
      </form>
      <ResultPanel result={result} error={error} />
    </div>
  );
}

function App() {
  const [tab, setTab] = useState("ambientes");

  return (
    <div className="app-shell">
      <header>
        <h1>
          PPALM <span>Painel de Controle</span>
        </h1>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={t === tab ? "tab-btn active" : "tab-btn"}
            onClick={() => setTab(t)}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </nav>

      <main>
        {tab === "ambientes" && <AmbientesTab />}
        {tab === "appRegistration" && <AppRegistrationTab />}
        {tab === "solucao" && <SolucaoTab />}
        {tab === "deploy" && <DeployTab />}
      </main>
    </div>
  );
}

export default App;
