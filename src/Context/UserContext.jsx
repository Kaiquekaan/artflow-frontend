// src/context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api'; // Sua configuração de API
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'; // As constantes de token
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

function UserProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(ACCESS_TOKEN));
  const [isOnline, setIsOnline] = useState(false);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);


  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken || hasAttemptedRefresh) {
      localStorage.clear();
      return false;
    }

    try {
      setIsRefreshing(true);
      const res = await api.post("/api/user/token/refresh/", { refresh: refreshToken });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh); // Atualiza o Refresh Token
        setToken(res.data.access); // Atualiza o estado do token
      } else {
        localStorage.clear();
        return false;
      }
    } catch (error) {
      console.error('Erro ao renovar o token:', error);
      localStorage.clear();
      return false;
    } finally {
      setIsRefreshing(false);
    }
  };
  

  const fetchUser = async () => {
    try {
        const res = await api.get('/api/user/data/');
        return res.data;
    } catch (error) {
      if (error.response && error.response.status === 401 && !isRefreshing) {
        const refreshed = await refreshToken(); // Aguarda a renovação do token

        if (refreshed) {
          queryClient.refetchQueries(['userData']); // Refaz a busca após a renovação
        } else {
          navigate('/login'); // Redireciona para login se a renovação falhar
        }
      }else{
        throw error;
      }
    }
  };

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ['userData'],
    queryFn: fetchUser,
    enabled: !!token && !isRefreshing, // Só faz a chamada se houver um token
    onError: async (error) => {
      console.error('Erro ao buscar dados do usuário:', error);
      
    },
    retry: false,
    staleTime: 60000,
    cacheTime: 300000, 
    refetchOnWindowFocus:false,
  });



  useEffect(() => {
    const storageToken = localStorage.getItem(ACCESS_TOKEN);
    if (storageToken) {
      setToken(storageToken);
    }
  }, [queryClient]);


  useEffect(() => {
    if (token) {
      let socket = new WebSocket(`wss://artflow-production.up.railway.app/ws/online_friends/?token=${token}`);
  
      socket.onopen = () => {
        console.log("WebSocket connected");

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setOnlineFriends([...data.online_friends]);
          console.log("Lista de amigos online: ", data.online_friends);
        };
      };
  
    
      socket.onclose = () => {
        console.log("WebSocket disconnected");
        setTimeout(() => {
            if (token) {
                // Reconecta o WebSocket com o token atualizado
                socket = new WebSocket(`wss://artflow-production.up.railway.app/ws/online_friends/?token=${token}`);
            }
        }, 3000);  // Tenta reconectar após 3 segundos
    };
  
      return () => {
        socket.close();
      };
    }
  }, [token]);


  return (
    <UserContext.Provider value={{ data, setToken, isLoading, error, isOnline, onlineFriends, queryClient}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
