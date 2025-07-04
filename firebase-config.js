// Configuração do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDOI4O55CLW8eVkYSrTLU7j8GIrgNAt7Ik",
  authDomain: "ehc-treinamentos.firebaseapp.com",
  projectId: "ehc-treinamentos",
  storageBucket: "ehc-treinamentos.firebasestorage.app",
  messagingSenderId: "870338359628",
  appId: "1:870338359628:web:aabaf37c9cd853117edfe9",
  measurementId: "G-MD2N8JK2YM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Funções de autenticação
export const cadastrarUsuario = async (email, senha, dadosAdicionais, tipo) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    
    // Salvar dados adicionais no Firestore
    await setDoc(doc(db, tipo === 'aluno' ? 'alunos' : 'empresas', user.uid), {
      ...dadosAdicionais,
      uid: user.uid,
      email: email,
      tipo: tipo,
      dataCadastro: new Date().toISOString()
    });
    
    return { success: true, user };
  } catch (error) {
    console.error('Erro no cadastro:', error);
    return { success: false, error: error.message };
  }
};

export const logarUsuario = async (email, senha) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    
    // Buscar dados do usuário no Firestore
    let userData = null;
    
    // Verificar se é aluno
    const alunoDoc = await getDoc(doc(db, 'alunos', user.uid));
    if (alunoDoc.exists()) {
      userData = { ...alunoDoc.data(), tipo: 'aluno' };
    } else {
      // Verificar se é empresa
      const empresaDoc = await getDoc(doc(db, 'empresas', user.uid));
      if (empresaDoc.exists()) {
        userData = { ...empresaDoc.data(), tipo: 'empresa' };
      }
    }
    
    return { success: true, user, userData };
  } catch (error) {
    console.error('Erro no login:', error);
    return { success: false, error: error.message };
  }
};

export const deslogarUsuario = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Erro no logout:', error);
    return { success: false, error: error.message };
  }
};

export const buscarDadosUsuario = async (uid, tipo) => {
  try {
    const docRef = doc(db, tipo === 'aluno' ? 'alunos' : 'empresas', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: 'Usuário não encontrado' };
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return { success: false, error: error.message };
  }
};