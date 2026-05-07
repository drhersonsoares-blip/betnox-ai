const axios = require("axios");

require("dotenv").config();

// ======================
// 🔐 TOKEN TELEGRAM
// ======================

const TOKEN = process.env.BOT_TOKEN;

// ======================
// 📩 ENVIAR MENSAGEM
// ======================

async function enviarMensagem(
  texto,
  chatId
) {

  try {

    // 🔥 segurança
    if (!texto) {

      console.log(
        "⚠️ Texto vazio no Telegram"
      );

      return;
    }

    if (!chatId) {

      console.log(
        "⚠️ CHAT ID não definido"
      );

      return;
    }

    const url =
      `https://api.telegram.org/bot${TOKEN}/sendMessage`;

    await axios.post(url, {

      chat_id: chatId,

      text: texto,

      parse_mode: "HTML"

    });

    console.log(
      `📩 Mensagem enviada para ${chatId}`
    );

  } catch (e) {

    console.error(
      "❌ Erro Telegram:",
      e.response?.data || e.message
    );
  }
}

module.exports = {
  enviarMensagem
};