const mongoose = require("mongoose");

// ==========================================
// 🚀 CONNECT MONGODB
// ==========================================

async function conectarMongo() {

  try {

    await mongoose.connect(

      process.env.MONGO_URI

    );

    console.log(`
========================================
🍃 MONGODB CONECTADO
========================================
🚀 Banco online
========================================
    `);

  } catch (e) {

    console.log(`
========================================
❌ ERRO MONGODB
========================================
${e.message}
========================================
    `);
  }
}

module.exports =
  conectarMongo;