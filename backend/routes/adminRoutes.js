const adminMiddleware =
  require("../middleware/adminMiddleware");

const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// =====================================================
// 📂 PATHS
// =====================================================

const usersPath = path.join(
  __dirname,
  "../database/users.json"
);

const vipsPath = path.join(
  __dirname,
  "../database/vips.json"
);

const historicoPath = path.join(
  __dirname,
  "../database/historico.json"
);

// =====================================================
// 🔥 HELPERS
// =====================================================

function readJson(filePath) {

  try {

    if (!fs.existsSync(filePath)) {
      return [];
    }

    const data =
      fs.readFileSync(filePath, "utf-8");

    return JSON.parse(data);

  } catch (error) {

    console.log(
      "❌ erro ao ler json:",
      error.message
    );

    return [];
  }
}

// =====================================================
// 📊 STATS GERAIS
// =====================================================

router.get(
  "/stats",
  adminMiddleware,
  (req, res) => {

    const users =
      readJson(usersPath);

    const vips =
      readJson(vipsPath);

    const historico =
      readJson(historicoPath);

    const stats = {

      usuarios: users.length,

      vips: vips.length,

      free:
        users.length - vips.length,

      sinaisGerados:
        historico.length,

      receitaEstimada:
        vips.length * 97,

      plataforma: "online",

      ia: "ativa",

      timestamp:
        new Date()
    };

    res.json(stats);
  }
);

// =====================================================
// 👥 USUÁRIOS
// =====================================================

router.get(
  "/users",
  adminMiddleware,
  (req, res) => {

    const users =
      readJson(usersPath);

    res.json(users);
  }
);

// =====================================================
// 🔐 VIPS
// =====================================================

router.get(
  "/vips",
  adminMiddleware,
  (req, res) => {

    const vips =
      readJson(vipsPath);

    res.json(vips);
  }
);

// =====================================================
// 📜 HISTÓRICO
// =====================================================

router.get(
  "/historico",
  adminMiddleware,
  (req, res) => {

    const historico =
      readJson(historicoPath);

    res.json(historico);
  }
);

// =====================================================
// ❤️ STATUS IA
// =====================================================

router.get(
  "/ia-status",
  adminMiddleware,
  (req, res) => {

    res.json({

      status: "online",

      cron: "ativo",

      analise: "rodando",

      timestamp:
        new Date()

    });
  }
);

// =====================================================
// 💰 RECEITA
// =====================================================

router.get(
  "/receita",
  adminMiddleware,
  (req, res) => {

    const vips =
      readJson(vipsPath);

    const receitaMensal =
      vips.length * 97;

    const receitaAnual =
      receitaMensal * 12;

    res.json({

      vipAtivos:
        vips.length,

      mensal:
        receitaMensal,

      anual:
        receitaAnual,

      moeda: "BRL"

    });
  }
);

// =====================================================
// 🚀 HEALTH
// =====================================================

router.get(
  "/health",
  adminMiddleware,
  (req, res) => {

    res.json({

      status: "online",

      backend: true,

      api: true,

      telegram: true,

      cron: true,

      timestamp:
        new Date()

    });
  }
);

// =====================================================
// 📜 LOGS
// =====================================================

router.get(
  "/logs",
  adminMiddleware,
  (req, res) => {

    try {

      const logsPath = path.join(
        __dirname,
        "../database/logs.json"
      );

      // 🔥 cria arquivo
      if (
        !fs.existsSync(logsPath)
      ) {

        fs.writeFileSync(
          logsPath,
          JSON.stringify([], null, 2)
        );
      }

      const logs = JSON.parse(

        fs.readFileSync(
          logsPath,
          "utf-8"
        )
      );

      // 🔥 últimos primeiro
      const invertido =
        logs.reverse();

      res.json(invertido);

    } catch (e) {

      console.log(
        "❌ erro logs:",
        e.message
      );

      res.status(500).json({

        erro:
          "Erro logs"
      });
    }
  }
);

module.exports = router;