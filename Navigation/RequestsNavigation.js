import * as React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PendingRequests from '../Screens/myVehicleScreens/PendingRequests'
import ConfirmedRequests from '../Screens/myVehicleScreens/ConfirmedRequest'
import ActiveRequests from '../Screens/myVehicleScreens/ActiveRequests'


export default function RequestsNavigation(){
   
    const Tab = createMaterialTopTabNavigator();
  
      return (
     
          <Tab.Navigator initialRouteName='Pending' 
          tabBarOptions={{
            tabStyle:{ borderTopWidth: 0 , borderTopColor:'transparent',borderTopWidth: 0,elevation:0},
            indicatorStyle:{
              backgroundColor:'#5dbcd2',
            }
          }}
          style={{backgroundColor:'white',borderTopWidth: 0}}>

            <Tab.Screen name='Confirmed' component={ConfirmedRequests}options={{ tabBarLabel: "مؤكدة",  }}/>
            <Tab.Screen name='Active' component={ActiveRequests} options={{ tabBarLabel: "نشطة"}}/>
            <Tab.Screen name='Pending' component={PendingRequests} options={{ tabBarLabel: "معلقة"}}/>

          </Tab.Navigator>
     
          
        )
      }
      
