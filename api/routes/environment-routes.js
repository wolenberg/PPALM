const express = require("express");
const router = express.Router();

const {
  getEnvironmentConfigs,
  getEnvironmentByName,
  getEnvironmentNames,
  createEnvironment,
} = require("../services/environment-service");

router.get("/list", (req, res) => {
  res.json({ success: true, environments: getEnvironmentNames() });
});

router.get("/details/:name", (req, res) => {
  const env = getEnvironmentByName(req.params.name);

  if (!env) {
    return res.status(404).json({ success: false, error: "Environment not found" });
  }

  res.json({ success: true, environment: env });
});

router.get("/all", (req, res) => {
  res.json({ success: true, environments: getEnvironmentConfigs() });
});

router.post("/", (req, res) => {
  try {
    const result = createEnvironment(req.body);
    res.status(201).json({ success: true, environment: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
