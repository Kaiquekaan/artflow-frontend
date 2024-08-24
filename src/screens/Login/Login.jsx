import React, { useState } from 'react';
import './Login.css';
import { auth, persistence } from '../../firebase'; // Certifique-se de importar persistence corretamente
import { useNavigate } from 'react-router-dom';
import Form from '../../components/Form';
import api from '../../api';

function Login() {
  const [singupErr, setSingupErr] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [loading, setLoging] = useState(false)
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleSigninEmail = async (e) => {
    setLoging(true);
    e.preventDefault();
    
    try {
      {/* const userCredential = await auth.signInWithEmailAndPassword(email, senha);
      const user = userCredential.user;
  
      // Definir o tipo de persistência com base na opção "Manter logado"
      const persistenceType = stayLoggedIn ? persistence.LOCAL : persistence.SESSION;
      await auth.setPersistence(persistenceType);
  
      // Verificar se o e-mail está verificado
      if (user.emailVerified) {
        alert('Login bem-sucedido!');
        navigate('/home');
      } else {
        // Mostrar mensagem de aviso e permitir que o usuário solicite um novo e-mail de verificação
        alert('Por favor, verifique seu e-mail antes de fazer login.');
  
        // Lidar com o caso em que o usuário fecha a mensagem sem verificar
        // Deslogar o usuário e permitir que ele solicite um novo e-mail de verificação
        await auth.signOut();
      }
*/}

        const res =  await api.post("api/user/token/", {email, senha})

    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      setSingupErr(true);
    }finally{
      setLoging(false);
    }
  };

  return (
    <div className='body'>
      <Form route="/api/user/token/" method="login"/>
    </div>
  );
}

export default Login;
