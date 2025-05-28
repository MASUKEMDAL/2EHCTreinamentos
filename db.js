const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db');

// Cria tabela se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      email TEXT UNIQUE,
      senha TEXT,
      tipo TEXT
    )
  `);
});

module.exports = db;
