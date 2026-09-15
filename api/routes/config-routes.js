const express = require("express");
const router = express.Router();

const { getAppRegistration, saveAppRegistration } = require("../services/config-service");

router.get("/app-registration", (req, res) => {
  res.json({ success: true, appRegistration: getAppRegistration() });
});

router.post("/app-registration", (req, res) => {
  try {
    const result = saveAppRegistration(req.body);
    res.json({ success: true, appRegistration: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
