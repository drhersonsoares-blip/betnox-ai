// ==========================================
// 🚀 BETNOX ADMIN
// ==========================================

// ==========================================
// 🌐 API
// ==========================================

const API_URL =
  "https://betnox-ai-production-6783.up.railway.app";

// ==========================================
// 🔐 ADMIN EMAIL
// ==========================================

const adminEmail =
  localStorage.getItem("email");

// ==========================================
// ❌ SEM LOGIN
// ==========================================

if (!adminEmail) {

  alert(
    "Acesso negado"
  );

  window.location.href =
    "../login/login.html";
}

// ==========================================
// 🔓 LOGOUT
// ==========================================

function logout() {

  localStorage.removeItem(
    "vip"
  );

  localStorage.removeItem(
    "email"
  );

  localStorage.removeItem(
    "admin"
  );

  window.location.href =
    "../login/login.html";
}

// ==========================================
// 📊 BUSCAR STATS
// ==========================================

async function carregarStats() {

  try {

    const response = await fetch(

      `${API_URL}/admin/stats`,

      {

        headers: {

          email: adminEmail

        }

      }
    );

    // ==========================================
    // ❌ NÃO AUTORIZADO
    // ==========================================

    if (
      response.status === 401 ||
      response.status === 403
    ) {

      alert(
        "Você não possui acesso admin"
      );

      window.location.href =
        "../dashboard.html";

      return;
    }

    const data =
      await response.json();

    // ==========================================
    // 📊 MÉTRICAS
    // ==========================================

    document.getElementById(
      "usuarios"
    ).innerText =
      data.usuarios;

    document.getElementById(
      "vips"
    ).innerText =
      data.vips;

    document.getElementById(
      "receita"
    ).innerText =
      `R$ ${data.receitaEstimada}`;

    document.getElementById(
      "sinais"
    ).innerText =
      data.sinaisGerados;

    // ==========================================
    // 🤖 STATUS IA
    // ==========================================

    const statusBox =
      document.getElementById(
        "statusIA"
      );

    statusBox.innerHTML = `

      <div class="metric-card">

        <h3 style="
          color:#22c55e;
          font-size:28px;
          margin-bottom:10px;
        ">
          ${data.ia}
        </h3>

        <p>
          Plataforma:
          ${data.plataforma}
        </p>

      </div>

    `;

    // ==========================================
    // 📈 GRÁFICO
    // ==========================================

    criarGrafico(data);

  } catch (error) {

    console.log(
      "❌ erro admin:",
      error
    );
  }
}

// ==========================================
// 📈 CHART
// ==========================================

function criarGrafico(data) {

  const ctx =
    document.getElementById(
      "graficoAdmin"
    );

  // 🔥 evita duplicar gráfico
  if (window.graficoAdminChart) {

    window.graficoAdminChart.destroy();
  }

  window.graficoAdminChart =
    new Chart(ctx, {

      type: "line",

      data: {

        labels: [
          "Usuários",
          "VIPs",
          "Sinais"
        ],

        datasets: [{

          label: "BETNOX AI",

          data: [

            data.usuarios,
            data.vips,
            data.sinaisGerados

          ],

          borderColor: "#22c55e",

          backgroundColor:
            "rgba(34,197,94,0.2)",

          tension: 0.4,

          fill: true

        }]
      },

      options: {

        responsive: true
      }
    });
}

// ==========================================
// 👥 CARREGAR USUÁRIOS
// ==========================================

async function carregarUsuarios() {

  try {

    const response = await fetch(

      `${API_URL}/admin/users`,

      {

        headers: {

          email: adminEmail

        }

      }
    );

    // ==========================================
    // ❌ NÃO AUTORIZADO
    // ==========================================

    if (
      response.status === 401 ||
      response.status === 403
    ) {

      return;
    }

    const usuarios =
      await response.json();

    const tabela =
      document.getElementById(
        "usuariosTabela"
      );

    tabela.innerHTML = "";

    usuarios.reverse().forEach((user) => {

      tabela.innerHTML += `

        <tr>

          <td>
            ${user.email}
          </td>

          <td>

            <span class="
              badge-status
              ${user.status === "online"
                ? "online"
                : ""}
            ">

              ${user.status || "offline"}

            </span>

          </td>

          <td>

            <span class="
              ${user.plano === "VIP"
                ? "badge-vip"
                : "badge-status"}
            ">

              ${user.plano || "FREE"}

            </span>

          </td>

          <td>
            ${user.ultimoAcesso || "-"}
          </td>

        </tr>

      `;
    });

  } catch (error) {

    console.log(
      "❌ erro usuários:",
      error
    );
  }
}

// ==========================================
// 📜 CARREGAR LOGS
// ==========================================

async function carregarLogs() {

  try {

    const response = await fetch(

      `${API_URL}/admin/logs`,

      {

        headers: {

          email: adminEmail

        }

      }
    );

    // ==========================================
    // ❌ NÃO AUTORIZADO
    // ==========================================

    if (
      response.status === 401 ||
      response.status === 403
    ) {

      return;
    }

    const logs =
      await response.json();

    const container =
      document.getElementById(
        "logsContainer"
      );

    // ==========================================
    // 🔥 CLEAR
    // ==========================================

    container.innerHTML = "";

    // ==========================================
    // ❌ SEM LOGS
    // ==========================================

    if (!logs || logs.length === 0) {

      container.innerHTML = `

        <div class="log-line">

          <span class="log-time">
            agora
          </span>

          <span class="log-type warning">
            EMPTY
          </span>

          <span class="log-message">
            Nenhum log encontrado
          </span>

        </div>

      `;

      return;
    }

    // ==========================================
    // 📜 RENDER
    // ==========================================

    logs.slice(0, 50).forEach(log => {

      let classe = "info";

      // ==========================================
      // 🎨 CORES
      // ==========================================

      if (
        log.tipo?.includes("ERROR")
      ) {

        classe = "error";
      }

      else if (

        log.tipo?.includes("VIP") ||

        log.tipo?.includes("SUCCESS") ||

        log.tipo?.includes("START")
      ) {

        classe = "success";
      }

      else if (

        log.tipo?.includes("RATE") ||

        log.tipo?.includes("EMPTY") ||

        log.tipo?.includes("WARNING")
      ) {

        classe = "warning";
      }

      // ==========================================
      // 🕒 DATA
      // ==========================================

      const data =
        new Date(
          log.data
        ).toLocaleString(
          "pt-BR"
        );

      // ==========================================
      // 🖥️ HTML
      // ==========================================

      container.innerHTML += `

        <div class="log-line">

          <span class="log-time">
            ${data}
          </span>

          <span class="
            log-type
            ${classe}
          ">

            ${log.tipo}

          </span>

          <span class="log-message">

            ${log.mensagem}

          </span>

        </div>

      `;
    });

  } catch (error) {

    console.log(
      "❌ erro logs:",
      error
    );
  }
}

// ==========================================
// 🔄 AUTO UPDATE
// ==========================================

setInterval(() => {

  carregarStats();

  carregarUsuarios();

  carregarLogs();

}, 10000);

// ==========================================
// 🚀 INIT
// ==========================================

carregarStats();

carregarUsuarios();

carregarLogs();