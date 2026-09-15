const path = require("path");

function analyzeSolution() {
  // Chama a função diretamente (em vez de execSync + parse de texto) para
  // obter o objeto requirements estruturado, não só o log em texto.
  const { run } = require(path.join(process.cwd(), "analyzers", "solution-analyzer"));
  return run();
}

module.exports = { analyzeSolution };
