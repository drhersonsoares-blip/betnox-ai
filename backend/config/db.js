const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Erro ao conectar no banco", err);
  } else {
    console.log("🔥 Banco conectado");
  }
});

module.exports = db;