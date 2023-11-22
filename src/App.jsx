import React, { useEffect, useState} from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase';
import { TaskProvider } from './services/TaskContext';


import Login from './screens/Login/Login';
import Loading from './components/Loading';
import Home from './screens/Home/Home';


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

  if (!user) return <Login />;



  
  return <TaskProvider> <div>
    <Home/>
  </div>
  </TaskProvider>
}

export default App
