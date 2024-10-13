import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import GlobalStyle from './styles/global.js';
import UserProvider from './Context/UserContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Número de tentativas em caso de falha
    },
    mutations: {
      retry: 1, // Número de tentativas em caso de falha em uma mutação
    },
  },
});


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <UserProvider>
        <App />
    <GlobalStyle />
    </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
