import * as React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PendingRequests from '../Screens/TripRequests/PendingRequests'
import ConfirmedRequests from '../Screens/TripRequests/ConfirmedRequests'
import ActiveRequests from '../Screens/TripRequests/ActiveRequests'


export default function TripRequestsNavigation(){
   
    const Tab = createMaterialTopTabNavigator();
  
      return (
     
          <Tab.Navigator initialRouteName='Pending' 
          
          tabBarOptions={{
            tabStyle:{ borderTopWidth: 0 , borderTopColor:'transparent',borderTopWidth: 0,elevation:0,},
            indicatorStyle:{
              backgroundColor:'#5dbcd2',
              
            },
            labelStyle:tabText
          }}
          style={{backgroundColor:'white',borderTopWidth: 0}}>

            <Tab.Screen name='Confirmed' component={ConfirmedRequests}options={{ 
              tabBarLabel: "مؤكدة" }}/>
            <Tab.Screen name='Active' component={ActiveRequests} options={{ tabBarLabel: "نشطة"}}/>
            <Tab.Screen name='Pending' component={PendingRequests} options={{ tabBarLabel: "معلقة"}}/>

          </Tab.Navigator>
     
          
        )
      }
      
      const tabText={
        fontFamily:'Tajawal_300Light',
        fontSize:20}
