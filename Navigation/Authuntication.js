import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import firebase from '../Configuration/firebase'

import Login from '../Screens/Login'
import Registration from "../Screens/Registration";
import ForgotPassword from "../Screens/ForgotPassword";
import MainNavigation from './MainNavigation'

//import Homescreen from "../screens/Homescreen";


function Authuntication() {
  const Stack = createStackNavigator();



  return (
    // to login/sign up navigation
    //<NavigationContainer>
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}>

      <Stack.Screen name="Login" component={Login} unmountOnBlur={true} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} unmountOnBlur={true} />
      <Stack.Screen name="Registration" component={Registration} unmountOnBlur={true} />
      {/* <Stack.Screen name="MainNavigation" component={MainNavigation} unmountOnBlur={true}/> */}

    </Stack.Navigator>
    //</NavigationContainer>
  );
}


export default Authuntication;
