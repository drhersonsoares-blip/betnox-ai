const fs = require("fs");
const path = require("path");

const caminho = path.join(__dirname, "../../database/historico.json");

function salvarApostas(apostas) {
  try {
    if (!fs.existsSync(caminho)) {
      fs.writeFileSync(caminho, "[]");
    }

    const dados = JSON.parse(fs.readFileSync(caminho));

    // 🔥 AQUI É ONDE O "j" EXISTE
   const apostasComExtras = apostas.map(j => ({
  ...j,

  resultado: j.resultado || null,
  erro: j.resultado === "loss",

  // 🔥 AQUI
  stakeValor: parseFloat(j.stake) / 100
}));

    const novo = [...dados, ...apostasComExtras];

    fs.writeFileSync(caminho, JSON.stringify(novo, null, 2));

    console.log("💾 Histórico salvo");

  } catch (e) {
    console.log("Erro ao salvar histórico:", e.message);
  }
}

module.exports = { salvarApostas };