const express = require("express");
const router = express.Router();

const { exportSolution, importSolution } = require("../services/deployment-service");

router.post("/export", async (req, res) => {
  try {
    const result = await exportSolution(req.body);
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post("/import", async (req, res) => {
  try {
    const result = await importSolution(req.body);
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
