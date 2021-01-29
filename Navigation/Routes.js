import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {firebase, auth } from '../Configuration/firebase'
import AuthStack from '../Navigation/Authuntication';
import HomeStack from '../Navigation/MainNavigation';
import { AuthContext } from '../Navigation/AuthProvider';
import Loading from '../Navigation/Loading'


export default function Routes() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    setLoading(true);
  }

  useEffect(() => { 
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (!loading)
  return <Loading/>

  return (
    <NavigationContainer>
      {user ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
  );
}