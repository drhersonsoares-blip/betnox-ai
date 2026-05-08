require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// =====================================================
// 🚀 CONFIG
// =====================================================

app.use(cors());

app.use(express.json());

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
// ❤️ HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {

  res.send({
    status: "online",
    plataforma: "BETNOX AI",
    servidor: "rodando",
    versao: "1.0.0"
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
⚡ Ambiente: ${process.env.NODE_ENV || "development"}
========================================
  `);

});

// =====================================================
// ⏰ CRON AUTOMÁTICO
// =====================================================

require("./cron");