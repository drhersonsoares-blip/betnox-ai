const db = require("../config/db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS jogos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timeCasa TEXT,
      timeFora TEXT,
      oddCasa REAL,
      probabilidade REAL
    )
  `);

  console.log("✅ Tabela criada");
});

db.run(`
  INSERT INTO jogos (timeCasa, timeFora, oddCasa, probabilidade)
  VALUES ('Flamengo', 'Boca Juniors', 1.8, 0.62)
`);