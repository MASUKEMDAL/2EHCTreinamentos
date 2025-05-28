# 📚 Plataforma de Cursos 2EHC - Segurança do Trabalho

Bem-vindo à plataforma de cursos da **2EHC Treinamentos**!  
Este projeto oferece um ambiente de aprendizagem online focado em normas regulamentadoras (NRs) e brigada de incêndio, com acesso por login e controle de usuários.

---

## 🧩 Funcionalidades

✅ Login e Cadastro de usuários  
✅ Diferenciação entre tipos de usuários (aluno, admin, etc.)  
✅ Área exclusiva do aluno com cursos disponíveis  
✅ Vídeos hospedados localmente ou via YouTube  
✅ Banco de dados SQLite para armazenar usuários  
✅ Design intuitivo com navegação clara  
✅ Botão de logout funcional  
✅ Layout adaptável e organizado  

---

## 🖼️ Layout da Plataforma

### Página Inicial (`index.html`)
- Apresentação institucional
- Botões de acesso (login/cadastro)

### Tela do Aluno (`home_aluno.html`)
- Mensagem de boas-vindas
- Lista de cursos disponíveis com botões para assistir
- Botões de navegação lateral: `Início`, `Cursos`, `Acompanhamento`, `Financeiro`
- Botão de `Logout` no topo esquerdo

### Cursos disponíveis:
- 🪑 NR17 – Ergonomia
- ⚡ NR10 – Segurança em Instalações Elétricas
- 🧗 NR35 – Trabalho em Altura
- 🔥 Brigada de Incêndio

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Descrição |
|------------|-----------|
| HTML5      | Estrutura das páginas |
| CSS3       | Estilização visual |
| JavaScript | Interatividade e autenticação |
| Node.js + Express | Backend para API de login e cadastro |
| SQLite     | Banco de dados local |

---

## 📁 Estrutura de Pastas

NR10/
├── backend/
│ ├── routes/
│ │ └── auth.js
│ ├── db.js
│ └── server.js
├── videos/
│ └── nr17-modulo1.mp4
├── cadastro.html
├── curso_nr10.html
├── curso_nr17.html
├── curso_nr35.html
├── curso_brigada.html
├── home_aluno.html
├── index.html
├── login.html
├── db.sql
├── logo2ehc.png
└── package.json

---

## ⚙️ Como Executar Localmente

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
Instale as dependências

npm install
Crie o banco de dados (SQLite)

Rode o script db.sql ou crie uma vez no próprio código ao iniciar o servidor.

Inicie o servidor

node backend/server.js
Acesse o frontend

Abra index.html no navegador ou sirva os arquivos com Live Server.

🔒 Segurança
⚠️ As senhas atualmente são armazenadas em texto plano.
É altamente recomendado utilizar bcrypt para hash de senha e JWT para autenticação em produção.

🚀 Possíveis Melhorias Futuras
🔐 Autenticação com JWT

🧠 Painel administrativo com controle de cursos e alunos

📨 Sistema de recuperação de senha

🌐 Deploy com domínio personalizado

📱 Responsividade total (mobile/tablet)

🧑‍💻 Desenvolvedor Masuke
🔗 Seu LinkedIn masukemdal
📧 matheusmarferreira@hotmail.com

📄 Licença
Este projeto está licenciado sob a Licença MIT.
Sinta-se livre para usar, modificar e distribuir.

