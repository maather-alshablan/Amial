import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { firebase, auth, database } from '../Configuration/firebase'
import AuthStack from '../Navigation/Authuntication';
import HomeStack from '../Navigation/MainNavigation';
import { AuthContext } from '../Navigation/AuthProvider';
import Loading from '../Navigation/Loading'


export default function Routes() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);


  const onResultUsers = (queury) => {
    queury.forEach((doc) => {
      if (doc.id == auth?.currentUser?.uid) {
        setUser(auth.currentUser);
      }
    });
  }
  const onError = (e) => {
    console.warn(e, "===")
  }


  // Handle user state changes
  function onAuthStateChanged(user) {
    const userCollection = database.collection('users').onSnapshot(onResultUsers, onError)
    if (user?.email) {
      setUser(user);
      if (initializing) setInitializing(false);
      setLoading(true);
    } else {
      setUser(user);
    }
  }


  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);

    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {

  }, []);

  if (!loading)
    return <Loading />

  return (
    <NavigationContainer>
      {user ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
  );
}