import * as React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View} from 'react-native';

import Vehicle from '../Screens/Vehicle'
import ManageVehicle from '../Screens/myVehicleScreens/manageVehicle'
import RequestsNavigation from '../Navigation/RequestsNavigation'


function myVehicleNavigation(){

    const Stack = createStackNavigator();
  
      return (
          <Stack.Navigator initialRouteName='Vehicle' >
            <Stack.Screen name='Vehicle' 
            component={Vehicle} 
            options={{ 
              headerRight: props => <Header {...props} /> ,
              headerStyle:{
                height:150
              },
              headerTitle:null,
              headerStyle: { shadowColor: 'transparent' }
              }}/>
            <Stack.Screen name='ManageVehicle' 
            component={ManageVehicle}
            options={{ 
              headerRight: props => <ManageVehicleHeader {...props} /> ,
              headerTitle:null,
              headerBackTitleVisible:false,
              headerStyle:{
                height:150,
                shadowColor: 'transparent' 
              }
              }} />
            <Stack.Screen name='Requests' 
            component={RequestStack}
            options={{ 
              headerShown:false
              }}/>

          </Stack.Navigator>
        )
      }
      


      //The logic behind nesting tab navigation inside of a stack navigator 
      // is because tab navigation does not allow implementing headers inside on top of them
    

      function RequestStack(){
        const Stack = createStackNavigator();
        return(
          <Stack.Navigator initialRouteName='Requests' 
          screenOptions={{
          headerTitle:false,
          headerBackTitleVisible:false,
          
          headerStyle:{
      
             shadowColor: 'transparent' ,
            
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
          <View style={{paddingVertical:10}}>
          <Text style={{fontSize:40,color:'#5dbcd2', alignSelf:'flex-end' }}>مركبتي</Text>
          <Text style={{fontSize:25,color:'grey', alignSelf:'flex-end'}}>الطلبات</Text>
          </View>
        )
      }

      function ManageVehicleHeader(){
        return(
          <View style={{paddingVertical:10}}>
          <Text style={{fontSize:40,color:'#5dbcd2', alignSelf:'flex-end'}}>مركبتي</Text>
          <Text style={{fontSize:25,color:'grey', alignSelf:'flex-end'}}>إدارة البيانات</Text>
          </View>
        )
      }

      function Header(){
        return(
          <View >
          <Text style={{fontSize:40,color:'#5dbcd2', alignSelf:'flex-end'}}>مركبتي</Text>
          </View>
        )
      }
      export default myVehicleNavigation;
  