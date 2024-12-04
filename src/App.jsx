import React, { createContext,useEffect, useState, useContext } from 'react';
import api from './api';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './screens/Login/Login';
import Home from './screens/Home/Home';
import Register from './screens/Sing_in/Register';
import Profile from './components/Perfil/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './screens/NotFound';
import ResetPassword from './screens/Login/ResetPassword';
import ForgotPassword from './screens/Login/ForgotPassword';
import Feed from './components/Feed/Feed';
import ProfilePage from './components/Perfil/ProfilePage';
import HashtagPage from './screens/GridPages/HashtagPage';
import Config from './screens/Config/Config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserProvider from './Context/UserContext';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import GridPage from './screens/GridPages/Gridpage';
import GridPostView from './screens/GridPages/GridPostView';

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





function App() {
  const token = localStorage.getItem(REFRESH_TOKEN); 


 
{/*
  if (!user) {
    return (
      <Router>
         <Routes>
          <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
          <Route path="/home/configuration" element={user ? <Config/> : <Navigate to="/" />} />
          <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
          <Route path="/signup/custom" element={user && user.emailVerified ? <Custom /> : <Navigate to="/verify" />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/" element={<Enter />} />
        </Routes>  
      </Router>
    );
  }
*/} 

return (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    
         <div>
  
           <Routes>         
             <Route path="/profile/:username" element={<ProtectedRoute> <UserProvider><ProfilePage /></UserProvider></ProtectedRoute>} />
             <Route path="/profile/:username/postagens" element={<ProtectedRoute><UserProvider><ProfilePage section="postagens" /></UserProvider></ProtectedRoute>} />
             <Route path="/profile/:username/galeria" element={<ProtectedRoute><UserProvider><ProfilePage section="galeria" /></UserProvider></ProtectedRoute>} />
             <Route path="/profile/:username/desafios" element={<ProtectedRoute><UserProvider><ProfilePage section="desafios" /></UserProvider></ProtectedRoute>} />
             <Route path="/profile/:username/curtidos" element={<ProtectedRoute><UserProvider><ProfilePage section="curtidos" /></UserProvider></ProtectedRoute>} />
             <Route path='/' element={<ProtectedRoute> <UserProvider><Home/></UserProvider> </ProtectedRoute>} />
             <Route path='/feed' element={<ProtectedRoute><UserProvider> <Home section="feed"/></UserProvider></ProtectedRoute>} />
             <Route path='/explore' element={<ProtectedRoute> <UserProvider><Home section="explore"/></UserProvider></ProtectedRoute>} />
             <Route path='/cflow' element={<ProtectedRoute> <UserProvider><GridPage endpoint='/api/posts/cflow/' /></UserProvider></ProtectedRoute>} />
             <Route path='/cflow/view' element={<ProtectedRoute> <UserProvider><GridPostView endpoint='/api/posts/cflow/' /></UserProvider></ProtectedRoute>} />
             <Route path="/t" element={<ProtectedRoute><UserProvider><Home section="trending"/></UserProvider></ProtectedRoute>} />
             <Route path="/post/:username/:postId/view" element={<ProtectedRoute><UserProvider><Home section="postview"/></UserProvider></ProtectedRoute>} />
             <Route path="/post/:postId/view" element={<ProtectedRoute><UserProvider><Home section="postview"/></UserProvider></ProtectedRoute>} />
             <Route path="/chats" element={<ProtectedRoute><UserProvider><Home section="chats"/></UserProvider></ProtectedRoute>} />
             <Route path="/configuration" element={<ProtectedRoute><UserProvider><Config/></UserProvider></ProtectedRoute>} />
             <Route path="/configuration/profile" element={<ProtectedRoute><UserProvider><Config section="profile"/></UserProvider></ProtectedRoute>} />
             <Route path="/configuration/notifications" element={<ProtectedRoute><UserProvider><Config section="notifications"/></UserProvider></ProtectedRoute>} />
             <Route path="/configuration/about" element={<ProtectedRoute><UserProvider><Config section="about"/></UserProvider></ProtectedRoute>} />
             <Route path="/configuration/security" element={<ProtectedRoute><UserProvider><Config section="security"/></UserProvider></ProtectedRoute>} />
             <Route path="/configuration/signout" element={<ProtectedRoute><UserProvider><Config section="signout"/></UserProvider></ProtectedRoute>} />
             <Route path='/profile/' element={<ProtectedRoute> <UserProvider><Profile/></UserProvider></ProtectedRoute>} />
 
           
            
             <Route path='/login' element={<Login/>} />
             <Route path='/signup' element={<Register/>} />
             <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
             <Route path='/ForgotPassword' element={<ForgotPassword/>} />
             <Route path='*' element={<NotFound/>}/>
           </Routes>
  
         </div>
        
    </BrowserRouter>
  </QueryClientProvider>
   );
  }
 

 
 
 
export default App;
