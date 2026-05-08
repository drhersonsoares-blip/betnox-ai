const express = require("express");

const router = express.Router();

const fs = require("fs");

const path = require("path");

// ======================
// 📂 BANCO VIP
// ======================

const caminhoVIP =
  path.join(
    __dirname,
    "../database/vips.json"
  );

// ======================
// 🔐 LOGIN VIP
// ======================

router.post("/login", (req, res) => {

  try {

    const { email } = req.body;

    // 🔥 segurança
    if (!email) {

      return res.status(400).json({

        erro:
          "Email obrigatório"
      });
    }

    // 🔥 cria arquivo se não existir
    if (
      !fs.existsSync(caminhoVIP)
    ) {

      fs.writeFileSync(
        caminhoVIP,
        JSON.stringify([])
      );
    }

    const vips =
      JSON.parse(
        fs.readFileSync(caminhoVIP)
      );

    // 🔥 verifica VIP
    const usuarioVIP =
      vips.find(
        v =>
          v.email.toLowerCase() ===
          email.toLowerCase()
      );

    if (usuarioVIP) {

      return res.json({

        vip: true,

        email
      });
    }

    return res.json({

      vip: false
    });

  } catch (e) {

    console.log(
      "Erro auth:",
      e.message
    );

    return res.status(500).json({

      erro:
        "Erro interno"
    });
  }
});

// ======================
// ➕ ADICIONAR VIP
// ======================
//
// temporário
// depois Hotmart fará isso
//

router.post("/add-vip", (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {

      return res.status(400).json({

        erro:
          "Email obrigatório"
      });
    }

    if (
      !fs.existsSync(caminhoVIP)
    ) {

      fs.writeFileSync(
        caminhoVIP,
        JSON.stringify([])
      );
    }

    const vips =
      JSON.parse(
        fs.readFileSync(caminhoVIP)
      );

    // 🔥 evita duplicado
    const existe =
      vips.find(
        v =>
          v.email.toLowerCase() ===
          email.toLowerCase()
      );

    if (!existe) {

      vips.push({

        email,

        criadoEm:
          new Date()
      });

      fs.writeFileSync(
        caminhoVIP,
        JSON.stringify(
          vips,
          null,
          2
        )
      );
    }

    return res.json({

      sucesso: true,

      total:
        vips.length
    });

  } catch (e) {

    console.log(
      "Erro add vip:",
      e.message
    );

    return res.status(500).json({

      erro:
        "Erro interno"
    });
  }
});

module.exports = router;