require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// ======================
// 🔥 CONFIG
// ======================

app.use(cors());

app.use(express.json());

// ======================
// 📂 ROTAS
// ======================

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

// 📊 stats
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

// ======================
// 🔐 VIP
// ======================

// 🔥 webhook hotmart
const webhookRoutes =
  require("./routes/webhook");

app.use(
  "/webhook",
  webhookRoutes
);

// 🔐 autenticação
const authRoutes =
  require("./routes/authRoutes");

app.use(
  "/auth",
  authRoutes
);

// ======================
// 🚀 TESTE
// ======================

app.get("/", (req, res) => {

  res.send(
    "🚀 BetLab AI rodando"
  );
});

// ======================
// 🚀 SERVIDOR
// ======================

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `🚀 Servidor rodando na porta ${PORT}`
  );
});

// ======================
// ⏰ CRON
// ======================

require("./cron");