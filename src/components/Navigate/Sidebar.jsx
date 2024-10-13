import React from 'react'
import { useEffect, useState, useContext, useRef } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCalendarDays, faBarsStaggered, faGear, faBarsProgress, faUser, faArrowRightFromBracket, faMagnifyingGlass, faLayerGroup, faFire, faFolderClosed, faBell,
  faSquarePlus
 } from '@fortawesome/free-solid-svg-icons';
import NewPost from '../NewPost';
import { UserContext } from '../../Context/UserContext';
import { ACCESS_TOKEN } from '../../constants';
import Notifications from './Notifications';
import './Sidebar.css'


function Sidebar()  {
    const [activeTab, setActiveTab] = useState('feed');
    const [Dropdown, setDropdown] = useState(false);
    const [showNewPost, setShowNewPost] = useState(false)
    const navigate = useNavigate();
    const {data, setToken } = useContext(UserContext);
    const [searchQuery, setSearchQuery] = useState(''); // Estado para o campo de pesquisa
    const [searchResults, setSearchResults] = useState([]);
    const searchResultsRef = useRef(null);
    const [recentSearches, setRecentSearches] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false); 
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const [hideNavItems, setHideNavItems] = useState(false);
   


    console.log('search do sidebar: ', searchResults)

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        navigate(`/${tabName}`);
      };
    
      useEffect(() => {
        const storedRecentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        setRecentSearches(storedRecentSearches);
      }, []);
    
      const handleNewPostClick = () => {
        setShowNewPost(true); // Exibe o NewPost quando o botão é clicado
      };
    
      const handleCancelNewPost = () => {
        setShowNewPost(false); // Esconde o NewPost quando o cancelar é clicado
      };


      const handleSettings = () => {
        navigate('/configuration');
      };


      useEffect(() => {
        function handleClickOutside(event) {
          if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
            setShowSearchResults(false); // Oculta os resultados ao clicar fora
            setHideNavItems(false); 
            
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

      const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value); // Atualiza o estado de pesquisa com o valor digitado

         // Se o campo de busca estiver vazio, mostre pesquisas recentes
        if (e.target.value === '') {
          const storedRecentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
          setRecentSearches(storedRecentSearches);
          setSearchResults([]);
    }
      };
    
      const handleSearchSubmit = async (e) => {
        if (searchQuery.trim() === '') return;
        
        e.preventDefault();
        try {
          const response = await api.get(`/api/search-users/?q=${searchQuery}`);
          console.log('Response data:', response.data); // Exibe os dados recebidos da API
          setSearchResults(response.data); // Atualiza o estado

          const updatedSearches = [searchQuery, ...recentSearches.filter((search) => search !== searchQuery)].slice(0, 5);
           setRecentSearches(updatedSearches);
           localStorage.setItem('recentSearches', JSON.stringify(updatedSearches)); // Salva no localStorage
        } catch (error) {
          console.error('Erro ao buscar usuários:', error);
        }
      };




  
      const handleProfileClick = (username) => {
        navigate(`/profile/${username}`);
      };

      const handleSearchFocus = () => {
        setShowSearchResults(true); // Mostra os resultados ao clicar no campo de pesquisa
        setHideNavItems(true);
    };


    const handleDropdown = () => {
      setDropdown(!Dropdown);
    }
    

      useEffect(() => {
        console.log('Search results updated:', searchResults);
      }, [searchResults]);
  
      const handleLogout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        setToken('');
        console.log('Fazendo logout')
        navigate('/login');
      };



      



    return(
    <>
    <div className='sidebar-space'>
      <nav id="sidebar" className="col-3 d-flex flex-column flex-shrink-0 sidebar ">
     <div className='sidebar-usercontainer'>
      <div
              className="d-flex align-items-center p-2 link-dark text-decoration-none "
              id="dropdownUser3"
               data-bs-toggle="dropdown"
              aria-expanded="false"
              >
             <img
             src={!data ? '' : data.userdata.profile_picture_url} //user.usedata.profile_picture_url
            alt="mdo"
            width={45} // tamanho adequado para ser mais visível
            height={45}
            className="rounded me-2 ms-2" // Adiciona margem à direita
            />
        <div className="user-info">
            <p className="user-displayname mb-0">{data?.userdata.displayname ? data?.userdata.displayname : data?.username }</p>
            <p className="user-email mb-0">{data?.userdata.user_tag}</p>
        </div>
      </div>
      <div className='sidebar-notifications'>
      <Notifications />
      </div>
    </div>
    
      <div className='sidebar-search'>
      <form className='sidebar-search-div' onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder='Pesquisar'
              className='search-bar'
              value={searchQuery} // O valor da input vem do estado searchQuery
              onChange={handleSearchInputChange} // Atualiza o estado quando o valor muda
              onFocus={handleSearchFocus}
             
            />
            <button type="submit" className='search-icon'>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
           
         
       
          </form>
      </div>
      {showSearchResults && (
      <div className="search-results-sidebar" ref={searchResultsRef}>
          {searchQuery === '' && recentSearches.length > 0 && (
              <div className="li-search">
                <p className="li-search-title">Recentes</p>
                <ul>
                  {recentSearches.map((recent, index) => (
                    <li key={index} className="d-flex align-items-center p-2 text-decoration-none">
                      <div className="user-info">
                        <p className="user-displayname mb-0">{recent}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

        {searchQuery === '' && recentSearches.length === 0 && (
         <div className="li-search no-recents">
          <div className='li-search-header'>
          <p className="li-search-title">Recentes</p>
          </div>
         <div className="no-recent-searches">
          
          <p>Nenhuma pesquisa recente.</p>
           </div>
         </div>
      )}

          {searchQuery !== '' && searchResults.length > 0 && (
            <div className='li-search'>
              <p className='li-search-title'>Resultados da Pesquisa</p>
              <ul>
                {searchResults.map((itemsearch) => (
                  <li className='d-flex align-items-center p-2  text-decoration-none' key={itemsearch.id} onClick={() => handleProfileClick(itemsearch.username)}>
                    <img src={itemsearch.profile_picture_url} alt="Profile" width={44} height={44} />
                    <div className="user-info">
                      <p className='user-displayname mb-0'>{itemsearch.username}</p>
                      <p className='user-tag'>{itemsearch.user_tag}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
         )}

   {!hideNavItems && (
    <>
      <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
     
        <li className="nav-item">
        <div className={`nav-item-div ${activeTab === '' ? 'actived' : ''}`} onClick={() => handleTabClick('')}>
            
            <div className='nav-icon'> <FontAwesomeIcon icon={faLayerGroup}  style={{ color: "#FFFFFF" }}/> </div>
      
          <p>Feed</p>
          </div>
        </li>
        <li className="nav-item">
          <div className={`nav-item-div ${activeTab === 'explore' ? 'actived' : ''}`} onClick={() => handleTabClick('explore')}> 
            <div className='nav-icon'> <FontAwesomeIcon icon={faFire}  style={{ color: "#FFFFFF" }} /></div>
          <p>Explorer</p>
          </div>
          
        </li>
        <li className="nav-item">
        <div className={`nav-item-div ${activeTab === 'comment' ? 'actived' : ''}`} onClick={() => handleTabClick('comment')}>
          <div className='nav-icon'> <FontAwesomeIcon icon={faComment} style={{ color: "#FFFFFF" }} /></div>
           
          <p>Chats</p>
          </div>
        </li>
        <li className="nav-item">
        <div className={`nav-item-div ${activeTab === 'folder' ? 'active' : ''}`} onClick={() => handleTabClick('folder')}>
        <div className='nav-icon'>  <FontAwesomeIcon icon={faFolderClosed}  style={{ color: "#FFFFFF" }} /></div>
           
        
          <p>Galeria</p>
          </div>
        </li>
        <li className="nav-item">
        <div className={`nav-item-div`} onClick={handleNewPostClick}>
        <div className='nav-icon'> <FontAwesomeIcon icon={faSquarePlus}   style={{ color: "#FFFFFF" }} /></div>
            
           <p>Novo Post</p>
          </div>
        </li>
      </ul>
      </>
   )}
      {/* Restante do conteúdo da barra lateral */}
      <div className='sidebar-footer'>
      <div className='nav-item'>
      <div className={`nav-item-div menu-container`} id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false"  onClick={handleDropdown}>
      {Dropdown && (
  <div className='dropdown'>
    <ul className="dropdown-menu-sidebar text-small shadow " aria-labelledby="dropdownUser3">
      <div className='dropdown-content'>
        <li><hr className="dropdown-divider" /></li>
        <li>
          <button className="dropdown-item" onClick={handleSettings}>
            <FontAwesomeIcon icon={faGear} className='dropdown-icon' />Settings
          </button>
        </li>
        <li>
          <button className="dropdown-item" onClick={() => handleProfileClick(data?.username)}>
            <FontAwesomeIcon icon={faUser} className='dropdown-icon'  />Profile
          </button>
        </li>
      </div>
      <div className='dropdown-footer'>
        <li>
          <button className="dropdown-item" onClick={handleLogout}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} className='dropdown-icon' />Sign out
          </button>
        </li>
      </div>
    </ul>
  </div>
)}
        <div className='nav-icon'> <FontAwesomeIcon icon={faBarsStaggered} /></div>
           <p>Menu</p>
          </div>
      
       
        </div>
   
      </div>
     </nav>
     {showNewPost && (
        <NewPost user={data} onCancel={handleCancelNewPost} route="/api/create-post/" /> // Passa o onCancel para o NewPost
      )}

</div>
    </>
    )
}

export default Sidebar