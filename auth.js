const express = require('express');
const router = express.Router();
const db = require('../db');

// Cadastro
router.post('/cadastro', (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  db.run(
    `INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)`,
    [nome, email, senha, tipo],
    function (err) {
      if (err) {
        return res.status(400).json({ erro: "Email já cadastrado ou erro no servidor" });
      }
      res.json({ id: this.lastID });
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  db.get(
    `SELECT * FROM usuarios WHERE email = ? AND senha = ?`,
    [email, senha],
    (err, row) => {
      if (err || !row) {
        return res.status(401).json({ erro: "Credenciais inválidas" });
      }
      res.json({ usuario: row });
    }
  );
});

module.exports = router;
