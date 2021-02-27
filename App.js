
import React from 'react';
import Authuntication from './Navigation'
import AppLoading from 'expo-app-loading';
import {
  useFonts, Tajawal_200ExtraLight,
  Tajawal_300Light,
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
  Tajawal_800ExtraBold,
  Tajawal_900Black
} from '@expo-google-fonts/tajawal'
import { ModalComponent } from './Constants/Components/Modal';


export default function App() {

  let [fontsLoaded] = useFonts({
    Tajawal_200ExtraLight,
    Tajawal_300Light,
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
    Tajawal_800ExtraBold,
    Tajawal_900Black
  });


  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return <>
    <Authuntication />
    <ModalComponent />
  </>;

}