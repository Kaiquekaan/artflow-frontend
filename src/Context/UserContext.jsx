// src/context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api'; // Sua configuração de API
import { ACCESS_TOKEN } from '../constants'; // As constantes de token

export const UserContext = createContext();

function UserProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(ACCESS_TOKEN) || null);
  const [isOnline, setIsOnline] = useState(false);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const queryClient = useQueryClient();

  const fetchUser = async () => {
    try {
      const res = await api.get('/api/user/data/');
      return res.data;
    } catch (error) {
      console.error('Erro na requisição fetchUser:', error);
      throw error;
    }
  };

  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ['userData'],
    queryFn: fetchUser,
    enabled: !!token, // Só faz a chamada se houver um token
    onError: (error) => console.error('Erro ao buscar dados do usuário:', error),
    retry: false,
    staleTime: 60000, // 1 minuto
    cacheTime: 300000, // Manter no cache por 5 minutos
    refetchOnWindowFocus:false,
  });

  useEffect(() => {
    const storageToken = localStorage.getItem(ACCESS_TOKEN);
    if (storageToken) {
      setToken(storageToken);
      // Você pode opcionalmente refazer a busca aqui se necessário
      queryClient.refetchQueries(['userData']);
    }
  }, [queryClient]);


  useEffect(() => {
    if (token) {
      const socket = new WebSocket(`ws://localhost:8000/ws/online_friends/?token=${token}`);
  
      socket.onopen = () => {
        console.log("WebSocket connected");
      };
  
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setOnlineFriends([...data.online_friends]);
        console.log("Lista de amigos online: ", data.online_friends);
      };
  
      socket.onclose = () => {
        console.log("WebSocket disconnected");
      };
  
      return () => {
        socket.close();
      };
    }
  }, [token]);


  return (
    <UserContext.Provider value={{ data, setToken, isLoading, error, isOnline, onlineFriends}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
