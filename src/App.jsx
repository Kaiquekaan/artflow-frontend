import React, { useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase';
import { TaskProvider } from './services/TaskContext';
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './screens/Login/Login';
import Loading from './components/Loading';
import Home from './screens/Home/Home';
import Register from './screens/Sing_in/Register';
import Enter from './screens/Sing_in/Enter';
import Custom from './screens/Sing_in/Custom';
import Verify from './screens/Sing_in/Verify';
import Config from './screens/Home/Config';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './screens/NotFound';
import ResetPassword from './screens/Login/ResetPassword';
import ForgotPassword from './screens/Login/ForgotPassword';

function Logout() {
  localStorage.clear()
  return <Navigate to="/login"/>
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register></Register>
}

function App() {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      db.collection('users').doc(user.uid).set({
        email: user.email,
        photoURL: user.photoURL,
      });
    }
  }, [user]);

  if (loading) return <Loading />;
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
      <TaskProvider>
        <div>
          <Routes>
           {/* <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
            <Route path="/home/configuration" element={user ? <Config/> : <Navigate to="/" />} />
            <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
            <Route path="/signup/custom" element={user && user.emailVerified ? <Custom /> : <Navigate to="/verify" />} />
            <Route path="/signup" element={<Navigate to="/verify" />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/" element={user ? <Home /> : <Enter />} /> */} 

            <Route path='/' element={<ProtectedRoute> <Home/></ProtectedRoute>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/signup' element={<Register/>} />
            <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
            <Route path='/ForgotPassword' element={<ForgotPassword/>} />
            <Route path='*' element={<NotFound/>}/>
          </Routes>
        </div>
      </TaskProvider>
  </BrowserRouter>
  );
}

export default App;
