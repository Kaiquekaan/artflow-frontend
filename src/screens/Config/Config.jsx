import React, { useState } from 'react';
import './Config.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import ProfileEdit from './ProfileEdit';


function Config(){
  const [activeTab, setActiveTab] = useState('profile');
  const [user] = useAuthState(auth);
  const refchat = db
  const navigate = useNavigate();


  const handleHome = () => {
    navigate('/');
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return(
   <div className='config-body'>
    <div className='config-content'>
    <div className='config-sidebar'>
    <div
      className={`Logo-container-config`}
      onClick={handleHome}
            >
                 <a className="sidebar-brand"><img src='https://raw.githubusercontent.com/TeamArtFlow/GabrielHirata-FATEC-PJI2-2024-6-ArtFlow/feature-login/src/imagens/Af_logo_mini.webp' alt="Logo"  /> </a>
                 <a className="sidebar-brand"><img src='https://github.com/TeamArtFlow/GabrielHirata-FATEC-PJI2-2024-6-ArtFlow/blob/feature-login/src/imagens/artflow_written.png?raw=true' alt="Logo"  /> </a>
          </div>
    <div className='item-list'>
     <div className='list'>
      <div><h2>Configurações</h2></div>
      <div><button className={`btn-config ${activeTab === 'profile' ? 'active-btn' : ''}`}  onClick={() => handleTabClick('profile')}>Perfil</button></div>
      <div><button className={`btn-config ${activeTab === 'notifications' ? 'active-btn' : ''}`}  onClick={() => handleTabClick('notifications')}>Notificações</button></div>
      <div><button className={`btn-config ${activeTab === 'about' ? 'active-btn' : ''}`}  onClick={() => handleTabClick('about')}>Sobre</button></div>
      <div><button className={`btn-config  ${activeTab === 'security' ? 'active-btn' : ''}`}  onClick={() => handleTabClick('security')}>Segurança</button></div>
      <div><button  className={`btn-config ${activeTab === 'singout' ? 'active-btn' : ''}`}  onClick={() => handleTabClick('singout')}>Sair</button></div>
       
     </div>
    </div>
    </div>
    <div className='config-container'>
    <div className={` profile-config ${activeTab === 'profile' ? 'active' : ''}` }>
      {activeTab == 'profile' && (
        <ProfileEdit/>
      )} 
    </div>
     <div className={` singout ${activeTab === 'singout' ? 'active' : ''}` }>
      <h2 className='title-config'>Deseja desconectar conta?</h2>
      <button className='btn-base' onClick={() => handleTabClick('profile')}>Cancelar</button>
      <button className='btn-voltar' onClick={() => [auth.signOut()]}>Desconectar</button>
  </div>
    </div>
    </div>
   </div>
  )
}

export default Config;