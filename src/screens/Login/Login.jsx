import React, { useState } from 'react';
import './Login.css';
import { auth, provider } from '../../firebase';
import Cadastro from '../Sing in/cadastro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle} from '@fortawesome/free-brands-svg-icons';


function Login(){
  const [isCadastroVisible, setIsCadastroVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSigninEmail = async (e) => {
    e.preventDefault();

    try {
      // Faça o login com e-mail/senha usando o Firebase
      await auth.signInWithEmailAndPassword(email, senha);

      // Se o login for bem-sucedido, você pode redirecionar o usuário ou realizar outras ações necessárias
      console.log('Login bem-sucedido!');
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
    }
  };

    function handleSignin () {
        auth.signInWithPopup(provider).catch(alert)
          
      }


      function handleToggleCadastro() {
        setIsCadastroVisible(!isCadastroVisible);
      }
    


    return(
        <div className={`login-container ${isCadastroVisible ? 'cadastro-active' : ''}`}>
          <div className='login-form'>
        {isCadastroVisible ? (
          <Cadastro />
        ) : ( 
          <div>
          <form onSubmit={handleSigninEmail}>
            <div className="img-logo">
              <img className='login-logo' src='https://github.com/Kaiquekaan/TaskBot/blob/master/src/imagens/logo2.png?raw=true' alt="" />
            </div>
            <div className='titulo-login'>
            <label className='label-login' htmlFor="nome">login</label>
            </div>
            <label className='label-login' htmlFor="email">E-mail:</label>
            <input
              className='input-login'
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className='label-login' htmlFor="senha">Senha:</label>
            <input
              className='input-login'
              type="password"
              id="senha"
              name="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button className='btn-login' type="submit" id="redirecionar">
              Fazer Login
            </button>
          </form>
        </div>
            
           
        )} 
        <button className='btn-cadas' onClick={handleToggleCadastro}>
            <span>{!isCadastroVisible ? 'Criar uma conta' : 'Já tenho uma conta'}</span>
        </button>
          
            <button className="botao-com-imagem" onClick={handleSignin}>   
            <img src="https://cdn.iconscout.com/icon/free/png-256/free-google-1772223-1507807.png" alt="" />  
          <span>Fazer login com google</span>
         
        </button>
        </div>
        
        </div>
    )
}

export default Login;
