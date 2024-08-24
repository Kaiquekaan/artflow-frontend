import React, {useState} from 'react'
import './Enter.css'
import { auth, provider } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faSquareFacebook } from '@fortawesome/free-brands-svg-icons';


const Enter = () => {
    const navigate = useNavigate();
  
      function handleSignin () {
          auth.signInWithPopup(provider).catch(alert)
            
        }
     
        const handleSignup = () => {
          navigate('/login');
        };


      return (
        <div className='body'>
          <div className='form'>
            <div className='title-div'>
            <img className='logo' src="https://github.com/Kaiquekaan/TaskBot/blob/master/src/imagens/MInimalista_Light_1.png?raw=true" alt="logo" />
            <h1 className='title'>TASKBOT</h1>
            <p>Bom vindo a sua nova ferramenta preferida</p>
            </div>
            <div className='btns-container'>
            <button className='btn' onClick={handleSignup} ><FontAwesomeIcon className='icon'  icon={faEnvelope} />Continuar com Email e senha</button>
            <button className='btn' onClick={handleSignin}><img className='icon' src="https://github.com/Kaiquekaan/TaskBot/blob/master/src/imagens/google.png?raw=true" alt="googleicon" />Continuar com Google</button>
            <button className='btn'><FontAwesomeIcon className='icon' icon={faSquareFacebook} style={{color: "#114297",}} />Continuar com Facebook</button>
            </div> 
            <p className='link-about'>Quem somos? <a href="">Veja aqui</a></p>
          </div>
        </div>
      );
    
}

export default Enter;