const express = require("express");
const router = express.Router();
const { enviarMensagem } = require("../services/telegramService");
const { formatarTop } = require("../services/formatService");


const { buscarJogos } = require("../services/apiFootball");
const { buscarStatsTime } = require("../services/statsService");
const { buscarOddsPorJogo } = require("../services/oddsService");
const { analisarJogoComStats } = require("../services/aiService");
const { gerarTopApostas } = require("../services/rankingService");

// delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

router.get("/", async (req, res) => {
  try {
    const jogos = await buscarJogos();
    const analisados = [];

    for (const jogo of jogos) {
      try {
        await delay(2000);

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

        analisados.push(analise);

      } catch (e) {
        console.log("Erro:", e.message);
      }
    }

    const top = gerarTopApostas(analisados);
   
    const mensagem = formatarTop(top);
    await enviarMensagem(mensagem);
   
    res.json(top);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;