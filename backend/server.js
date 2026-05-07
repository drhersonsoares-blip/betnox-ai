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

// jogos
const jogosRoutes = require("./routes/jogos");
app.use("/jogos", jogosRoutes);

// top apostas
const topRoutes = require("./routes/top");
app.use("/top", topRoutes);

// stats
const statsRoutes = require("./routes/stats");
app.use("/stats", statsRoutes);

// banca
const bancaRoutes = require("./routes/banca");
app.use("/banca", bancaRoutes);

// histórico
const historicoRoutes = require("./routes/historico");
app.use("/historico", historicoRoutes);

// gráfico
const graficoRoutes = require("./routes/grafico");
app.use("/grafico", graficoRoutes);

// ======================
// 🔐 NOVAS ROTAS VIP
// ======================

// webhook hotmart
const webhookRoutes = require("./routes/webhook");
app.use("/webhook", webhookRoutes);

// autenticação
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// ======================
// 🚀 ROTA TESTE
// ======================

app.get("/", (req, res) => {
  res.send("🚀 BetLab AI rodando");
});

// ======================
// 🚀 SERVIDOR
// ======================

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

// ======================
// ⏰ CRON
// ======================

require("./cron");