const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

// ======================
// 📂 DATABASE USERS
// ======================

const caminhoUsers = path.join(
  __dirname,
  "../../database/users.json"
);

// ======================
// 🔥 WEBHOOK HOTMART
// ======================

router.post("/", (req, res) => {

  try {

    console.log("🔥 Webhook recebido:");
    console.log(req.body);

    // ======================
    // 📩 DADOS HOTMART
    // ======================

    const email =
      req.body?.data?.buyer?.email ||
      req.body?.buyer?.email;

    const status =
      req.body?.data?.purchase?.status ||
      req.body?.purchase?.status;

    // ======================
    // ✅ PAGAMENTO APROVADO
    // ======================

    if (
      status === "APPROVED" ||
      status === "approved"
    ) {

      // ======================
      // 📂 LER USERS
      // ======================

      let users = [];

      if (fs.existsSync(caminhoUsers)) {
        users = JSON.parse(
          fs.readFileSync(caminhoUsers)
        );
      }

      // ======================
      // 🔎 VERIFICA EXISTE
      // ======================

      const jaExiste = users.find(
        u => u.email === email
      );

      // ======================
      // ➕ NOVO USER
      // ======================

      if (!jaExiste) {

        users.push({
          email,
          vip: true,
          criadoEm: new Date()
        });

      } else {

        // 🔥 atualiza vip
        jaExiste.vip = true;
      }

      // ======================
      // 💾 SALVA
      // ======================

      fs.writeFileSync(
        caminhoUsers,
        JSON.stringify(users, null, 2)
      );

      console.log("✅ VIP liberado:", email);
    }

    // ======================
    // 🚀 RESPOSTA
    // ======================

    res.sendStatus(200);

  } catch (e) {

    console.log("❌ Erro webhook:", e.message);

    res.sendStatus(500);
  }
});

module.exports = router;