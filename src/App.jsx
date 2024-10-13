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
import Config from './screens/Config/Config'





function Logout() {
  localStorage.clear()
  return <Navigate to="/login"/>
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register></Register>
}


function App() {




 
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

   <BrowserRouter>
        <div>
 
          <Routes>
           {/* <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
            <Route path="/home/configuration" element={user ? <Config/> : <Navigate to="/" />} />
            <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
            <Route path="/signup/custom" element={user && user.emailVerified ? <Custom /> : <Navigate to="/verify" />} />
            <Route path="/signup" element={<Navigate to="/verify" />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/" element={user ? <Home /> : <Enter />} /> */} 
            <Route path="/profile/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path='/' element={<ProtectedRoute> <Home/></ProtectedRoute>} />
            <Route path="/configuration" element={<ProtectedRoute><Config/></ProtectedRoute>} />
            <Route path='/feed' element={<ProtectedRoute> <Feed/></ProtectedRoute>} />
            <Route path='/profile/' element={<ProtectedRoute> <Profile/></ProtectedRoute>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/signup' element={<Register/>} />
            <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
            <Route path='/ForgotPassword' element={<ForgotPassword/>} />
            <Route path='*' element={<NotFound/>}/>
          </Routes>
 
        </div>
   </BrowserRouter>

  );
}

export default App;
