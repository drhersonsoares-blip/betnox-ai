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
// 🔐 LOGIN VIP
// ======================

router.post("/login", (req, res) => {

  try {

    const { email } = req.body;

    // ======================
    // ❌ SEM EMAIL
    // ======================

    if (!email) {
      return res.status(400).json({
        erro: "Email obrigatório"
      });
    }

    // ======================
    // 📂 USERS
    // ======================

    let users = [];

    if (fs.existsSync(caminhoUsers)) {

      users = JSON.parse(
        fs.readFileSync(caminhoUsers)
      );
    }

    // ======================
    // 🔎 PROCURA USER
    // ======================

    const user = users.find(
      u => u.email === email
    );

    // ======================
    // ❌ NÃO ENCONTRADO
    // ======================

    if (!user) {

      return res.json({
        vip: false
      });
    }

    // ======================
    // ✅ VIP
    // ======================

    return res.json({
      vip: user.vip === true,
      email: user.email
    });

  } catch (e) {

    console.log("❌ Erro auth:", e.message);

    res.status(500).json({
      erro: "Erro interno"
    });
  }
});

module.exports = router;