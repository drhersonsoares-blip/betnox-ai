const axios = require("axios");

// ======================
// 🔐 API
// ======================

const API_KEY =
  process.env.API_KEY;

// ======================
// 🎮 BUSCAR JOGOS
// ======================

async function buscarJogos() {

  try {

    const hoje =
      new Date()
      .toISOString()
      .split("T")[0];

    // ======================
    // 🧠 ROTAÇÃO DE LIGAS
    // ======================

    const hora =
      new Date().getHours();

    let ligas = [];

    // manhã/tarde
    if (hora < 16) {

      ligas = [39, 140];

    } else {

      ligas = [78, 61];
    }

    let todosJogos = [];

    for (const liga of ligas) {

      try {

        // 🔥 delay anti-ban
        await new Promise(r =>
          setTimeout(r, 3000)
        );

        const response =
          await axios.get(

            `https://v3.football.api-sports.io/fixtures?date=${hoje}&league=${liga}`,

            {
              headers: {
                "X-APISPORTS-KEY":
                  API_KEY
              }
            }
          );

        console.log(
          `📅 Liga ${liga} →`,
          response.data.results
        );

        // ======================
        // 🔥 SOMENTE FUTUROS
        // ======================

        const jogos =
          response.data.response

          .filter(jogo =>

            jogo.fixture.status.short === "NS"
          )

          .map(jogo => ({

            fixtureId:
              jogo.fixture.id,

            timeCasa:
              jogo.teams.home.name,

            timeFora:
              jogo.teams.away.name,

            teamIdCasa:
              jogo.teams.home.id,

            teamIdFora:
              jogo.teams.away.id,

            data:
              jogo.fixture.date

          }));

        todosJogos.push(...jogos);

      } catch (e) {

        // ======================
        // 🚫 RATE LIMIT
        // ======================

        if (
          e.response?.status === 429
        ) {

          console.log(
            "🚫 RATE LIMIT"
          );

          throw new Error(
            "RATE_LIMIT"
          );
        }

        console.log(
          "❌ Liga erro:",
          liga,
          e.response?.status
        );
      }
    }

    console.log(
      "🎮 Total jogos:",
      todosJogos.length
    );

    // 🔥 reduz consumo
    return todosJogos.slice(0, 3);

  } catch (error) {

    if (
      error.message === "RATE_LIMIT"
    ) {

      throw error;
    }

    console.log(
      "🔥 ERRO API:",
      error.message
    );

    return [];
  }
}

module.exports = {
  buscarJogos
};