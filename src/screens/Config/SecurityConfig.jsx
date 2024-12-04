import React, { useState, useEffect, useContext } from 'react';
import './Config.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import ProfileEdit from './ProfileEdit';
import api from '../../api';


const SecurityConfig = () => {
    const { data: userContextData } = useContext(UserContext);
    const [loading, setLoading] = useState(false);   
    const [email, setEmail] = useState(userContextData?.email || '' );
    const [editEmailShow, seteditEmailShow] = useState(false);  
    const [editRecoveryEmailShow, seteditRecoveryEmailShow] = useState(false);  
    const [recoveremail, setRecoverEmail] = useState(userContextData?.userdata.recovery_email || '' );
    const [password, setPassword] = useState('');
    const [newpassword, setNewpassword] = useState('');
    const [conewpassword, setNewcopassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [editPasswordShow, seteditPasswordShow] = useState(false);  
    const [enableTwoFactor, setEnableTwoFactor] = useState(userContextData?.userdata.two_factor_enabled || false);
    
    const handleShowEditPassword = () =>{
        if(editPasswordShow){
            seteditPasswordShow(false)
        }else{
            seteditPasswordShow(true)
        }
    }

   

  const handleCloseEditEmail = () =>{
    if(editEmailShow){
      seteditEmailShow(false)
    }
}

    const debounce = (func, delay) => {
      let timer;
      return (...args) => {
          clearTimeout(timer);
          timer = setTimeout(() => func(...args), delay);
      };
  };

  const handleChangePassword = async () => {
    if(newpassword && password && conewpassword){
      setLoading(true)
      setMessage('')
      setError('')
      if(newpassword == conewpassword){
        try {
          const response = await api.patch('/api/user/update-password/', {
            current_password: password,
            new_password: newpassword,
            confirm_password: conewpassword
          });
          alert(response.data.success); 
      } catch (error) {
        console.log('erro dando: ',error)
        if(error.response.status === 403){
          setMessage('*Senha incorreta')
          setError('senhaincorreta')
        }
          
      }finally{
        setLoading(false)
      }
      }else{
        setMessage('*Novas senha precisam ser iguais')
        setError('senhadiferentes')
        setLoading(false)
      }
      }
  
};


const handleChangeEmail = async () => {
  if(password && email){
    setLoading(true)
    setMessage('')
    setError('')
      try {
        const response = await api.patch('/api/user/update-email/', {
          current_password: password,
          email: email,
        });
        alert(response.data.success); 
        seteditEmailShow(false)
        setPassword('')
    } catch (error) {
      console.log('erro dando: ',error)
      if(error.response.status === 403){
        setMessage('*Senha incorreta')
        setError('senhaincorretaemail')
      }
        
    }finally{
      setLoading(false)
    }
    }

};


const handleChangeRecoveryEmail = async () => {
  if(recoveremail && recoveremail != userContextData.userdata.recovery_email ){
    setLoading(true)
    setMessage('')
    setError('')
      try {
        const response = await api.patch('/api/user/update-recovery-email/', {
          recovery_email: recoveremail,
        });
        alert(response.data.success); 
        seteditRecoveryEmailShow(false)
    } catch (error) {
      console.log('erro dando: ',error)
        
    }finally{
      setLoading(false)
    }
    }

};

const handleShowEditEmail = () =>{
  if(editEmailShow){
    handleChangeEmail()
  }else{
      seteditEmailShow(true)
  }
}

const handleShowRecoverEditEmail = () =>{
  if(editRecoveryEmailShow){
    handleChangeRecoveryEmail()
  }else{
      seteditRecoveryEmailShow(true)
  }
}

  const toggleTwoFactorAuth = async (enableTwoFactor) => {
    try {
        const response = await api.patch('/api/user/toggle-2fa/', {
            two_factor_enabled: enableTwoFactor
        });
        alert(response.data.success); 
    } catch (error) {
        console.error("Erro ao atualizar 2FA:", error);
        alert(error.response?.data?.error || "Erro ao atualizar 2FA");
    }
};

  const debouncedToggleTwoFactorAuth = debounce(toggleTwoFactorAuth, 500);

  const handleToggleTwoFactor = (e) => {
    const isEnabled = e.target.checked;
    setEnableTwoFactor(isEnabled);
    debouncedToggleTwoFactorAuth(isEnabled); // Chama com debounce
};
 

  return(
   <div className='security-section'>
        <div className={`profile-edit-save security `}>
        <p>Segurança</p>
      <div className='profile-edit-btn-container'>
      </div>
    </div>
    <div className='security-container'>
    <div className='profile-edit-input-container security'>
    <div className={`profile-edit-item ${editEmailShow && 'edit-email'}`}>
      {loading && editEmailShow && (
                <div className="loading-indicator edit-password">
                <div className="spinner"></div> 
              </div>
              )}
        <label htmlFor="" className='lbl-profile-input'>E-mail</label>
        <div className='input-config-container security'>
        <input type="email" placeholder='E-mail' 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                disabled={!editEmailShow}
                />     
         <button className='btn-white security-btn-input' onClick={() => handleShowEditEmail()}>{editEmailShow ? 'Salvar' : 'Alterar '}</button>      
        </div>
        <p>Insira o seu <span>e-mail principal</span>, que será utilizado para acessar a sua conta.</p>
        {editEmailShow && (
          <>
            <label htmlFor="" className='lbl-profile-input'>Senha</label>
            <div className={`input-config-container ${error == 'senhaincorreta' && 'error'}`}>
            <input type="password" placeholder='Senha' 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
                    />
            </div>
            <p>Insira sua <span>senha atual</span> para confirmar sua identidade antes de definir <span>um novo e-mail</span>.</p>
            <div className='btns-container-edit-password'> <button className='btn-white' onClick={() => handleCloseEditEmail()}>Cancelar</button></div>
          </>
        )}
        
        </div>
        </div>
    <div className='profile-edit-input-container security'>
    <div className='profile-edit-item'>
        <label htmlFor="" className='lbl-profile-input'>E-mail de recuperação</label>
        <div className='input-config-container security'>
        <input type="email" placeholder='E-mail' 
                value={recoveremail} 
                disabled={!editRecoveryEmailShow}
                onChange={(e) => setRecoverEmail(e.target.value)} />
          <button className='btn-white security-btn-input' onClick={() => handleShowRecoverEditEmail()}>{editRecoveryEmailShow ? 'Salvar' : 'Alterar '}</button>        
        </div>
        <p>Adicione um <span>e-mail de recuperação</span> para ajudar a recuperar o acesso caso você esqueça sua senha.</p>
        </div>
        </div>

        {!editPasswordShow ? (
            <div className='profile-edit-item btn-edit-password'>
            <button className='btn-white' onClick={() => handleShowEditPassword()}>Altera Senha</button>
            </div>
        ):(
            <div className='edit-password-container'>
              {loading  && (
                <div className="loading-indicator edit-password">
                <div className="spinner"></div> 
              </div>
              )}  
            <div className='profile-edit-input-container'>
        <div className='profile-edit-item'>
            <label htmlFor="" className='lbl-profile-input'>Senha</label>
            <div className={`input-config-container ${error == 'senhaincorreta' && 'error'}`}>
            <input type="password" placeholder='Senha' 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
                    />
                    
            </div>
            <p>Insira sua <span>senha atual</span> para confirmar sua identidade antes de definir uma nova senha.</p>
            </div>
            </div>
            <div className='profile-edit-input-container'>
        <div className='profile-edit-item'>
            <label htmlFor="" className='lbl-profile-input'>Nova Senha</label>
            <div className={`input-config-container ${error == 'senhadiferentes' && 'error'}`}>
            <input type="password" placeholder='Senha' 
                value={newpassword}
               onChange={(e) => setNewpassword(e.target.value)}
                    />
                    
            </div>
            <p>Escolha uma <span>nova senha</span> segura para proteger sua conta.</p>
            </div>
            </div>
            <div className='profile-edit-input-container'>
            <div className='profile-edit-item'>
            <label htmlFor="" className='lbl-profile-input'>Confirmar Nova Senha</label>
            <div className={`input-config-container ${error == 'senhadiferentes' && 'error'}`}>
            <input type="password" placeholder='Senha' 
              value={conewpassword}
              onChange={(e) => setNewcopassword(e.target.value)}
                    />
                    
            </div>
            <p>Confirme sua <span>nova senha</span> para garantir que não haja erros.</p>
            </div>
            </div>
            <div className='container-message'>{message}</div>
            <div className='btns-container-edit-password'> <button className='btn-white' onClick={() => handleShowEditPassword()}>Cancelar</button> <button className='btn-blue' onClick={() => handleChangePassword()}>Confirmar</button></div>
            </div>
        )}
        
        <div className='post-config security'>
                <p>Configurações adicionais</p>
                <div className='post-config-item'>
                <div className="toggle-container"> 
                <label class="switch" >
                <input 
                  type='checkbox' 
                  checked={enableTwoFactor} 
                  onChange={handleToggleTwoFactor}
                />
                <span class="slider"></span>
              </label><label>Verficação de duas etapas</label>
            </div>
                <p>Ative a <span>verificação em duas etapas</span> para adicionar uma camada extra de segurança à sua conta.</p>
              </div>
            </div> 
    </div>
   </div>
  )
}

export default SecurityConfig;