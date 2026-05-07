const axios = require("axios");

require("dotenv").config();

// ======================
// 🔐 API
// ======================

const API_KEY =
  process.env.API_KEY;

// ======================
// 💰 ODDS
// ======================

async function buscarOddsPorJogo(
  fixtureId
) {

  try {

    // 🔥 delay leve
    await new Promise(r =>
      setTimeout(r, 2000)
    );

    const res =
      await axios.get(

        `https://v3.football.api-sports.io/odds?fixture=${fixtureId}`,

        {
          headers: {
            "x-apisports-key":
              API_KEY
          }
        }
      );

    const odds =
      res.data.response;

    // 🔥 fallback
    if (!odds.length) {

      return {
        casa: 2.0,
        empate: 3.0,
        fora: 2.5
      };
    }

    const bookmakers =
      odds[0].bookmakers;

    for (let book of bookmakers) {

      for (let bet of book.bets) {

        if (
          bet.name ===
          "Match Winner"
        ) {

          return {

            casa:
              parseFloat(
                bet.values[0].odd
              ),

            empate:
              parseFloat(
                bet.values[1].odd
              ),

            fora:
              parseFloat(
                bet.values[2].odd
              )
          };
        }
      }
    }

    // 🔥 fallback
    return {
      casa: 2.0,
      empate: 3.0,
      fora: 2.5
    };

  } catch (e) {

    console.log(
      "⚠️ Odds fallback ativado"
    );

    // 🔥 fallback salva sistema
    return {
      casa: 2.0,
      empate: 3.0,
      fora: 2.5
    };
  }
}

module.exports = {
  buscarOddsPorJogo
};