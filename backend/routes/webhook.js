const express = require("express");

const router = express.Router();

const fs = require("fs");

const path = require("path");

// ======================
// 📂 DATABASE
// ======================

const caminhoUsers = path.join(
  __dirname,
  "../database/users.json"
);

const caminhoVIP = path.join(
  __dirname,
  "../database/vips.json"
);

const caminhoLogs = path.join(
  __dirname,
  "../database/logs.json"
);

// ======================
// 🔥 HELPERS
// ======================

function criarArquivo(caminho) {

  if (!fs.existsSync(caminho)) {

    fs.writeFileSync(
      caminho,
      JSON.stringify([], null, 2)
    );
  }
}

function lerJSON(caminho) {

  criarArquivo(caminho);

  return JSON.parse(
    fs.readFileSync(
      caminho,
      "utf-8"
    )
  );
}

function salvarJSON(caminho, dados) {

  fs.writeFileSync(

    caminho,

    JSON.stringify(
      dados,
      null,
      2
    )
  );
}

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
    // 📩 HOTMART DATA
    // ======================

    const email =

      req.body?.data?.buyer?.email ||

      req.body?.buyer?.email;

    const status =

      req.body?.data?.purchase?.status ||

      req.body?.purchase?.status;

    const transacao =

      req.body?.data?.purchase?.transaction ||

      "N/A";

    // ======================
    // ❌ EMAIL
    // ======================

    if (!email) {

      console.log(
        "⚠️ Email não encontrado"
      );

      return res.sendStatus(200);
    }

    // ======================
    // 📂 DATABASE
    // ======================

    let users =
      lerJSON(caminhoUsers);

    let vips =
      lerJSON(caminhoVIP);

    let logs =
      lerJSON(caminhoLogs);

    // ======================
    // 📜 LOG
    // ======================

    logs.push({

      email,

      status,

      transacao,

      recebidoEm:
        new Date()

    });

    salvarJSON(
      caminhoLogs,
      logs
    );

    // ======================
    // ✅ APPROVED
    // ======================

    if (

      status === "APPROVED" ||

      status === "approved"
    ) {

      // ======================
      // 👤 USER
      // ======================

      let user =
        users.find(

          u =>

            u.email.toLowerCase() ===

            email.toLowerCase()
        );

      // ======================
      // ➕ CREATE USER
      // ======================

      if (!user) {

        user = {

          email,

          plano: "VIP",

          status: "online",

          vip: true,

          ultimoAcesso:
            "Agora",

          criadoEm:
            new Date()
        };

        users.push(user);

      } else {

        user.vip = true;

        user.plano = "VIP";

        user.status = "online";

        user.ultimoAcesso =
          "Agora";

        user.atualizadoEm =
          new Date();
      }

      // ======================
      // 🔐 VIP DATABASE
      // ======================

      const vipExiste =
        vips.find(

          v =>

            v.email.toLowerCase() ===

            email.toLowerCase()
        );

      if (!vipExiste) {

        vips.push({

          email,

          criadoEm:
            new Date()
        });
      }

      // ======================
      // 💾 SAVE
      // ======================

      salvarJSON(
        caminhoUsers,
        users
      );

      salvarJSON(
        caminhoVIP,
        vips
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

          user.plano = "FREE";

          user.status = "offline";

          user.atualizadoEm =
            new Date();
        }

        return user;
      });

      // ======================
      // 🔥 REMOVE VIP
      // ======================

      vips = vips.filter(

        vip =>

          vip.email.toLowerCase() !==

          email.toLowerCase()
      );

      // ======================
      // 💾 SAVE
      // ======================

      salvarJSON(
        caminhoUsers,
        users
      );

      salvarJSON(
        caminhoVIP,
        vips
      );

      console.log(
        "❌ VIP removido:",
        email
      );
    }

    // ======================
    // 🚀 SUCCESS
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