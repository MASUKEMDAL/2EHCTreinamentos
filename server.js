const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Banco de dados SQLite
const db = new sqlite3.Database('./database.sqlite');

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rota de cadastro
app.post('/api/cadastro', (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  db.run('INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
    [nome, email, senha, tipo],
    (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
      }
      res.status(200).json({ mensagem: 'Cadastro realizado com sucesso!' });
    }
  );
});

// Rota de login
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;

  db.get('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ erro: 'Erro ao consultar usuário' });
    }

    if (!row) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
    }

    res.status(200).json({ mensagem: 'Login bem-sucedido', usuario: row });
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
