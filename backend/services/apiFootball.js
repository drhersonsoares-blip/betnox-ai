const axios = require("axios");

async function buscarJogos() {
  try {
    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);

    const datas = [
      hoje.toISOString().split("T")[0],
      amanha.toISOString().split("T")[0]
    ];

    const ligas = [39, 140, 78, 61];

    let todosJogos = [];

    for (const data of datas) {
      for (const liga of ligas) {
        try {

          // 🔥 DELAY MAIS FORTE (ANTI BLOQUEIO)
          await new Promise(r => setTimeout(r, 2000));

          const response = await axios.get(
            `https://v3.football.api-sports.io/fixtures?date=${data}&league=${liga}`,
            {
              headers: {
                "X-APISPORTS-KEY": process.env.API_KEY
              }
            }
          );

          console.log(`📅 ${data} | Liga ${liga} →`, response.data.results);

          const jogos = response.data.response.map(jogo => ({
            fixtureId: jogo.fixture.id,
            timeCasa: jogo.teams.home.name,
            timeFora: jogo.teams.away.name,
            teamIdCasa: jogo.teams.home.id,
            teamIdFora: jogo.teams.away.id,
            data: jogo.fixture.date
          }));

          todosJogos.push(...jogos);

        } catch (e) {

          // 🔥 DETECTA BLOQUEIO
          if (e.response?.status === 429) {
            console.log("🚫 RATE LIMIT ATINGIDO — PARANDO BUSCA");
            throw new Error("RATE_LIMIT");
          }

          console.log("❌ Erro liga:", liga, e.response?.status);
        }
      }
    }

    console.log("🎮 Total jogos encontrados:", todosJogos.length);

    return todosJogos.slice(0, 5);

  } catch (error) {

    if (error.message === "RATE_LIMIT") {
      throw error; // 🔥 sobe pro cron tratar
    }

    console.log("🔥 ERRO API:", error.response?.data || error.message);
    return [];
  }
}

module.exports = { buscarJogos };