import React, { useEffect, useState, useRef } from 'react';
import { auth } from '../../firebase';
import './Verify.css';
import { useNavigate } from 'react-router-dom';

function Verify() {
  const navigate = useNavigate();
  const [emailVerified, setEmailVerified] = useState(false);
  const [values, setValues] = useState(['', '', '', '','']);
  const inputsRef = useRef([]);

  useEffect(() => {
    // Função para verificar o status de verificação do email
    const checkEmailVerification = async () => {
      const user = auth.currentUser;
  
      if (user) {
        await user.reload();  // Recarrega os dados do usuário para obter o status atualizado
        setEmailVerified(user.emailVerified);  // Atualiza o estado do email verificado
        
        if (user.emailVerified) {
          navigate('/signup/custom');  // Redireciona para a página de customização se o email estiver verificado
        }
      }else{
        console.log('eerr')
      }
    };

    // Verifica a autenticação do usuário quando o componente é montado
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkEmailVerification();
      }
    });

    // Verificação periódica do status de verificação do email
    const interval = setInterval(checkEmailVerification, 3000);

    return () => {
      clearInterval(interval);  // Limpa o intervalo quando o componente é desmontado
      unsubscribe();  // Cancela a inscrição na autenticação quando o componente é desmontado
    };
  }, [navigate]);

  const handleChange = (e, index) => {
    const newValues = [...values];
    const value = e.target.value.replace(/[^0-9]/g, ''); // Apenas números
    if (value) {
      newValues[index] = value;
      setValues(newValues);
      if (index < 4 && value.length === 1) {
        inputsRef.current[index + 1].focus();
      }
    } else {
      newValues[index] = '';
      setValues(newValues);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && values[index] === '') {
      if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };




  return (
    <div className='body'>
    <div className='container-verify'>
    <div className='form-verify'>
    <div className="img-logo">
          <img className='login-logo' src='https://github.com/Kaiquekaan/TaskBot/blob/master/src/imagens/MInimalista_Light_1.png?raw=true' alt="" />
      </div>
    <div className='div-title'>
      <h2 className='subtitle'>Verifique seu e-mail</h2>
      <p id='msg' className='msg'>Foi enviado um codigo para o seu e-mail. Por favor, verifique seu e-mail para ativar sua conta.
         Caso não tenha recebido aperte em <span onClick={() => auth.currentUser.sendEmailVerification()} >Reenviar codigo</span></p>
      
      </div>
      <div className='div-code'>
         {values.map((value, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={value}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputsRef.current[index] = el)}
            className="code"
          />
        ))}
      </div>

      <button className='btn-confirm'>Verificar</button>
      {emailVerified && <p>Email verificado. Redirecionando...</p>}
    </div>
    </div>
  </div>
  );
}

export default Verify;
