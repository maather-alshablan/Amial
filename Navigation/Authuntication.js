import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";


import Login from '../Screens/Login'
import Registration from "../Screens/Registration";
import ForgotPassword from "../Screens/ForgotPassword";

//import Homescreen from "../screens/Homescreen";


function Authuntication() {
  const Stack = createStackNavigator();

  //Reference:  /*authentication :
  // https://rnfirebase.io/auth/usage

  // const [initializing, setInitializing] = useState(true);
  // const [user, setUser] = useState();
  // // Handle user state changes
  // function onAuthStateChanged(user) {
  //   setUser(user);
  //   if (initializing) setInitializing(false);
  // }

  // useEffect(() => {
  //   const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
  //   return subscriber; // unsubscribe on unmount
  // }, []);

  // if (initializing) return null;

  // if (!user) {

  // }

  return (
    // to login/sign up navigation
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Login" component={Login} unmountOnBlur={true}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} unmountOnBlur={true}/>
        <Stack.Screen name="Registration" component={Registration} unmountOnBlur={true}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Authuntication;
