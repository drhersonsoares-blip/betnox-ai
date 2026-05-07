const { analisarErros } = require("./iaAprendizadoService");

// ======================
// 🔢 UTILIDADES
// ======================

function mediaGols(gols, jogos) {
  if (!jogos || jogos === 0) return 0;
  return gols / jogos;
}

// cache de fatoriais (performance)
const cacheFatorial = {};

function fatorial(n) {
  if (n === 0) return 1;
  if (cacheFatorial[n]) return cacheFatorial[n];

  cacheFatorial[n] = n * fatorial(n - 1);
  return cacheFatorial[n];
}

// ======================
// 📊 POISSON
// ======================

function poisson(lambda, k) {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / fatorial(k);
}

// ======================
// 📈 PROBABILIDADES
// ======================

function calcularProbabilidades(lambdaCasa, lambdaFora) {
  let probCasa = 0;
  let probEmpate = 0;
  let probFora = 0;

  for (let i = 0; i <= 5; i++) {
    for (let j = 0; j <= 5; j++) {
      const p = poisson(lambdaCasa, i) * poisson(lambdaFora, j);

      if (i > j) probCasa += p;
      else if (i === j) probEmpate += p;
      else probFora += p;
    }
  }

  return { probCasa, probEmpate, probFora };
}

// ======================
// 💰 EV
// ======================

function calcularEV(prob, odd) {
  return (prob * odd) - 1;
}

// ======================
// 💰 GESTÃO DE BANCA (KELLY)
// ======================

function calcularStake(prob, odd) {
  const kelly = ((odd * prob) - 1) / (odd - 1);

  if (kelly <= 0) return 0;

  return kelly * 0.5; // conservador
}

// ======================
// 🧠 IA PRINCIPAL
// ======================

function analisarJogoComStats(jogo, statsCasa, statsFora) {

  // 🔥 SEGURANÇA TOTAL
  const ataqueCasa = mediaGols(statsCasa?.golsMarcados || 1, statsCasa?.jogos || 1);
  const defesaFora = mediaGols(statsFora?.golsSofridos || 1, statsFora?.jogos || 1);

  const ataqueFora = mediaGols(statsFora?.golsMarcados || 1, statsFora?.jogos || 1);
  const defesaCasa = mediaGols(statsCasa?.golsSofridos || 1, statsCasa?.jogos || 1);

  let lambdaCasa = ataqueCasa * defesaFora;
  let lambdaFora = ataqueFora * defesaCasa;

  // ======================
  // 🧠 APRENDIZADO DA IA
  // ======================

  const aprendizado = analisarErros();

  if (aprendizado && parseFloat(aprendizado.mediaEVErro) > 0.2) {
    lambdaCasa *= 0.9;
    lambdaFora *= 0.9;
  }

  // ======================
  // 📊 CÁLCULO
  // ======================

  const probs = calcularProbabilidades(lambdaCasa, lambdaFora);

  const evCasa = calcularEV(probs.probCasa, jogo.odd);

  const stake = calcularStake(probs.probCasa, jogo.odd);

  // ======================
  // 🎯 GESTÃO CLASSIFICADA
  // ======================

  let gestao;

  if (stake < 0.02) gestao = "❌ NÃO APOSTAR";
  else if (stake < 0.05) gestao = "🟡 BAIXO";
  else if (stake < 0.10) gestao = "🟠 MÉDIO";
  else gestao = "🟢 FORTE";

  // ======================
  // 🎯 RESULTADO FINAL
  // ======================

  return {
    ...jogo,

    lambdaCasa: lambdaCasa.toFixed(2),
    lambdaFora: Number(lambdaFora).toFixed(2),

    probCasa: probs.probCasa.toFixed(2),
    probEmpate: probs.probEmpate.toFixed(2),
    probFora: probs.probFora.toFixed(2),

    evCasa: evCasa.toFixed(2),

    confianca: (probs.probCasa * 100).toFixed(0) + "%",

    nivel:
      evCasa > 0.25
        ? "💎 ALTA CONFIANÇA"
        : evCasa > 0.10
        ? "🔥 BOA"
        : "⚠️ ARRISCADA",

    recomendacao:
      evCasa > 0
        ? "🔥 VALUE BET"
        : "❌ EV NEGATIVO",

    stake: (stake * 100).toFixed(1) + "%",

    gestao
  };
}

module.exports = { analisarJogoComStats };