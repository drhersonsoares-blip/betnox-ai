const API_URL =
  "https://betnox-ai-production.up.railway.app";

// ==========================================
// 🔐 ADMINS
// ==========================================

const adminEmails = [

  "SEUEMAIL@gmail.com",
  "admin@betnox.ai"

];

// ======================
// 🔐 LOGIN
// ======================

async function fazerLogin() {

  const email =
    document
      .getElementById("email")
      .value
      .trim();

  const msg =
    document.getElementById("msg");

  msg.innerHTML = "";

  // ==========================================
  // 🔥 VALIDAÇÃO
  // ==========================================

  if (!email) {

    msg.style.color =
      "#f87171";

    msg.innerHTML =
      "Digite seu email.";

    return;
  }

  try {

    msg.style.color =
      "#cbd5f5";

    msg.innerHTML =
      "⏳ Verificando acesso...";

    const res =
      await fetch(

        `${API_URL}/auth/login`,

        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            email
          })
        }
      );

    const data =
      await res.json();

    // ==========================================
    // ✅ VIP LIBERADO
    // ==========================================

    if (data.vip) {

      // ==========================================
      // 💾 STORAGE
      // ==========================================

      localStorage.setItem(
        "vip",
        "true"
      );

      localStorage.setItem(
        "email",
        email
      );

      // ==========================================
      // 🔥 ADMIN
      // ==========================================

      const isAdmin =
        adminEmails.includes(email);

      localStorage.setItem(
        "admin",
        isAdmin
      );

      // ==========================================
      // ✅ MSG
      // ==========================================

      msg.style.color =
        "#22c55e";

      msg.innerHTML =
        "✅ Acesso liberado!";

      // ==========================================
      // 🚀 REDIRECT
      // ==========================================

      setTimeout(() => {

        // 🔐 ADMIN
        if (isAdmin) {

          window.location.href =
            "../admin/admin.html";

          return;
        }

        // 👤 USER NORMAL
        window.location.href =
          "../dashboard.html";

      }, 1000);

      return;
    }

    // ==========================================
    // ❌ NÃO VIP
    // ==========================================

    msg.style.color =
      "#f87171";

    msg.innerHTML =
      "❌ Seu email não possui acesso VIP.";

  } catch (e) {

    console.log(e);

    msg.style.color =
      "#f87171";

    msg.innerHTML =
      "❌ Erro ao conectar.";
  }
}