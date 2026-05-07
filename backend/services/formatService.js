function formatarTop(top) {

  // 🔥 sem dados
  if (!top || top.length === 0) {

    return `
🔥 <b>TOP OPORTUNIDADES DO DIA</b>

⚠️ Nenhuma oportunidade encontrada agora.
🤖 A IA continua analisando os jogos...
`;
  }

  let msg =
`🔥 <b>TOP OPORTUNIDADES DO DIA</b>

`;

  top.forEach(jogo => {

    msg += `
━━━━━━━━━━━━━━━

🏆 <b>${jogo.rank}º Lugar</b>

⚽ <b>${jogo.timeCasa}</b>
vs
<b>${jogo.timeFora}</b>

📊 Probabilidade:
${jogo.probCasa}

🎯 Confiança:
${jogo.confianca}

💰 EV:
${jogo.evCasa}

📈 Stake:
${jogo.stake || "-"}

🔥 <b>${jogo.destaque}</b>

`;
  });

  msg += `
━━━━━━━━━━━━━━━

🚀 Betnox AI
📊 Inteligência esportiva automatizada
`;

  return msg;
}

module.exports = {
  formatarTop
};