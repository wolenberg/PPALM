# PPALM Validation Engine — Versão Real

## Problema que isso resolve
A versão anterior do `environment-validator.js` lia um JSON estático
(`config/test.json`) que você mesmo preenchia com as variáveis esperadas —
ou seja, ele nunca validava nada de verdade, só ecoava o que já estava
escrito à mão. Esta versão consulta o ambiente Dataverse real via Web API e
compara contra o que a solução efetivamente exige.

## Contrato de dados: requirements.json
O Solution Analyzer passa a gravar `analyzers/requirements.json` ao final da
análise (veja `analyzers/requirements.example.json` para o formato). Esse
arquivo é a "lista de compras" da solução: quais Environment Variables,
Connection References, tabelas e flows ela espera encontrar. O Validator lê
esse contrato e não precisa saber nada sobre como a solução foi desempacotada
— só sobre o que ela exige.

**Ação pendente no seu lado**: adicionar ao final do `analyzers/solution-analyzer.js`
existente um bloco que monta esse objeto (a partir do que ele já detecta:
`ppa_API_URL`, `ppa_NOTIFICATION_EMAIL`, `ppa_Project`, etc.) e grava com
`fs.writeFileSync('./analyzers/requirements.json', JSON.stringify(dados, null, 2))`.
Não reescrevi esse arquivo porque não tenho o conteúdo completo dele — só o
log de saída.

## Autenticação com o Dataverse
**Por que não reaproveitar o token do `pac` CLI?** O `pac auth` guarda o
token internamente (cache do MSAL do próprio CLI), mas não expõe uma forma
suportada de outro processo Node ler esse token. Reimplementar isso via
engenharia reversa do cache do pac é frágil (quebra a cada atualização do
CLI) e não é o caminho recomendado pela Microsoft.

**Solução adotada**: um App Registration próprio do PPALM no Azure AD/Entra
ID, como **client público** (sem client secret), com a permissão delegada
`user_impersonation` da API do Dynamics CRM/Dataverse. Fluxo de **device
code** — mesmo padrão que o `pac auth create` já usa, então a experiência do
usuário não muda: aparece um código, ele confirma no navegador, pronto.

Isso é a opção sustentável para um projeto open source: qualquer pessoa que
clonar o PPALM e configurar o próprio `PPALM_CLIENT_ID` consegue autenticar,
sem depender de nenhum comportamento não documentado de outra ferramenta.

### Como criar o App Registration (uma vez, pelo mantenedor do projeto)
1. Azure Portal → Entra ID → App registrations → New registration
2. Tipo de conta: "Accounts in any organizational directory" (multi-tenant,
   necessário para outros usuários/orgs conseguirem consentir)
3. Não marcar "Public client (mobile & desktop)" — marcar como habilitado em
   Authentication, permitindo fluxos de client público
4. API permissions → Add a permission → Dynamics CRM → Delegated →
   `user_impersonation`
5. Copiar o Application (client) ID para `PPALM_CLIENT_ID`

## Diff: o que o Validator compara
- **Environment Variables**: para cada `schemaName` exigido, verifica se a
  *definition* existe no ambiente e se tem um *value* configurado.
  Status possíveis: `OK`, `MISSING_DEFINITION`, `MISSING_VALUE`.
- **Connection References**: para cada `logicalName` exigido, verifica se a
  referência existe e se está de fato associada a uma conexão (`connectionid`
  preenchido). Status possíveis: `OK`, `MISSING_REFERENCE`, `NOT_BOUND`.

## Saída
Além do log no console (mesmo formato de antes, agora com dados reais), o
Validator grava `releases/validation-report.json` — o "deployment readiness
report" que o ROADMAP.md já previa para a v0.2/v0.3. Esse JSON é o que a web
UI (rota `/api/validate`) pode passar a renderizar como tabela em vez de só
texto de log.

## Dependência nova
```
npm install @azure/msal-node
```
(o cliente HTTP usa o `fetch` nativo do Node — não precisa de axios/node-fetch)
