import './Home.css'
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack} from '@fortawesome/free-solid-svg-icons';
import { faComment} from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays} from '@fortawesome/free-solid-svg-icons';
import { faPhone} from '@fortawesome/free-solid-svg-icons';
import Task from '../../components/Task';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../firebase';
import { useCollection} from 'react-firebase-hooks/firestore';
import Chat from '../../components/Chat/Chat';
import MyCalendar from '../../components/Calender';



function Home() {

  const [activeTab, setActiveTab] = useState('taskgui');
  const [porcentagem, setPorcentagem] = useState(0);
  const [filtro, setFiltro] = useState('all'); // 'all' para mostrar todas as tarefas, 'day' para mostrar apenas as do dia

  const atualizarPorcentagem = (novaPorcentagem) => {
    setPorcentagem(novaPorcentagem);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };
  

    const [user] = useAuthState(auth);
    const refchat = db
    .collection('chats')
    .where('users', 'array-contains', user.email);
    const [chatSnapshot] = useCollection(refchat);


  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
  <header>
    <nav className="navbar navbar-expand-lg navbar-dark --primaria">
      <a className="navbar-brand" href="#"><img src='data:image/png;base64,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' alt="Logo" width={50} height={50} /> </a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" href="#">Sobre</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
  <div className="content-area">
  <div className="container-fluid">
    <div className="row">
      {/* Barra Lateral */}
      <nav id="sidebar" className="col-3 d-flex flex-column flex-shrink-0 bg-light  sidebar">
      <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
        <li className="nav-item">
          <button
            className={`btn btn-light ${activeTab === 'taskgui' ? 'active' : ''}`}
            onClick={() => handleTabClick('taskgui')}
          >
            <FontAwesomeIcon icon={faThumbtack} style={{ color: "#d8a313" }} />
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-light ${activeTab === 'comment' ? 'active' : ''}`}
            onClick={() => handleTabClick('comment')}
          >
            <FontAwesomeIcon icon={faComment} style={{ color: "#d8a313" }} />
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-light ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => handleTabClick('calendar')}
          >
            <FontAwesomeIcon icon={faCalendarDays} style={{ color: "#d8a313" }} />
          </button>
        </li>
      </ul>
      {/* Restante do conteúdo da barra lateral */}
      <div className="dropdown border-top">
          <a href="#" className="d-flex align-items-center justify-content-center p-3 link-dark text-decoration-none dropdown-toggle" id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false">
            <img src={user?.photoURL} alt="mdo" width={24} height={24} className="rounded-circle" />
          </a>
          <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser3">
            <li><a className="dropdown-item" href="#">Settings</a></li>
            <li><a className="dropdown-item" href="#">Profile</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#" onClick={() => [auth.signOut()]}>Sign out</a></li>
          </ul>
        </div>
    </nav>
      {/* Conteúdo Principal */}
      <main className="main">
        <div className="main-container">
        <div className="col-3 main"> 
        <div className={` taskgui  ${activeTab === 'taskgui' ? 'active' : ''}`  }>
          <div className="taskheader">
            <h4>Tarefas</h4>
            <h4>Concluído: {porcentagem}%</h4> 
            </div>
            <div className="filtrar-task">
            <select value={filtro} onChange={handleFiltroChange}>
            <option value="all">Mostrar todas as tarefas</option>
           <option value="day">Mostrar tarefas do dia</option>
           <option value="delayed">Mostrar tarefas atrasadas</option>
           <option value="week">Mostrar tarefas da semana</option>
           <option value="month">Mostrar tarefas do mês</option>
          </select>
          </div>
         <Task atualizarPorcentagem={atualizarPorcentagem} filtro={filtro} setFiltro={setFiltro} />
                           
            
          </div>
      
        <div className={`comment ${activeTab === 'comment' ? 'active' : ''}`}>
   
        <Chat/>
        </div>
        {/* Adicione conteúdo para outras guias aqui */}
          <div className={` calendar ${activeTab === 'calendar' ? 'active' : ''}`}>
          <MyCalendar/>
          </div>
          </div>
        </div>
      </main>
      </div>

      </div>
  </div>

    </div>
  )
}

export default Home
