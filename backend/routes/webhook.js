const express = require("express");

const router = express.Router();

const fs = require("fs");

const path = require("path");

// ======================
// 📂 DATABASE USERS
// ======================

const caminhoUsers = path.join(
  __dirname,
  "../database/users.json"
);

// ======================
// 🔥 WEBHOOK HOTMART
// ======================

router.post("/", (req, res) => {

  try {

    console.log(
      "🔥 Webhook recebido:"
    );

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
    // 🔥 SEGURANÇA
    // ======================

    if (!email) {

      console.log(
        "⚠️ Email não encontrado"
      );

      return res.sendStatus(200);
    }

    // ======================
    // 📂 CRIAR USERS
    // ======================

    if (
      !fs.existsSync(caminhoUsers)
    ) {

      fs.writeFileSync(
        caminhoUsers,
        JSON.stringify([])
      );
    }

    // ======================
    // 📂 LER USERS
    // ======================

    let users = JSON.parse(

      fs.readFileSync(caminhoUsers)
    );

    // ======================
    // ✅ APROVADO
    // ======================

    if (

      status === "APPROVED" ||

      status === "approved"
    ) {

      const jaExiste = users.find(

        u =>

          u.email.toLowerCase() ===

          email.toLowerCase()
      );

      // ======================
      // ➕ NOVO USER
      // ======================

      if (!jaExiste) {

        users.push({

          email,

          vip: true,

          criadoEm:
            new Date()
        });

      } else {

        jaExiste.vip = true;

        jaExiste.atualizadoEm =
          new Date();
      }

      // ======================
      // 💾 SALVAR
      // ======================

      fs.writeFileSync(

        caminhoUsers,

        JSON.stringify(
          users,
          null,
          2
        )
      );

      console.log(
        "✅ VIP liberado:",
        email
      );
    }

    // ======================
    // ❌ CANCELADO
    // ======================

    if (

      status === "CANCELLED" ||

      status === "REFUNDED"
    ) {

      users = users.map(user => {

        if (

          user.email.toLowerCase() ===

          email.toLowerCase()
        ) {

          user.vip = false;
        }

        return user;
      });

      fs.writeFileSync(

        caminhoUsers,

        JSON.stringify(
          users,
          null,
          2
        )
      );

      console.log(
        "❌ VIP removido:",
        email
      );
    }

    // ======================
    // 🚀 RESPOSTA
    // ======================

    res.sendStatus(200);

  } catch (e) {

    console.log(
      "❌ Erro webhook:",
      e.message
    );

    res.sendStatus(500);
  }
});

module.exports = router;