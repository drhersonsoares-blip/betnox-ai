const cron = require("node-cron");

const { buscarJogos } = require("./services/apiFootball");
const { buscarStatsTime } = require("./services/statsService");
const { buscarOddsPorJogo } = require("./services/oddsService");
const { analisarJogoComStats } = require("./services/aiService");
const { gerarTopApostas } = require("./services/rankingService");
const { enviarMensagem } = require("./services/telegramService");
const { formatarTop } = require("./services/formatService");
const { salvarApostas } = require("./services/historicoService");

let rodando = false;
let ultimaNotificacaoVazia = null;
let pausaAte = null;

// delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ⏰ roda a cada 2 horas
cron.schedule("0 */2 * * *", async () => {

  // 🔥 PAUSA GLOBAL (PRIMEIRA COISA)
  if (pausaAte && Date.now() < pausaAte) {
    console.log("⏸️ Sistema pausado para evitar bloqueio...");
    return;
  }

  if (rodando) {
    console.log("⏳ Já está rodando, pulando...");
    return;
  }

  const hora = new Date().getHours();
  if (hora < 10 || hora > 23) {
    console.log("🌙 Fora do horário de jogos");
    return;
  }

  rodando = true;

  console.log("⏰ Rodando envio automático...");

  try {

    const jogos = await buscarJogos();

    console.log("🎮 Jogos recebidos:", jogos?.length || 0);

    // 🔥 SEM JOGOS → PAUSA
    if (!jogos || jogos.length === 0) {
      console.log("⚠️ Nenhum jogo encontrado — pausando sistema");

      pausaAte = Date.now() + (2 * 60 * 60 * 1000);

      rodando = false;
      return;
    }

    const analisados = [];

    for (const jogo of jogos) {
      try {

        await delay(1000);

        const statsCasa = await buscarStatsTime(jogo.teamIdCasa);
        const statsFora = await buscarStatsTime(jogo.teamIdFora);
        const odds = await buscarOddsPorJogo(jogo.fixtureId);

        const statsCasaSafe = statsCasa || {
          golsMarcados: 1,
          golsSofridos: 1,
          jogos: 1
        };

        const statsForaSafe = statsFora || {
          golsMarcados: 1,
          golsSofridos: 1,
          jogos: 1
        };

        const analise = analisarJogoComStats(
          {
            ...jogo,
            odd: odds?.casa || 2.0
          },
          statsCasaSafe,
          statsForaSafe
        );

        analisados.push(analise);

      } catch (e) {
        console.log("❌ Erro jogo:", e.message);
      }
    }

    console.log("📊 Total analisados:", analisados.length);

    const top = gerarTopApostas(analisados);

    salvarApostas(top);

    console.log("📊 TOP ENCONTRADO:", top);

    if (top && top.length > 0) {

      const free = [top[0]];
      const vip = top;

      const msgFree = formatarTop(free);
      const msgVip = formatarTop(vip);

      await enviarMensagem(msgFree, process.env.CHAT_ID_FREE);
      console.log("📩 FREE enviado");

      await enviarMensagem(msgVip, process.env.CHAT_ID_VIP);
      console.log("💰 VIP enviado");

      ultimaNotificacaoVazia = null;

    } else {

      console.log("⚠️ Nenhuma aposta encontrada");

      const agora = Date.now();

      if (!ultimaNotificacaoVazia || agora - ultimaNotificacaoVazia > 21600000) {
        await enviarMensagem(
          "🤖 Nenhuma oportunidade com valor no momento. A IA continua analisando...",
          process.env.CHAT_ID_FREE
        );

        ultimaNotificacaoVazia = agora;
        console.log("📢 Aviso enviado (sem jogos)");
      }
    }

  } catch (e) {

    // 🔥 SE FOR RATE LIMIT → PAUSA FORTE
    if (e.message === "RATE_LIMIT") {
      console.log("🚫 BLOQUEADO — pausando sistema por 3h");
      pausaAte = Date.now() + (3 * 60 * 60 * 1000);
    }

    console.log("🔥 Erro geral:", e.message);
  }

  rodando = false;
});