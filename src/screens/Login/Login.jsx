import React from 'react';
import './Login.css';
import { auth, provider } from '../../firebase';




function Login(){

    function handleSignin () {
        auth.signInWithPopup(provider).catch(alert)
          
      }
    


    return(
        <div className='login-container'>
        <form className='login-form'>
            <img className='login-logo' src="data:image/png;base64,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" alt="" />
        <label className='label-login' htmlFor="nome">login</label>
        <br /><br />
        <label className='label-login'  htmlFor="email">E-mail:</label>
        <input className='input-login' type="email" id="email" name="email" required /><br /><br />
        <label className='label-login'  htmlFor="senha">Senha:</label>
        <input className='input-login' type="password" id="senha" name="senha" required /><br /><br />
        <button className='btn-login' id="redirecionar">Fazer Login</button>
        <br /><br />
        
            </form>
            <button className="botao-com-imagem" onClick={handleSignin}>
               
          <span>Fazer login com google</span>
          <img src="https://cdn.iconscout.com/icon/free/png-256/free-google-1767841-1502421.png" alt="" />

        </button>
        
        </div>
    )
}

export default Login;
