function gerarTopApostas(jogos) {
  if (!jogos || jogos.length === 0) {
    return [];
  }

  return jogos

    // ======================
    // 🔥 FILTRO PROFISSIONAL
    // ======================
    .filter(jogo => {
      const ev = parseFloat(jogo.evCasa);
      const prob = parseFloat(jogo.probCasa);
      const stake = parseFloat(jogo.stake);

      return (
        ev > 0.08 &&        // valor esperado mínimo
        prob > 0.55 &&      // probabilidade mínima
        stake > 2           // stake mínimo (%)
      );
    })

    // ======================
    // 🧠 SCORE INTELIGENTE
    // ======================
    .map(jogo => {
      const prob = parseFloat(jogo.probCasa);
      const ev = parseFloat(jogo.evCasa);

      const score = (prob * 0.6) + (ev * 0.4);

      return {
        ...jogo,
        score
      };
    })

    // ======================
    // 📊 ORDENA POR SCORE
    // ======================
    .sort((a, b) => b.score - a.score)

    // ======================
    // 🔝 TOP 5
    // ======================
    .slice(0, 5)

    // ======================
    // 🎯 FORMATA FINAL
    // ======================
    .map((jogo, index) => {
      const ev = parseFloat(jogo.evCasa);
      const stake = parseFloat(jogo.stake);

      let destaque = "⚠️ OPORTUNIDADE";

      if (ev > 0.20 && stake > 8) {
        destaque = "🚨 APOSTA PREMIUM";
      } else if (ev > 0) {
        destaque = "🔥 VALUE BET";
      }

      return {
        rank: index + 1,
        ...jogo,
        destaque
      };
    });
}

module.exports = { gerarTopApostas };