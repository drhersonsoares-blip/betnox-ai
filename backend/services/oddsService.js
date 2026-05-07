const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.API_KEY;

async function buscarOddsPorJogo(fixtureId) {
  try {
    const res = await axios.get(
      `https://v3.football.api-sports.io/odds?fixture=${fixtureId}`,
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );

    const odds = res.data.response;

    if (!odds.length) return null;

    const bookmakers = odds[0].bookmakers;

    for (let book of bookmakers) {
      for (let bet of book.bets) {
        if (bet.name === "Match Winner") {
          return {
            casa: parseFloat(bet.values[0].odd),
            empate: parseFloat(bet.values[1].odd),
            fora: parseFloat(bet.values[2].odd)
          };
        }
      }
    }

    return null;

  } catch (e) {
    console.error("Erro odds:", e.message);
    return null;
  }
}

module.exports = { buscarOddsPorJogo };