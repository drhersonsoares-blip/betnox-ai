const express = require("express");
const router = express.Router();

const { calcularEstatisticas } = require("../services/statsResultadoService");

router.get("/", (req, res) => {
  try {
    const stats = calcularEstatisticas();

    // 🔥 fallback de segurança
    if (!stats) {
      return res.json({
        total: 0,
        vitórias: 0,
        perdas: 0,
        taxa: "0%",
        lucro: "0",
        roi: "0%"
      });
    }

    res.json(stats);

  } catch (e) {
    console.log("Erro ao calcular stats:", e.message);

    res.status(500).json({
      erro: "Erro ao calcular estatísticas"
    });
  }
});

module.exports = router;