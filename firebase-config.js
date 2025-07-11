// Aguardar o Firebase ser carregado
const waitForFirebase = () => {
  return new Promise((resolve) => {
    if (window.firebase) {
      resolve();
    } else {
      const checkFirebase = setInterval(() => {
        if (window.firebase) {
          clearInterval(checkFirebase);
          resolve();
        }
      }, 100);
    }
  });
};

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDOI4O55CLW8eVkYSrTLU7j8GIrgNAt7Ik",
  authDomain: "ehc-treinamentos.firebaseapp.com",
  projectId: "ehc-treinamentos",
  storageBucket: "ehc-treinamentos.firebasestorage.app",
  messagingSenderId: "870338359628",
  appId: "1:870338359628:web:aabaf37c9cd853117edfe9",
  measurementId: "G-MD2N8JK2YM"
};

let app, auth, db;

// Inicializar Firebase
const initFirebase = async () => {
  await waitForFirebase();
  
  if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
  } else {
    app = firebase.app();
  }
  
  auth = firebase.auth();
  db = firebase.firestore();
  
  console.log('Firebase inicializado com sucesso');
};

// Função para cadastrar usuário
export const cadastrarUsuario = async (email, senha, dadosAdicionais, tipo) => {
  try {
    await initFirebase();
    console.log('Iniciando cadastro para:', email, 'tipo:', tipo);
    
    const userCredential = await auth.createUserWithEmailAndPassword(email, senha);
    const user = userCredential.user;
    
    console.log('Usuário criado no Auth:', user.uid);
    
    // Preparar dados para salvar
    const dadosParaSalvar = {
      ...dadosAdicionais,
      uid: user.uid,
      email: email,
      tipo: tipo,
      dataCadastro: new Date().toISOString()
    };
    
    // Salvar no Firestore
    const collection = tipo === 'aluno' ? 'alunos' : 'empresas';
    await db.collection(collection).doc(user.uid).set(dadosParaSalvar);
    
    console.log('Dados salvos no Firestore:', collection, user.uid);
    
    return { success: true, user, userData: dadosParaSalvar };
  } catch (error) {
    console.error('Erro no cadastro:', error);
    
    let errorMessage = 'Erro ao criar conta. Tente novamente.';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Este e-mail já está em uso.';
        break;
      case 'auth/weak-password':
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'E-mail inválido.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Erro de conexão. Verifique sua internet.';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
};

// Função para fazer login
export const logarUsuario = async (email, senha) => {
  try {
    await initFirebase();
    console.log('Tentando login para:', email);
    
    const userCredential = await auth.signInWithEmailAndPassword(email, senha);
    const user = userCredential.user;
    
    console.log('Login bem-sucedido, UID:', user.uid);
    
    // Buscar dados do usuário no Firestore
    let userData = null;
    
    // Verificar se é aluno
    try {
      const alunoDoc = await db.collection('alunos').doc(user.uid).get();
      if (alunoDoc.exists) {
        userData = { ...alunoDoc.data(), tipo: 'aluno' };
        console.log('Dados do aluno encontrados:', userData);
      }
    } catch (error) {
      console.log('Erro ao buscar aluno:', error);
    }
    
    // Se não é aluno, verificar se é empresa
    if (!userData) {
      try {
        const empresaDoc = await db.collection('empresas').doc(user.uid).get();
        if (empresaDoc.exists) {
          userData = { ...empresaDoc.data(), tipo: 'empresa' };
          console.log('Dados da empresa encontrados:', userData);
        }
      } catch (error) {
        console.log('Erro ao buscar empresa:', error);
      }
    }
    
    if (!userData) {
      console.error('Dados do usuário não encontrados no Firestore');
      return { success: false, error: 'Dados do usuário não encontrados.' };
    }
    
    return { success: true, user, userData };
  } catch (error) {
    console.error('Erro no login:', error);
    
    let errorMessage = 'E-mail ou senha incorretos.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'Usuário não encontrado.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Senha incorreta.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'E-mail inválido.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Erro de conexão. Verifique sua internet.';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Credenciais inválidas. Verifique e-mail e senha.';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
};

// Função para logout
export const deslogarUsuario = async () => {
  try {
    await initFirebase();
    await auth.signOut();
    localStorage.removeItem('alunoLogado');
    localStorage.removeItem('empresaLogada');
    return { success: true };
  } catch (error) {
    console.error('Erro no logout:', error);
    return { success: false, error: error.message };
  }
};

// Função para verificar estado de autenticação
export const verificarAutenticacao = () => {
  return new Promise(async (resolve) => {
    await initFirebase();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Função para buscar dados do usuário
export const buscarDadosUsuario = async (uid, tipo) => {
  try {
    await initFirebase();
    const docRef = db.collection(tipo === 'aluno' ? 'alunos' : 'empresas').doc(uid);
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: 'Usuário não encontrado' };
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return { success: false, error: error.message };
  }
};

// Função para atualizar dados do usuário
export const atualizarDadosUsuario = async (uid, tipo, dadosAtualizados) => {
  try {
    await initFirebase();
    const docRef = db.collection(tipo === 'aluno' ? 'alunos' : 'empresas').doc(uid);
    await docRef.update(dadosAtualizados);
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar dados:', error);
    return { success: false, error: error.message };
  }
};