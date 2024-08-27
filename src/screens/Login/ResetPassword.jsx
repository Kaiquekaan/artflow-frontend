import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

function ResetPassword() {
    const { uidb64, token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [newCosenha, setNewCosenha] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(newCosenha === newPassword){
            try {
                const res = await api.post(`/api/reset-password-confirm/${uidb64}/${token}/`, { new_password: newPassword });
                setMessage('Senha redefinida com sucesso!');
                navigate('/login');
            } catch (error) {
                setMessage('Erro ao redefinir a senha.');
                console.error(error);
            }
        }else{
            setMessage('As senhas não coincidem, tente novamente')
        }
    
    };
    
    return (
        <div className='body'>
        <div className='div-logo'>
             <img src="https://github.com/TeamArtFlow/GabrielHirata-FATEC-PJI2-2024-6-ArtFlow/blob/master/src/imagens/Af_logo.png?raw=true" alt="img-logo" className='img-logo' />
             <img src="https://github.com/TeamArtFlow/GabrielHirata-FATEC-PJI2-2024-6-ArtFlow/blob/feature-login/src/imagens/artflow_written.png?raw=true" alt="logo-name" className="h1" />
        </div>
        <div className="reset-conteirner">
            <h2>Redefinir Senha</h2>
            <form className="reset-form" onSubmit={handleSubmit}>
            <div className="input-container active">
                <label className="label-form" htmlFor="newPassword">Nova Senha</label>
                <input
                    type="password"
                    id="newPassword"
                    className="input-form"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <label className="label-form" htmlFor="newCosenha">Confirmar Nova Senha</label>
                <input
                    type="password"
                    id="newCosenha"
                    className="input-form"
                    value={newCosenha}
                    onChange={(e) => setNewCosenha(e.target.value)}
                    required
                />
               </div> 
                <button className="btn-form" type="submit">Redefinir Senha</button>
            </form>
            {message && <p className="p-form">{message}</p>}
            </div>
        </div>
    );
}

export default ResetPassword;