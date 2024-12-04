import React, { useState, useEffect } from 'react';
import './Config.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ProfileEdit from './ProfileEdit';
import SecurityConfig from './SecurityConfig';
import About from './About';


const Config = ({ section }) => {
  const [activeSection, setActiveSection] = useState(section || 'profile');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleTabClick = (tabName) => {
    setactiveSection(tabName);
  };

  useEffect(() => {
    const currentSection = location.pathname.split('/').pop();
    setActiveSection(currentSection || 'profile');
  }, [location]);

  const handleSectionChange = (newSection) => {
    setActiveSection(newSection);
    navigate(`/configuration/${newSection}`);
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
      <div><button className={`btn-config ${activeSection === 'profile' ? 'active-btn' : ''}`}  onClick={() =>  handleSectionChange('profile')}>Perfil</button></div>
      <div><button className={`btn-config ${activeSection === 'notifications' ? 'active-btn' : ''}`}  onClick={() =>  handleSectionChange('notifications')}>Notificações</button></div>
      <div><button className={`btn-config ${activeSection === 'about' ? 'active-btn' : ''}`}  onClick={() =>  handleSectionChange('about')}>Sobre</button></div>
      <div><button className={`btn-config  ${activeSection === 'security' ? 'active-btn' : ''}`}  onClick={() =>  handleSectionChange('security')}>Segurança</button></div>
      <div><button  className={`btn-config ${activeSection === 'signout' ? 'active-btn' : ''}`}  onClick={() =>  handleSectionChange('signout')}>Sair</button></div>
       
     </div>
    </div>
    </div>
    <div className='config-container'>
    {activeSection == 'profile' && (
       <div className={`profile-config ` }>
        <ProfileEdit/>
        </div>
     )} 
     {activeSection == 'security' && (
        <SecurityConfig/>
     )} 
     {activeSection == 'about' && (
        <About/>
     )}
     {activeSection == 'signout' && (
     <div className={`signout ` }>
        <>
       <h2 className='title-config'>Deseja desconectar conta?</h2>
       <div>
      <button className='btn-base' onClick={() => handleTabClick('profile')}>Cancelar</button>
      <button className='btn-voltar' onClick={handleLogout}>Desconectar</button>
      </div>
        </>
     </div>
   )}
    </div>
    </div>
   </div>
  )
}

export default Config;