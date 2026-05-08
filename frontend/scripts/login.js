const API_URL =
  "https://betnox-ai-production.up.railway.app";

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

  // 🔥 validação
  if (!email) {

    msg.innerHTML =
      "Digite seu email.";

    return;
  }

  try {

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

    // ======================
    // ✅ VIP
    // ======================

    if (data.vip) {

      localStorage.setItem(
        "vip",
        "true"
      );

      localStorage.setItem(
        "email",
        email
      );

      msg.style.color =
        "#22c55e";

      msg.innerHTML =
        "✅ Acesso liberado!";

      setTimeout(() => {

        window.location.href =
          "../dashboard.html";

      }, 1000);

      return;
    }

    // ======================
    // ❌ NÃO VIP
    // ======================

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