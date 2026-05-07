const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", (req, res) => {
 const caminho = path.join(__dirname, "../../database/historico.json");
  const dados = JSON.parse(fs.readFileSync(caminho));
  res.json(dados);
});

module.exports = router;