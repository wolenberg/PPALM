const path = require("path");

// { environment: "test" } seleciona qual config/<nome>.json é o alvo.
// Setamos a env var PPALM_TARGET_CONFIG só para esta chamada.
async function validateSolution({ environment } = {}) {
  const previous = process.env.PPALM_TARGET_CONFIG;
  process.env.PPALM_TARGET_CONFIG = environment
    ? `./config/${environment}.json`
    : previous || "./config/test.json";

  try {
    const { run } = require(path.join(process.cwd(), "validators", "environment-validator"));
    return await run();
  } finally {
    process.env.PPALM_TARGET_CONFIG = previous;
  }
}

module.exports = { validateSolution };
