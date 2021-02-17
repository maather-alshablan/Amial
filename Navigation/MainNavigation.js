import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View,} from 'react-native';


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {MaterialCommunityIcons,FontAwesome, Ionicons} from '../Constants/icons'
import colors from '../Constants/colors'

import HomeStack from '../Navigation/HomeStack'
import Vehicle from '../Navigation/MyVehicleNavigation' 
import Profile from '../Navigation/profileStack'
import RequestsNavigation from '../Navigation/RequestsNavigation'

function MainNavigation(){

  const Tab = createBottomTabNavigator();


    return (
        <Tab.Navigator initialRouteName='Homescreen' 
        
        tabBarOptions={{
          style:{ borderTopWidth: 0,
            elevation: 0},
            tabStyle:{height:60},
            labelStyle:{fontSize:17, fontFamily:'Tajawal_300Light'}
        }} >
          <Tab.Screen name='Profile' component={Profile} 
          options={
            {tabBarLabel:'حسابي', tabBarIcon: ({ tintColor, focused }) => (
            <FontAwesome
              name={focused ? "user" : "user-o"}
              color={focused ? colors.LightBlue:colors.Subtitle} 
              size={25} />)}}/>
          <Tab.Screen name='Vehicle' component={Vehicle}options={{tabBarLabel:'مركبتي', tabBarIcon: ({ tintColor, focused }) => (
            <Ionicons
              name={focused ? "car" : "car-outline"}
              color={focused ? colors.LightBlue:colors.Subtitle} 
              size={30} />)}}/>
          <Tab.Screen name='Trips' component={TripStack} options={{tabBarLabel:'رحلاتي', tabBarIcon: ({ tintColor, focused }) => (
            <FontAwesome
              name={focused ? "road" : "road"}
              color={focused ? colors.LightBlue:colors.Subtitle} 
              size={30} />)}}/>

          <Tab.Screen name='Homescreen' component={HomeStack} 
          
          options={{tabBarLabel:'الرئيسية', tabBarIcon: ({ tintColor, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              color={focused ? colors.LightBlue:colors.Subtitle} 
              size={30} />)}}/>
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
            headerTitle: props => <RequestHeader {...props} /> ,
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
