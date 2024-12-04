import './Home.css'
import { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCalendarDays, faEllipsis, faGear, faBarsProgress, faUser, faArrowRightFromBracket, faMagnifyingGlass, faLayerGroup, faFire, faFolderClosed, faBell,
  faSquarePlus
 } from '@fortawesome/free-solid-svg-icons';
import Task from '../../components/Task';
import { auth, db } from '../../firebase';
import Banner from '../../components/Banner';
import Feed from '../../components/Feed/Feed';
import NewPost from '../../components/NewPost';
import api from '../../api';
import { UserContext } from '../../Context/UserContext';
import Sidebar from '../../components/Navigate/Sidebar';
import SideContent from '../../components/Navigate/SideContent';
import Explore from '../../components/explore/Explore';
import HashtagPage from '../GridPages/HashtagPage';
import GridPage from '../GridPages/Gridpage';
import PostViewPage from '../../components/Feed/PostViewPage';
import Chats from '../../components/Chat/Chat';
import { is } from 'date-fns/locale';





const Home = ({ section, isQuery = false }) => {
  const [activeSection, setActiveSection] = useState(section || 'feed');
  const navigate = useNavigate();
  const location = useLocation();
  const [showNewPost, setShowNewPost] = useState(false)
  const [searchQuery, setSearchQuery] = useState(''); // Estado para o campo de pesquisa
  const [searchResults, setSearchResults] = useState([]);
  const searchResultsRef = useRef(null);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const {data} = useContext(UserContext);

  console.log('user recebido no Home é: ', data)


 

  useEffect(() => {
    const currentSection = location.pathname.split('/').pop();
    console.log('current:',currentSection)
    setActiveSection(currentSection || 'feed');
  }, [location]);


  

  // Se os dados ainda estão sendo carregados, exiba uma mensagem de carregamento

  // Se os dados não estão disponíveis, exiba uma mensagem de erro
 

 // useEffect(() =>  {
    // api.get("/api/user/data/")
    //.then((response) =>  {
    //  const userData = response.data;
    //  setUser(userData)
    //})
    //.catch((error) => {
    //  console.log('erro ao busca usuario', error);
    //})

  //  const fetchData = async () => {
   //    try{
   //      const res = await api.get('/api/user/data/');
   //     setUser(res.data)
  //    }catch(erro){
  //      console.log(erro)
 //      }
///   }
//
///    fetchData();
 // }, [])



// Se não houver usuário após o carregamento, exibe a mensagem



  useEffect(() => {
    function handleClickOutside(event) {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setSearchResults([]); // Oculta os resultados ao clicar fora
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchResults]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // O número de milissegundos que você quer esperar

    // Limpa o timeout se o valor mudar antes do intervalo acabar
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Função que busca os resultados da pesquisa
  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedQuery.trim() !== '') {
        try {
          const response = await api.get(`/api/search-users/?q=${debouncedQuery}`);
          setSearchResults(response.data);
        } catch (error) {
          console.error('Erro ao buscar usuários:', error);
        }
      } else {
        setSearchResults([]); // Limpa os resultados se a busca estiver vazia
      }
    };

    handleSearch();
  }, [debouncedQuery]);


  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    navigate('/login');
  };

  const handleSettings = () => {
    navigate('/profile/');
  };



  const handleTabClick = (tabName) => {
    setactiveSection(tabName);
    if (tabName === 'comment') {
      setIsChatVisible(true);
    } else {
      setIsChatVisible(false);
    }
  };

  const handleSectionChange = (newSection) => {
    setActiveSection(newSection);
    navigate(`/${newSection}`);
  };



  const handleCancelNewPost = () => {
    setShowNewPost(false); // Esconde o NewPost quando o cancelar é clicado
  };





  useEffect(() => {
    console.log('Search results updated:', searchResults);
  }, [searchResults]);




  useEffect(() => {
    function handleClickOutside(event) {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setSearchResults([]); // Oculta os resultados ao clicar fora
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchResults]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // O número de milissegundos que você quer esperar

    // Limpa o timeout se o valor mudar antes do intervalo acabar
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Função que busca os resultados da pesquisa
  useEffect(() => {
    const handleSearch = async () => {
      if (debouncedQuery.trim() !== '') {
        try {
          const response = await api.get(`/api/search-users/?q=${debouncedQuery}`);
          setSearchResults(response.data);
        } catch (error) {
          console.error('Erro ao buscar usuários:', error);
        }
      } else {
        setSearchResults([]); // Limpa os resultados se a busca estiver vazia
      }
    };

    handleSearch();
  }, [debouncedQuery]);





  const handleProfileClick = (username) => {
    navigate(`/profile/${username}`);
  };


  useEffect(() => {
    console.log('Search results updated:', searchResults);
  }, [searchResults]);


     
    //const [user] = useAuthState(auth);
    //const refchat = db
    //.collection('chats')
    //.where('users', 'array-contains', user.email);
    //const [chatSnapshot] = useCollection(refchat);


 


  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>



  
  <div className="content-area">
 


  <div className="container-fluid">
    <div className="row">
      

     {/* Barra Lateral alternativa para celulares */}
    <nav className='sidebar-alt'>
    <div className='sidebar-alt-container'>
    <ul className="nav nav-pills nav-flush  text-center">
        <li className="nav-item">
          <button
            className={`btn btn-light ${activeSection === 'feed' ? 'active' : ''}`}
            onClick={() => handleSectionChange('taskgui')}
          >
            <FontAwesomeIcon icon={faBarsProgress} style={{ color: "#d8a313" }} />
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-light ${activeSection === 'comment' ? 'active' : ''}`}
            onClick={() => handleSectionChange('comment')}
          >
            <FontAwesomeIcon icon={faComment} style={{ color: "#d8a313" }} />
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-light ${activeSection === 'calendar' ? 'active' : ''}`}
            onClick={() => handleSectionChange('calendar')}
          >
            <FontAwesomeIcon icon={faCalendarDays} style={{ color: "#d8a313" }} />
          </button>
        </li>
      </ul>
      {/* Restante do conteúdo da barra lateral */}
      <div className="dropdown border-top">
          <a href="#" className="d-flex align-items-center justify-content-center p-3 link-dark text-decoration-none dropdown-toggle" id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false">
            <img src={data?.photoURL} alt="mdo" width={24} height={24} className="rounded-circle" />
          </a>
          <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser3">
            <li><a className="dropdown-item" href="#">Settings</a></li>
            <li><a className="dropdown-item" href="#">Profile</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#" onClick={() => [auth.signOut()]}>Sign out</a></li>
          </ul>
        </div>
    </div>
    </nav>



      {/* Conteúdo Principal */}
      <main className="main">
        <div className="main-container">
        <div className={`col-3 main-div ${section == 'cflow' || section == 'chats' ? 'collum' : ''}`}> 
          {/* Barra Lateral */}
          
          <Sidebar sectionChange={handleSectionChange} activeSection={activeSection} />
         
         <div className='main-content'>
            {activeSection == 'feed' && (
              <Feed/>
            )}
             {activeSection == 'explore' && (
              <Explore isQuery={isQuery}/>
            )}
            {activeSection == 't' && (
              <HashtagPage/>
            )}
            {activeSection == 'view' && (
              <PostViewPage/>
            )}
             {activeSection == 'chats' && (
              <Chats/>
            )}
             {activeSection == 'cflow' && (
              <GridPage endpoint={`/api/posts/cflow/`}/>
            )}
            
            <div className={`sidecontent-space ${section == 'cflow' || section == 'chats' ? 'collum' : ''}`}>
              {section == 'cflow' || section == 'chats' ? (
                <></>
              ):(
              <SideContent page={'feed'}/>
              )}
          </div>
          {showNewPost && (
          <NewPost user={data} onCancel={handleCancelNewPost} route="/api/create-post/" /> // Passa o onCancel para o NewPost
        )}
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
