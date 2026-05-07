const express = require("express");
const router = express.Router();

const { simularBanca } = require("../services/simulacaoService");

router.get("/", (req, res) => {
  res.json(simularBanca());
});

module.exports = router;