import { useState } from "react";
import api from "../../api";


function ForgotPassword(){
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');  


  const handleSubmit = async (e) => {
    e.preventDefault();

    try{

        const res = api.post('/api/request-reset-password/', {email});
        setMessage('Se este email estiver registrado, você receberá um link para redefinir sua senha.')

    }catch(error){
        console.error('Erro ao solicitar redefinição de senha:', error);
        setMessage('Ocorreu um erro. Tente novamente.');
    }
  }

  return (
    <div className='body'>
        <div className='div-logo'>
        <img src="https://github.com/TeamArtFlow/GabrielHirata-FATEC-PJI2-2024-6-ArtFlow/blob/master/src/imagens/Af_logo.png?raw=true" alt="img-logo" className='img-logo' />
         <img src="https://github.com/TeamArtFlow/GabrielHirata-FATEC-PJI2-2024-6-ArtFlow/blob/feature-login/src/imagens/artflow_written.png?raw=true" alt="logo-name" className="h1" />
        </div>
        <div className="forgot-conteirner">
    
        <form className="forgot-form" onSubmit={handleSubmit}>
            <div className="input-container active">
            <label className="label-form" htmlFor="email">Digite seu email</label>
            <input
                type="email"
                id="email"
                className="input-form"
                value={email}
                placeholder="exemplo@gmail.com"
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </div>
            <button className="btn-form" type="submit">Enviar Link de Redefinição</button>
        </form>
        {message && <p className="p-form">{message}</p>}
        </div>
    </div>
);  



}

export default ForgotPassword;