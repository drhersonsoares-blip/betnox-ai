const fs = require("fs");
const path = require("path");

const caminho = path.join(__dirname, "../../database/historico.json");

function simularBanca() {
  const dados = JSON.parse(fs.readFileSync(caminho));

  let banca = 1000; // inicial
  const evolucao = [];

  dados.forEach((j, i) => {
    const stake = banca * (parseFloat(j.stake) / 100);

    if (j.resultado === "win") {
      banca += stake * (j.odd - 1);
    } else if (j.resultado === "loss") {
      banca -= stake;
    }

    evolucao.push({
      rodada: i + 1,
      banca: parseFloat(banca.toFixed(2))
    });
  });

  return evolucao;
}

module.exports = { simularBanca };