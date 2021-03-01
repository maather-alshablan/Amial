import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Login from '../Screens/Login'
import Registration from "../Screens/Registration";
import ForgotPassword from "../Screens/ForgotPassword";


function Authuntication() {
  const Stack = createStackNavigator();



  return (
    
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}>

      <Stack.Screen name="Login" component={Login} unmountOnBlur={true} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} unmountOnBlur={true} />
      <Stack.Screen name="Registration" component={Registration} unmountOnBlur={true} />

    </Stack.Navigator>
  );
}


export default Authuntication;
