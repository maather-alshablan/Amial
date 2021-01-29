import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Homescreen from '../Screens/Homescreen'
import Trips from '../Screens/Trips'
import Vehicle from '../Screens/Vehicle' 
import Profile from './profileStack'



function MainNavigation(){

  const Tab = createBottomTabNavigator();


    return (
   //   <NavigationContainer  independent={true} >
        <Tab.Navigator initialRouteName='Homescreen'>
          <Tab.Screen name='Homescreen' component={Homescreen} />
          <Tab.Screen name='Trips' component={Trips}/>
          <Tab.Screen name='Vehicle' component={Vehicle}/>
          <Tab.Screen name='Profile' component={Profile}/>
        </Tab.Navigator>
       // </NavigationContainer>
      )
    }
    
    export default MainNavigation;
