import React from 'react'
import api from '../../api';
import { useEffect, useState, useRef, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faCalendarDays, faEllipsis, faGear, faBarsProgress, faUser, faArrowRightFromBracket, faMagnifyingGlass, faLayerGroup, faFire, faFolderClosed, faBell,
  faSquarePlus
 } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';


function Navigation() {  
    const [searchQuery, setSearchQuery] = useState(''); // Estado para o campo de pesquisa
    const [searchResults, setSearchResults] = useState([]);
    const searchResultsRef = useRef(null);
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
    const {data} = useContext(UserContext);
    const navigate = useNavigate();
  
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
      navigate('/home/configuration');
    };
  
  
  
    const handleSearchInputChange = (e) => {
      setSearchQuery(e.target.value); // Atualiza o estado de pesquisa com o valor digitado
    };
  
    const handleSearchSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await api.get(`/api/search-users/?q=${searchQuery}`);
        console.log('Response data:', response.data); // Exibe os dados recebidos da API
        setSearchResults(response.data); // Atualiza o estado
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    const handleProfileClick = (username) => {
      navigate(`/profile/${username}`);
    };
  
  
    useEffect(() => {
      console.log('Search results updated:', searchResults);
    }, [searchResults]);


    return( 
      <>
    <header>
    <nav className="navbar navbar-expand-lg navbar-dark --primaria">
      <a className="navbar-brand"><img src='https://github.com/TeamArtFlow/GabrielHirata-FATEC-PJI2-2024-6-ArtFlow/blob/feature-login/src/imagens/artflow_written.png?raw=true' alt="Logo"  /> </a>
      <form className='navbar-search-div' onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder='Pesquisar'
              className='search-bar'
              value={searchQuery} // O valor da input vem do estado searchQuery
              onChange={handleSearchInputChange} // Atualiza o estado quando o valor muda
            />
            <button type="submit" className='search-icon'>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
            {searchResults.length > 0 && (
          <div className="search-results" ref={searchResultsRef}>
            <p className='search-title'>Resultados</p>
            <ul>
              {searchResults.map((itemsearch) => (
                <li className='d-flex align-items-center p-2 link-dark text-decoration-none' key={itemsearch.id}  onClick={() => handleProfileClick(itemsearch.username)}>
                  <img src={itemsearch.profile_picture_url} alt="Profile" width={50} height={50} />
                  <div className="user-info">
                  <p className='user-displayname mb-0'>{itemsearch.username} </p>
                  <p className='user-tag'>{itemsearch.user_tag}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
          </form>
       <div className='navbar-container'>
        <button className='btn-navbar'><FontAwesomeIcon icon={faBell} /></button>
        <a href="#" className="d-flex align-items-center justify-content-center p-2 link-dark text-decoration-none  avatar-img" id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false">
            <img src={!data ? '' : data.userdata.profile_picture_url} alt="mdo"  className="rounded " />
          </a>
        <div className="dropdown ">   
          <ul className="dropdown-menu dropdown-menu-end text-small shadow" aria-labelledby="dropdownUser3">
          <li>
       <a
       href="#"
       className="d-flex align-items-center p-2 link-dark text-decoration-none "
       id="dropdownUser3"
       data-bs-toggle="dropdown"
       aria-expanded="false"
       >
    <img
      src={!data ? '' : data.userdata.profile_picture_url} //user.usedata.profile_picture_url
      alt="mdo"
      width={40} // tamanho adequado para ser mais visível
      height={40}
      className="rounded-circle me-2 ms-2" // Adiciona margem à direita
    />
    <div className="user-info">
      <p className="user-displayname mb-0">{data?.username}</p>
      <p className="user-email mb-0">{data?.email}</p>
    </div>
   </a>
  </li>
  <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item" onClick={handleSettings}  > <FontAwesomeIcon icon={faGear} className='dropdown-icon' />Settings</button></li>
            <li><button className="dropdown-item"><FontAwesomeIcon icon={faUser}  className='dropdown-icon' />Profile</button></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item"  onClick={() => [handleLogout()]}> <FontAwesomeIcon icon={faArrowRightFromBracket}  className='dropdown-icon' />Sign out</button></li>
          </ul>
        </div>
      </div> 
    </nav>
  </header>

  
      
</>
    )
}

export default Navigation