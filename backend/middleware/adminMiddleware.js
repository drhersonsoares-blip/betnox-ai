module.exports = function(req, res, next) {

  // ==========================================
  // 🔐 EMAIL ADMIN
  // ==========================================

  const adminEmails = [

    "SEUEMAIL@gmail.com",
    "admin@betnox.ai"

  ];

  // ==========================================
  // 📩 PEGAR EMAIL
  // ==========================================

  const email =
    req.headers.email;

  // ==========================================
  // ❌ SEM EMAIL
  // ==========================================

  if (!email) {

    return res.status(401).json({

      erro: "Acesso negado"

    });
  }

  // ==========================================
  // ❌ NÃO É ADMIN
  // ==========================================

  if (!adminEmails.includes(email)) {

    return res.status(403).json({

      erro: "Você não é admin"

    });
  }

  // ==========================================
  // ✅ LIBERADO
  // ==========================================

  next();
};