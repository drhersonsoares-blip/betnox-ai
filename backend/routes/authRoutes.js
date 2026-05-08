const express = require("express");

const router = express.Router();

const fs = require("fs");

const path = require("path");

// ======================
// 📂 PATHS
// ======================

const caminhoVIP =
  path.join(
    __dirname,
    "../database/vips.json"
  );

const caminhoUsers =
  path.join(
    __dirname,
    "../database/users.json"
  );

// ======================
// 🔥 HELPERS
// ======================

function criarArquivoSeNaoExistir(
  caminho
) {

  if (!fs.existsSync(caminho)) {

    fs.writeFileSync(
      caminho,
      JSON.stringify([], null, 2)
    );
  }
}

function lerJSON(caminho) {

  criarArquivoSeNaoExistir(
    caminho
  );

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
// 🔐 LOGIN VIP
// ======================

router.post("/login", (req, res) => {

  try {

    const { email } = req.body;

    // ==========================================
    // ❌ EMAIL OBRIGATÓRIO
    // ==========================================

    if (!email) {

      return res.status(400).json({

        erro:
          "Email obrigatório"

      });
    }

    // ==========================================
    // 📂 DATABASE
    // ==========================================

    const vips =
      lerJSON(caminhoVIP);

    const users =
      lerJSON(caminhoUsers);

    // ==========================================
    // 🔐 VIP
    // ==========================================

    const usuarioVIP =
      vips.find(

        v =>

          v.email.toLowerCase() ===
          email.toLowerCase()
      );

    // ==========================================
    // 👤 REGISTRAR USER
    // ==========================================

    const usuarioExiste =
      users.find(

        u =>

          u.email.toLowerCase() ===
          email.toLowerCase()
      );

    // ==========================================
    // ➕ NOVO USUÁRIO
    // ==========================================

    if (!usuarioExiste) {

      users.push({

        email,

        plano:
          usuarioVIP ? "VIP" : "FREE",

        status: "online",

        ultimoAcesso:
          "Agora",

        criadoEm:
          new Date()

      });

    } else {

      // ==========================================
      // 🔄 UPDATE USER
      // ==========================================

      usuarioExiste.status =
        "online";

      usuarioExiste.ultimoAcesso =
        "Agora";

      usuarioExiste.plano =
        usuarioVIP ? "VIP" : "FREE";
    }

    // ==========================================
    // 💾 SALVAR USERS
    // ==========================================

    salvarJSON(
      caminhoUsers,
      users
    );

    // ==========================================
    // ✅ VIP
    // ==========================================

    if (usuarioVIP) {

      return res.json({

        vip: true,

        email

      });
    }

    // ==========================================
    // ❌ NÃO VIP
    // ==========================================

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

router.post("/add-vip", (req, res) => {

  try {

    const { email } = req.body;

    // ==========================================
    // ❌ EMAIL
    // ==========================================

    if (!email) {

      return res.status(400).json({

        erro:
          "Email obrigatório"
      });
    }

    // ==========================================
    // 📂 DATABASE
    // ==========================================

    const vips =
      lerJSON(caminhoVIP);

    const users =
      lerJSON(caminhoUsers);

    // ==========================================
    // 🔥 VIP EXISTE
    // ==========================================

    const existeVIP =
      vips.find(

        v =>

          v.email.toLowerCase() ===
          email.toLowerCase()
      );

    // ==========================================
    // ➕ ADD VIP
    // ==========================================

    if (!existeVIP) {

      vips.push({

        email,

        criadoEm:
          new Date()

      });

      salvarJSON(
        caminhoVIP,
        vips
      );
    }

    // ==========================================
    // 👤 USER UPDATE
    // ==========================================

    const user =
      users.find(

        u =>

          u.email.toLowerCase() ===
          email.toLowerCase()
      );

    if (user) {

      user.plano = "VIP";

      user.status = "online";

      user.ultimoAcesso =
        "Agora";

    } else {

      users.push({

        email,

        plano: "VIP",

        status: "online",

        ultimoAcesso:
          "Agora",

        criadoEm:
          new Date()

      });
    }

    // ==========================================
    // 💾 SAVE USERS
    // ==========================================

    salvarJSON(
      caminhoUsers,
      users
    );

    // ==========================================
    // ✅ SUCCESS
    // ==========================================

    return res.json({

      sucesso: true,

      totalVIP:
        vips.length,

      totalUsers:
        users.length
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