import React, { useState } from 'react';
import './Register.css';
import { auth, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import Form from '../../components/Form';


function Register(){
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [consenha, setconSenha] = useState('');
  const navigate = useNavigate();
  const [singupErr, setSingupErr] = useState(false);
  const [errMessage, setErrMessage] = useState('');
 

  const handleBack = () => {
    navigate('/');
  };

  const handleNext = () => {
    navigate('/signup/custom');
  };

  
  const handleCadastroSubmit = async (e) => {
    e.preventDefault();
  
    if (senha === consenha) {
      try {
        // Crie o usuário com e-mail e senha
        const userCredential = await auth.createUserWithEmailAndPassword(email, senha);
        const user = userCredential.user;
  
        // Enviar e-mail de verificação
        await user.sendEmailVerification();
  
        // Exibir mensagem de sucesso
       
  
        // Redirecionar ou executar outras ações
        navigate('/signup/custom');
      } catch (error) {
        console.error('Erro ao cadastrar:', error.message);
        setErrMessage(error.message);
        setSingupErr(true);
      }
    } else {
      setSingupErr(true);
    }
  };

 

    return(
        <div className='body'> 


       {/*  <form className='form-singup' onSubmit={handleCadastroSubmit}>
            <div className="img-logo">
              <img className='login-logo' src='https://github.com/Kaiquekaan/TaskBot/blob/master/src/imagens/MInimalista_Light_1.png?raw=true' alt="" />
            </div>
            <div className='titulo-login'>
             <h1 className='titulo'>Cadastro</h1>
            <p>Preencha os campos abaixo</p>
            </div>
            <div className='input-container'>
            <label className='label-login' htmlFor="email">E-mail:</label>
            <input
              className='input-login'
              placeholder='exemplo.email@gmail.com'
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className='label-login' htmlFor="senha">Senha:</label>
            <input
              className={!singupErr ? 'input-login' : 'input-login-err'}
              placeholder='12345@'
              type="password"
              id="senha"
              name="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <label className='label-login' htmlFor="consenha">Confirmar Senha:</label>
            <input
              className={!singupErr ? 'input-login' : 'input-login-err'}
              placeholder='12345@'
              type="password"
              id="consenha"
              name="consenha"
              value={consenha}
              onChange={(e) => setconSenha(e.target.value)}
              required
            />
            {!singupErr ? '' : <p className='label-err' >*Senhas devem ser iguais</p>}
         </div>
            <button className='btn-login' type="submit" id="redirecionar">
            Proximo 
            </button>
            <button onClick={handleBack} className='btn-back' type="button" >
            Voltar
            </button>
          
          </form>*/}  

          <Form route="/api/user/register/" method="register"/>
          
        </div>
          

        
      
    )
}

export default Register;
