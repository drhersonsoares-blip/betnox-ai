const express = require("express");
const router = express.Router();

const { buscarJogos } = require("../services/apiFootball");
const { buscarStatsTime } = require("../services/statsService");
const { buscarOddsPorJogo } = require("../services/oddsService");
const { analisarJogoComStats } = require("../services/aiService");

// delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

router.get("/", async (req, res) => {  // 👈 IMPORTANTE: async aqui
  try {
    const jogos = await buscarJogos();

    const resultado = [];

    for (const jogo of jogos) {
      try {
        await delay(2500); // 👈 AGORA FUNCIONA

        const statsCasa = await buscarStatsTime(jogo.teamIdCasa);
        const statsFora = await buscarStatsTime(jogo.teamIdFora);
        const odds = await buscarOddsPorJogo(jogo.fixtureId);

        if (!statsCasa || !statsFora) continue;

        const analise = analisarJogoComStats(
          {
            ...jogo,
            odd: odds?.casa || 2.0
          },
          statsCasa,
          statsFora
        );

        resultado.push(analise);

      } catch (e) {
        console.log("Erro jogo:", e.message);
      }
    }

    console.log(JSON.stringify(resultado, null, 2));
    
    res.json(resultado);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;