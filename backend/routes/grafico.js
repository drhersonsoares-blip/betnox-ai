const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

const caminho = path.join(__dirname, "../../database/historico.json");

router.get("/", (req, res) => {
  const dados = JSON.parse(fs.readFileSync(caminho));

  let lucro = 0;

  const evolucao = dados.map((j, i) => {
    const ev = parseFloat(j.evCasa);

    if (j.resultado === "win") {
      lucro += ev;
    } else {
      lucro -= 1;
    }

    return {
      index: i + 1,
      lucro: parseFloat(lucro.toFixed(2))
    };
  });

  res.json(evolucao);
});

module.exports = router;