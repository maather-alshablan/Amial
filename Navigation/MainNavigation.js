import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View,} from 'react-native';


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Homescreen from '../Screens/Homescreen'
import Trips from '../Screens/Trips'
import Vehicle from '../Navigation/MyVehicleNavigation' 
import Profile from './profileStack'
import RequestsNavigation from '../Navigation/RequestsNavigation'

function MainNavigation(){

  const Tab = createBottomTabNavigator();


    return (
        <Tab.Navigator initialRouteName='Homescreen' 
        
        tabBarOptions={{
          style:{ borderTopWidth: 0,
            elevation: 0},
            tabStyle:{height:25},
            labelStyle:{fontSize:20, fontFamily:'Tajawal_300Light'}
        }} >
          <Tab.Screen name='Homescreen' component={Homescreen} 
          
          options={{tabBarLabel:'الرئيسية',}}/>
          <Tab.Screen name='Trips' component={TripStack} options={{tabBarLabel:'رحلاتي'}}/>
          <Tab.Screen name='Vehicle' component={Vehicle}options={{tabBarLabel:'مركبتي'}}/>
          <Tab.Screen name='Profile' component={Profile} options={{tabBarLabel:'حسابي'}}/>
        </Tab.Navigator>
      )
    }


    function TripStack(){
      const Stack = createStackNavigator();
      return(
        <Stack.Navigator initialRouteName='Requests' 
        screenOptions={{
        headerTitle:false,
        headerBackTitleVisible:false,
        
        headerStyle:{
          maxHeight:100,
          shadowRadius: 0,
          
          shadowOffset: {
              height: 0,
          },
        }}}>
          <Stack.Screen name='Requests' 
          component={RequestsNavigation} 
          options={{ 
            headerRight: props => <RequestHeader {...props} /> ,
            headerStyle:{
              height:150
            }
            }}/>
        </Stack.Navigator>
      )
    }

    function RequestHeader(){
      return(
        <View >
        <Text style={{fontSize:30,color:'#5dbcd2', fontFamily:'Tajawal_400Regular', alignSelf:'flex-end'}}>رحلاتي</Text>
        </View>
      )
    }


    
    export default MainNavigation;
