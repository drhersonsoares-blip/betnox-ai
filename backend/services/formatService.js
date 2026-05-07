function formatarTop(top) {
  let msg = "🔥 <b>TOP OPORTUNIDADES DO DIA</b>\n\n";

  top.forEach(jogo => {
    msg += `
🏆 ${jogo.rank}º ${jogo.timeCasa} vs ${jogo.timeFora}
📊 Prob: ${jogo.probCasa}
🎯 Confiança: ${jogo.confianca}
💰 EV: ${jogo.evCasa}
🔥 ${jogo.destaque}

`;
  });

  return msg;
}

module.exports = { formatarTop };