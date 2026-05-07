// ======================
// 🔐 CONFIG VIP
// ======================

let usuarioVIP = false;
let emailUsuario = localStorage.getItem("email") || null;

// ======================
// 🚀 LOAD
// ======================

window.onload = async function () {

  mostrarLoading();

  // 🔥 verifica VIP
  await verificarVIP();

  carregarBanca();
  carregarGrafico();
  carregarStats();
  carregarTop();

  // 🔄 atualização
  setInterval(carregarTop, 15000);
};

// ======================
// 🔥 LOADING
// ======================

function mostrarLoading() {

  const lista = document.getElementById("lista");

  lista.innerHTML = `
    <div class="card" style="text-align:center">

      <h3 style="color:#22c55e">
        🤖 IA analisando jogos...
      </h3>

      <p style="margin-top:10px">
        Buscando oportunidades de valor
      </p>

    </div>
  `;
}

// ======================
// 🔐 VERIFICA VIP
// ======================

async function verificarVIP() {

  try {

    if (!emailUsuario) return;

    const res = await fetch(
      "http://localhost:3000/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: emailUsuario
        })
      }
    );

    const data = await res.json();

    usuarioVIP = data.vip === true;

    console.log("🔐 VIP:", usuarioVIP);

  } catch (e) {

    console.log("Erro VIP:", e);
  }
}

// ======================
// 🔥 TOP APOSTAS
// ======================

async function carregarTop() {

  const lista = document.getElementById("lista");

  try {

    const res = await fetch(
      "http://localhost:3000/top"
    );

    const dados = await res.json();

    lista.innerHTML = "";

    // ======================
    // ❌ SEM DADOS
    // ======================

    if (!dados || dados.length === 0) {

      lista.innerHTML = `
        <div class="card" style="text-align:center">

          <h3 style="color:#f59e0b">
            ⚠️ Nenhuma oportunidade agora
          </h3>

          <p style="margin-top:10px">
            A IA continua analisando os jogos...
          </p>

        </div>
      `;

      return;
    }

    // ======================
    // 🔥 FREE vs VIP
    // ======================

    const apostasVisiveis =
      usuarioVIP
        ? dados
        : dados.slice(0, 1);

    apostasVisiveis.forEach((jogo, index) => {

      const div = document.createElement("div");

      div.className = "card";

      // 🔥 nível visual
      let glow = "#334155";

      if (parseFloat(jogo.evCasa) > 0.25) {
        glow = "#22c55e";
      }

      div.style.border =
        `1px solid ${glow}`;

      div.innerHTML = `

        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:15px;
        ">

          <div>

            <div style="
              font-size:12px;
              color:#94a3b8;
              margin-bottom:5px;
            ">
              🔥 TOP ${index + 1}
            </div>

            <div class="times">
              ${jogo.timeCasa}
              vs
              ${jogo.timeFora}
            </div>

          </div>

          <div style="
            background:${glow};
            color:#000;
            padding:8px 12px;
            border-radius:8px;
            font-weight:bold;
          ">
            ${jogo.confianca}
          </div>

        </div>

        <div class="info">

          <span>
            📊 Prob:
            ${jogo.probCasa}
          </span>

          <span>
            💰 EV:
            ${jogo.evCasa}
          </span>

        </div>

        <div class="info">

          <span>
            📈 Stake:
            ${jogo.stake || "-"}
          </span>

          <span>
            ${jogo.gestao || ""}
          </span>

        </div>

        <div style="
          margin-top:15px;
        ">

          <div class="
            badge
            ${parseFloat(jogo.evCasa) > 0 ? 'green' : 'yellow'}
          ">

            ${jogo.recomendacao || jogo.destaque}

          </div>

        </div>

      `;

      lista.appendChild(div);
    });

    // ======================
    // 🔒 BLOQUEIO VIP
    // ======================

    if (!usuarioVIP && dados.length > 1) {

      const bloqueio = document.createElement("div");

      bloqueio.className = "card";

      bloqueio.style.border =
        "1px solid #22c55e";

      bloqueio.innerHTML = `

        <div style="text-align:center">

          <h2 style="
            color:#22c55e;
            margin-bottom:10px;
          ">
            🔐 Área Premium
          </h2>

          <p style="
            color:#cbd5f5;
            line-height:1.6;
          ">

            Desbloqueie todas as análises,
            gestão profissional,
            métricas avançadas
            e oportunidades premium.

          </p>

          <button
            onclick="irParaPagamento()"
            class="btn-green"
            style="margin-top:20px"
          >
            🚀 Tornar-se VIP
          </button>

          <div style="
            margin-top:25px;
          ">

            <p style="
              color:#94a3b8;
              margin-bottom:10px;
            ">
              Já assinou?
            </p>

            <input
              id="emailVIP"
              type="email"
              placeholder="Digite seu email Hotmart"
              style="
                padding:12px;
                width:80%;
                border-radius:10px;
                border:none;
                margin-bottom:10px;
              "
            />

            <br>

            <button
              onclick="entrarVIP()"
              class="btn-dark"
            >
              🔐 Entrar no VIP
            </button>

          </div>

        </div>
      `;

      lista.appendChild(bloqueio);
    }

  } catch (e) {

    console.log("Erro:", e);

    lista.innerHTML = `
      <div class="card" style="text-align:center">

        <h3 style="color:#ef4444">
          ❌ Erro ao conectar
        </h3>

        <p style="margin-top:10px">
          Verifique se o servidor está rodando
        </p>

      </div>
    `;
  }
}

// ======================
// 🔐 LOGIN VIP
// ======================

async function entrarVIP() {

  const email = document
    .getElementById("emailVIP")
    .value;

  if (!email) {

    alert("Digite seu email");

    return;
  }

  try {

    localStorage.setItem(
      "email",
      email
    );

    emailUsuario = email;

    await verificarVIP();

    if (usuarioVIP) {

      alert("✅ VIP liberado!");

      location.reload();

    } else {

      alert(
        "❌ Email não encontrado como VIP"
      );
    }

  } catch (e) {

    console.log(e);

    alert("Erro ao validar VIP");
  }
}

// ======================
// 💰 PAGAMENTO
// ======================

function irParaPagamento() {

  window.location.href =
    "checkout.html";
}

// ======================
// 📊 STATS
// ======================

async function carregarStats() {

  try {

    const res = await fetch(
      "http://localhost:3000/stats"
    );

    const s = await res.json();

    document.getElementById("stats").innerHTML = `

      <div class="card">

        <h3 style="
          color:#22c55e;
          margin-bottom:20px;
        ">
          📊 Performance da IA
        </h3>

        <div class="info">

          <span>
            🎯 Total:
            ${s.total}
          </span>

          <span>
            ✅ Wins:
            ${s.vitórias || s.wins}
          </span>

          <span>
            ❌ Losses:
            ${s.perdas || s.losses}
          </span>

        </div>

        <div class="info">

          <span>
            📈 Taxa:
            ${s.taxa}
          </span>

          <span>
            💰 Lucro:
            ${s.lucro}
          </span>

          <span>
            🚀 ROI:
            ${s.roi || "0%"}
          </span>

        </div>

      </div>
    `;

  } catch (e) {

    console.log("Erro stats:", e);
  }
}

// ======================
// 📈 GRÁFICO LUCRO
// ======================

async function carregarGrafico() {

  const res = await fetch(
    "http://localhost:3000/grafico"
  );

  const dados = await res.json();

  const labels =
    dados.map(d => d.index);

  const valores =
    dados.map(d => d.lucro);

  const ctx =
    document.getElementById(
      "graficoLucro"
    );

  new Chart(ctx, {

    type: "line",

    data: {

      labels,

      datasets: [{

        label: "Lucro acumulado",

        data: valores,

        borderWidth: 3,

        tension: 0.4,

      }]
    }
  });
}

// ======================
// 📈 BANCA
// ======================

async function carregarBanca() {

  const res = await fetch(
    "http://localhost:3000/banca"
  );

  const dados = await res.json();

  const labels =
    dados.map(d => d.rodada);

  const valores =
    dados.map(d => d.banca);

  const ctx =
    document.getElementById(
      "graficoBanca"
    );

  new Chart(ctx, {

    type: "line",

    data: {

      labels,

      datasets: [{

        label: "Crescimento da banca",

        data: valores,

        borderWidth: 3,

        tension: 0.4

      }]
    }
  });
}