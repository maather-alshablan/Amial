
import * as firebase from "firebase/app";
import  "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";


const firebaseConfig = {
    apiKey: 'AIzaSyB7MHk6utNVEYXqIKLBjgiDOQbdmgilu84',
    authDomain: 'amial-8b79c.firebaseapp.com',
    databaseURL: 'https://amial-8b79c.firebaseio.com',
    projectId: 'amial-8b79c',
    storageBucket: 'amial-8b79c.appspot.com',
    messagingSenderId: '1055987009677',
    appId: '1:1055987009677:ios:c2699ffd7e974b3e1d3ac4',
  };
 
   if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
    passwordReset: email => {
      return firebase.auth().sendPasswordResetEmail(email)
    }
  }
  
   
    const auth = firebase.auth();
  export  {firebase, auth};

  

