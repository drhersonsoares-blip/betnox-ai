const axios = require("axios");
require("dotenv").config();

const { getCache, setCache } = require("./cache");

const API_KEY = process.env.API_KEY;

async function buscarStatsTime(teamId) {

  const cacheKey = `stats_${teamId}`;

  // 🔥 1. VERIFICAR CACHE
  const cached = getCache(cacheKey);
  if (cached) {
    console.log("⚡ CACHE USADO:", teamId);
    return cached;
  }

  try {
    const res = await axios.get(
      `https://v3.football.api-sports.io/teams/statistics?league=39&season=2023&team=${teamId}`,
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );

    const stats = res.data.response;

    const result = {
      golsMarcados: stats?.goals?.for?.total?.total || 0,
      golsSofridos: stats?.goals?.against?.total?.total || 0,
      jogos: stats?.fixtures?.played?.total || 1
    };

    // 🔥 2. SALVAR NO CACHE
    setCache(cacheKey, result);

    return result;

  } catch (e) {
    console.error("Erro stats:", e.message);
    return null;
  }
}

module.exports = { buscarStatsTime };