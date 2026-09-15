const express = require("express");
const router = express.Router();

const { analyzeSolution } = require("../services/analyzer-service");

router.get("/analyze", (req, res) => {
  const result = analyzeSolution();
  res.json({ success: true, result });
});

module.exports = router;
