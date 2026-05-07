const fs = require("fs");
const path = require("path");

const caminho = path.join(__dirname, "../../database/historico.json");

function calcularEstatisticas() {
  try {
    if (!fs.existsSync(caminho)) return {};

    const dados = JSON.parse(fs.readFileSync(caminho));

    const total = dados.length;

    const wins = dados.filter(j => j.resultado === "win").length;
    const losses = dados.filter(j => j.resultado === "loss").length;

    const taxa = total > 0 ? ((wins / total) * 100).toFixed(1) : 0;

    // ======================
    // 💰 LUCRO REAL (COM STAKE)
    // ======================

    let lucro = 0;
    let totalApostado = 0;

    dados.forEach(j => {

      // 🔥 fallback se não tiver stake
      const stake = j.stakeValor || (parseFloat(j.stake) / 100) || 0;

      totalApostado += stake;

      if (j.resultado === "win") {
        const odd = parseFloat(j.odd) || 2;
        lucro += stake * (odd - 1);
      } else if (j.resultado === "loss") {
        lucro -= stake;
      }

    });

    // ======================
    // 📊 ROI REAL
    // ======================

    const roi =
      totalApostado > 0
        ? ((lucro / totalApostado) * 100).toFixed(1)
        : 0;

    return {
      total,
      vitórias: wins,
      perdas: losses,
      taxa: taxa + "%",

      lucro: lucro.toFixed(2),
      roi: roi + "%",              // 🔥 NOVO
      totalApostado: totalApostado.toFixed(2) // 🔥 EXTRA (opcional)
    };

  } catch (e) {
    console.log("Erro stats:", e.message);
    return {};
  }
}

module.exports = { calcularEstatisticas };