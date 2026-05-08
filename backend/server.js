require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// =====================================================
// 📂 LOGS
// =====================================================

const caminhoLogs = path.join(
  __dirname,
  "./database/logs.json"
);

// =====================================================
// 🔥 HELPERS
// =====================================================

function criarArquivoLogs() {

  if (!fs.existsSync(caminhoLogs)) {

    fs.writeFileSync(
      caminhoLogs,
      JSON.stringify([], null, 2)
    );
  }
}

function salvarLog(tipo, mensagem) {

  try {

    criarArquivoLogs();

    const logs = JSON.parse(

      fs.readFileSync(
        caminhoLogs,
        "utf-8"
      )
    );

    logs.push({

      tipo,

      mensagem,

      data:
        new Date()

    });

    // 🔥 evita crescer infinito
    const limite =
      logs.slice(-1000);

    fs.writeFileSync(

      caminhoLogs,

      JSON.stringify(
        limite,
        null,
        2
      )
    );

  } catch (e) {

    console.log(
      "❌ erro log:",
      e.message
    );
  }
}

// =====================================================
// 🚀 APP
// =====================================================

const appName =
  "BETNOX AI";

const appVersion =
  "2.0.0";

const appStartTime =
  new Date();

const appEnvironment =
  process.env.NODE_ENV ||
  "development";

// =====================================================
// 🚀 CONFIG
// =====================================================

app.use(cors());

app.use(express.json());

// =====================================================
// 🔥 REQUEST LOGGER
// =====================================================

app.use((req, res, next) => {

  console.log(
    `📡 ${req.method} ${req.url}`
  );

  salvarLog(

    "REQUEST",

    `${req.method} ${req.url}`
  );

  next();
});

// =====================================================
// 📂 ROTAS PRINCIPAIS
// =====================================================

// 🎮 jogos
const jogosRoutes =
  require("./routes/jogos");

app.use(
  "/jogos",
  jogosRoutes
);

// 🔥 top apostas
const topRoutes =
  require("./routes/top");

app.use(
  "/top",
  topRoutes
);

// 📊 estatísticas
const statsRoutes =
  require("./routes/stats");

app.use(
  "/stats",
  statsRoutes
);

// 💰 banca
const bancaRoutes =
  require("./routes/banca");

app.use(
  "/banca",
  bancaRoutes
);

// 📜 histórico
const historicoRoutes =
  require("./routes/historico");

app.use(
  "/historico",
  historicoRoutes
);

// 📈 gráfico
const graficoRoutes =
  require("./routes/grafico");

app.use(
  "/grafico",
  graficoRoutes
);

// =====================================================
// 🔐 VIP / AUTENTICAÇÃO
// =====================================================

// 🔥 webhook hotmart
const webhookRoutes =
  require("./routes/webhook");

app.use(
  "/webhook",
  webhookRoutes
);

// 🔐 login
const authRoutes =
  require("./routes/authRoutes");

app.use(
  "/auth",
  authRoutes
);

// =====================================================
// 📊 ADMIN PREMIUM
// =====================================================

// 🚀 admin
const adminRoutes =
  require("./routes/adminRoutes");

app.use(
  "/admin",
  adminRoutes
);

// =====================================================
// ❤️ HEALTH ENTERPRISE
// =====================================================

app.get("/", (req, res) => {

  res.send({

    status: "online",

    plataforma:
      appName,

    servidor:
      "rodando",

    versao:
      appVersion,

    ambiente:
      appEnvironment,

    iniciadoEm:
      appStartTime,

    uptimeSegundos:
      process.uptime(),

    memoria: {

      rss:
        process.memoryUsage().rss,

      heapUsed:
        process.memoryUsage().heapUsed
    }
  });
});

// =====================================================
// ❤️ HEALTH API
// =====================================================

app.get("/health", (req, res) => {

  res.json({

    status: "online",

    backend: true,

    api: true,

    telegram: true,

    cron: true,

    environment:
      appEnvironment,

    uptime:
      process.uptime(),

    timestamp:
      new Date()

  });
});

// =====================================================
// ❌ 404
// =====================================================

app.use((req, res) => {

  salvarLog(
    "404",
    req.originalUrl
  );

  res.status(404).json({

    erro:
      "Rota não encontrada"
  });
});

// =====================================================
// 🚨 ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {

  console.log(
    "❌ Erro global:",
    err.message
  );

  salvarLog(
    "ERROR",
    err.message
  );

  res.status(500).json({

    erro:
      "Erro interno do servidor"
  });
});

// =====================================================
// 🚀 SERVIDOR
// =====================================================

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`
========================================
🚀 BETNOX AI ONLINE
========================================
🔥 Porta: ${PORT}
📊 Admin: /admin
🔐 Auth: /auth
⚡ Ambiente: ${appEnvironment}
🚀 Versão: ${appVersion}
========================================
  `);

  salvarLog(
    "STARTUP",
    `Servidor iniciado porta ${PORT}`
  );
});

// =====================================================
// ⏰ CRON AUTOMÁTICO
// =====================================================

require("./cron");