const cron = require("node-cron");

const fs = require("fs");

const path = require("path");

const { buscarJogos } = require("./services/apiFootball");
const { buscarStatsTime } = require("./services/statsService");
const { buscarOddsPorJogo } = require("./services/oddsService");
const { analisarJogoComStats } = require("./services/aiService");
const { gerarTopApostas } = require("./services/rankingService");
const { enviarMensagem } = require("./services/telegramService");
const { formatarTop } = require("./services/formatService");
const { salvarApostas } = require("./services/historicoService");

// ======================
// 📂 LOGS
// ======================

const caminhoLogs = path.join(
  __dirname,
  "./database/logs.json"
);

// ======================
// 🔥 HELPERS
// ======================

function criarArquivoLogs() {

  if (!fs.existsSync(caminhoLogs)) {

    fs.writeFileSync(
      caminhoLogs,
      JSON.stringify([], null, 2)
    );
  }
}

function salvarLog(tipo, mensagem) {

  try {

    criarArquivoLogs();

    const logs = JSON.parse(

      fs.readFileSync(
        caminhoLogs,
        "utf-8"
      )
    );

    logs.push({

      tipo,

      mensagem,

      data:
        new Date()

    });

    // 🔥 evita crescer infinito
    const limite =
      logs.slice(-500);

    fs.writeFileSync(

      caminhoLogs,

      JSON.stringify(
        limite,
        null,
        2
      )
    );

  } catch (e) {

    console.log(
      "❌ erro log:",
      e.message
    );
  }
}

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

  return new Promise(resolve =>

    setTimeout(resolve, ms)
  );
}

// ======================
// 🧠 HORÁRIOS ESTRATÉGICOS
// ======================

cron.schedule(
  "0 9,12,15,18,21 * * *",

  async () => {

    // ======================
    // ⏸️ PAUSA GLOBAL
    // ======================

    if (

      pausaAte &&

      Date.now() < pausaAte
    ) {

      console.log(
        "⏸️ Sistema pausado"
      );

      salvarLog(
        "PAUSE",
        "Sistema pausado por proteção anti-ban"
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

      salvarLog(
        "LOOP",
        "Cron já estava rodando"
      );

      return;
    }

    // ======================
    // 🌙 HORÁRIO INTELIGENTE
    // ======================

    const hora =
      new Date().getHours();

    if (hora < 9 || hora > 23) {

      console.log(
        "🌙 Fora do horário"
      );

      salvarLog(
        "SMART_TIME",
        "Execução bloqueada por horário inteligente"
      );

      return;
    }

    rodando = true;

    console.log(
      `🚀 IA iniciando análise (${hora}h)`
    );

    salvarLog(
      "START",
      `IA iniciou análise ${hora}h`
    );

    try {

      // ======================
      // 🎮 BUSCAR JOGOS
      // ======================

      const jogos =
        await buscarJogos();

      console.log(
        "🎮 Jogos encontrados:",
        jogos?.length || 0
      );

      salvarLog(
        "JOGOS",
        `Jogos encontrados: ${jogos?.length || 0}`
      );

      // ======================
      // ❌ SEM JOGOS
      // ======================

      if (

        !jogos ||

        jogos.length === 0
      ) {

        console.log(
          "⚠️ Nenhum jogo encontrado"
        );

        salvarLog(
          "EMPTY",
          "Nenhum jogo encontrado"
        );

        pausaAte =
          Date.now() + (6 * 60 * 60 * 1000);

        const agora =
          Date.now();

        if (

          !ultimaNotificacaoVazia ||

          agora -
          ultimaNotificacaoVazia >

          21600000
        ) {

          await enviarMensagem(
`
🤖 <b>Betnox AI</b>

⚠️ Nenhuma oportunidade encontrada no momento.

📊 A IA continua monitorando os jogos automaticamente.
`,
            process.env.CHAT_ID_FREE
          );

          ultimaNotificacaoVazia =
            agora;
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

          await delay(3000);

          // ======================
          // 🔁 DUPLICADO
          // ======================

          if (

            jogosEnviados.includes(
              jogo.fixtureId
            )
          ) {

            console.log(
              "🔁 Jogo repetido:",
              jogo.fixtureId
            );

            salvarLog(
              "DUPLICATE",
              `Jogo repetido ${jogo.fixtureId}`
            );

            continue;
          }

          const statsCasa =
            await buscarStatsTime(
              jogo.teamIdCasa
            );

          await delay(1500);

          const statsFora =
            await buscarStatsTime(
              jogo.teamIdFora
            );

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

            salvarLog(
              "ODDS",
              `Odds indisponíveis ${jogo.fixtureId}`
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

          analisados.push(
            analise
          );

        } catch (e) {

          console.log(
            "❌ Erro jogo:",
            e.message
          );

          salvarLog(
            "GAME_ERROR",
            e.message
          );
        }
      }

      console.log(
        "📊 Total analisados:",
        analisados.length
      );

      salvarLog(
        "ANALISE",
        `Total analisados: ${analisados.length}`
      );

      // ======================
      // 🏆 TOP
      // ======================

      const top =
        gerarTopApostas(
          analisados
        );

      salvarApostas(top);

      // ======================
      // ❌ SEM TOP
      // ======================

      if (

        !top ||

        top.length === 0
      ) {

        console.log(
          "⚠️ Nenhuma aposta EV+"
        );

        salvarLog(
          "NO_EV",
          "Nenhuma aposta EV positiva"
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

      if (
        jogosEnviados.length > 100
      ) {

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

      salvarLog(
        "FREE",
        "Mensagem FREE enviada"
      );

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

      salvarLog(
        "VIP",
        "Mensagem VIP enviada"
      );

      ultimaNotificacaoVazia =
        null;

    } catch (e) {

      // ======================
      // 🚫 RATE LIMIT
      // ======================

      if (
        e.message === "RATE_LIMIT"
      ) {

        console.log(
          "🚫 RATE LIMIT"
        );

        salvarLog(
          "RATE_LIMIT",
          "Sistema pausado 12h"
        );

        pausaAte =
          Date.now() + (12 * 60 * 60 * 1000);
      }

      console.log(
        "🔥 Erro geral:",
        e.message
      );

      salvarLog(
        "ERROR",
        e.message
      );
    }

    rodando = false;

    salvarLog(
      "FINISH",
      "Execução finalizada"
    );
  }
);