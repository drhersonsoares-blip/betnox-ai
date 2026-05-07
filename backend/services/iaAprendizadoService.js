const fs = require("fs");
const path = require("path");

const caminho = path.join(__dirname, "../../database/historico.json");

function analisarErros() {
  const dados = JSON.parse(fs.readFileSync(caminho));

  const erros = dados.filter(j => j.resultado === "loss");

  let mediaEV = 0;
  let total = erros.length;

  erros.forEach(j => {
    mediaEV += parseFloat(j.evCasa);
  });

  mediaEV = total > 0 ? mediaEV / total : 0;

  return {
    totalErros: total,
    mediaEVErro: mediaEV.toFixed(2)
  };
}

module.exports = { analisarErros };