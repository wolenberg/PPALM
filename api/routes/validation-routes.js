const express = require("express");
const router = express.Router();

const { validateSolution } = require("../services/validation-service");

router.post("/", async (req, res) => {
  try {
    const result = await validateSolution(req.body);
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
