import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBR6oncbN5SZ47Jgmz-yPunq4-Q6h4Bahg",
    authDomain: "taskbot-402501.firebaseapp.com",
    projectId: "taskbot-402501",
    storageBucket: "taskbot-402501.appspot.com",
    messagingSenderId: "627788883014",
    appId: "1:627788883014:web:0249f641ea27a5d80ed647",
    measurementId: "G-QC0XKY6L8K"
  };


const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export const db = app.firestore();
export const provider = new firebase.auth.GoogleAuthProvider();
export const persistence = firebase.auth.Auth.Persistence;
export const storage = firebase.storage();