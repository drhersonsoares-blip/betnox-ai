const axios = require("axios");
require("dotenv").config();

const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function enviarMensagem(texto) {
  try {
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

    await axios.post(url, {
      chat_id: CHAT_ID,
      text: texto,
      parse_mode: "HTML"
    });

    console.log("📩 Mensagem enviada");
  } catch (e) {
    console.error("Erro Telegram:", e.message);
  }
}

module.exports = { enviarMensagem };