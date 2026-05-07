const cron = require("node-cron");

const { buscarJogos } = require("./services/apiFootball");
const { buscarStatsTime } = require("./services/statsService");
const { buscarOddsPorJogo } = require("./services/oddsService");
const { analisarJogoComStats } = require("./services/aiService");
const { gerarTopApostas } = require("./services/rankingService");
const { enviarMensagem } = require("./services/telegramService");
const { formatarTop } = require("./services/formatService");
const { salvarApostas } = require("./services/historicoService");

// ======================
// 🔐 CONTROLE GLOBAL
// ======================

let rodando = false;

let ultimaNotificacaoVazia = null;

let pausaAte = null;

// 🔥 evita repetir jogos
let jogosEnviados = [];

// ======================
// ⏳ DELAY
// ======================

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ======================
// 🧠 HORÁRIOS ESTRATÉGICOS
// ======================
//
// 09h
// 12h
// 15h
// 18h
// 21h
//
// reduz MUITO requisição
//

cron.schedule("0 9,12,15,18,21 * * *", async () => {

  // ======================
  // ⏸️ PAUSA GLOBAL
  // ======================

  if (pausaAte && Date.now() < pausaAte) {

    console.log(
      "⏸️ Sistema pausado para evitar bloqueio..."
    );

    return;
  }

  // ======================
  // 🔄 EVITA LOOP
  // ======================

  if (rodando) {

    console.log(
      "⏳ Já está rodando..."
    );

    return;
  }

  // ======================
  // 🌙 HORÁRIO INTELIGENTE
  // ======================

  const hora = new Date().getHours();

  if (hora < 9 || hora > 23) {

    console.log(
      "🌙 Fora do horário inteligente"
    );

    return;
  }

  rodando = true;

  console.log(
    `🚀 IA iniciando análise (${hora}h)`
  );

  try {

    // ======================
    // 🎮 BUSCAR JOGOS
    // ======================

    const jogos = await buscarJogos();

    console.log(
      "🎮 Jogos encontrados:",
      jogos?.length || 0
    );

    // ======================
    // ❌ SEM JOGOS
    // ======================

    if (!jogos || jogos.length === 0) {

      console.log(
        "⚠️ Nenhum jogo encontrado"
      );

      // 🔥 pausa 6h
      pausaAte =
        Date.now() + (6 * 60 * 60 * 1000);

      // 🔥 evita spam telegram
      const agora = Date.now();

      if (
        !ultimaNotificacaoVazia ||
        agora - ultimaNotificacaoVazia > 21600000
      ) {

        await enviarMensagem(
`
🤖 <b>Betnox AI</b>

⚠️ Nenhuma oportunidade encontrada no momento.

📊 A IA continua monitorando os jogos automaticamente.
`,
          process.env.CHAT_ID_FREE
        );

        ultimaNotificacaoVazia = agora;
      }

      rodando = false;

      return;
    }

    // ======================
    // 📊 ANALISAR
    // ======================

    const analisados = [];

    for (const jogo of jogos) {

      try {

        // 🔥 delay anti-ban
        await delay(3000);

        // 🔥 evita repetir jogo
        if (
          jogosEnviados.includes(
            jogo.fixtureId
          )
        ) {

          console.log(
            "🔁 Jogo já enviado:",
            jogo.fixtureId
          );

          continue;
        }

        const statsCasa =
          await buscarStatsTime(
            jogo.teamIdCasa
          );

        // 🔥 delay extra
        await delay(1500);

        const statsFora =
          await buscarStatsTime(
            jogo.teamIdFora
          );

        // 🔥 odds opcionais
        let odds = null;

        try {

          await delay(1500);

          odds =
            await buscarOddsPorJogo(
              jogo.fixtureId
            );

        } catch {

          console.log(
            "⚠️ Odds indisponíveis"
          );
        }

        const statsCasaSafe =
          statsCasa || {
            golsMarcados: 1,
            golsSofridos: 1,
            jogos: 1
          };

        const statsForaSafe =
          statsFora || {
            golsMarcados: 1,
            golsSofridos: 1,
            jogos: 1
          };

        const analise =
          analisarJogoComStats(
            {
              ...jogo,

              odd:
                odds?.casa || 2.0
            },

            statsCasaSafe,
            statsForaSafe
          );

        analisados.push(analise);

      } catch (e) {

        console.log(
          "❌ Erro jogo:",
          e.message
        );
      }
    }

    console.log(
      "📊 Total analisados:",
      analisados.length
    );

    // ======================
    // 🏆 TOP APOSTAS
    // ======================

    const top =
      gerarTopApostas(analisados);

    salvarApostas(top);

    // ======================
    // ❌ SEM TOP
    // ======================

    if (!top || top.length === 0) {

      console.log(
        "⚠️ Nenhuma aposta com EV positivo"
      );

      rodando = false;

      return;
    }

    // ======================
    // 🔥 MARCAR ENVIADOS
    // ======================

    top.forEach(j => {

      jogosEnviados.push(
        j.fixtureId
      );
    });

    // 🔥 limpa memória
    if (jogosEnviados.length > 100) {

      jogosEnviados =
        jogosEnviados.slice(-50);
    }

    // ======================
    // 💰 FREE vs VIP
    // ======================

    const free = [top[0]];

    const vip = top;

    const msgFree =
      formatarTop(free);

    const msgVip =
      formatarTop(vip);

    // ======================
    // 📩 FREE
    // ======================

    await enviarMensagem(
      msgFree,
      process.env.CHAT_ID_FREE
    );

    console.log(
      "📩 FREE enviado"
    );

    // 🔥 delay
    await delay(5000);

    // ======================
    // 💎 VIP
    // ======================

    await enviarMensagem(
      msgVip,
      process.env.CHAT_ID_VIP
    );

    console.log(
      "💎 VIP enviado"
    );

    ultimaNotificacaoVazia = null;

  } catch (e) {

    // ======================
    // 🚫 RATE LIMIT
    // ======================

    if (
      e.message === "RATE_LIMIT"
    ) {

      console.log(
        "🚫 RATE LIMIT DETECTADO"
      );

      // 🔥 pausa 12h
      pausaAte =
        Date.now() + (12 * 60 * 60 * 1000);
    }

    console.log(
      "🔥 Erro geral:",
      e.message
    );
  }

  rodando = false;
});