import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View} from 'react-native';


import Homescreen from '../Screens/Homescreen'
import VehicleView from '../Screens/myVehicleScreens/ViewVehicle'

import colors from '../Constants/colors'


function HomeStack (){
    const Stack = createStackNavigator()

    return(
        <Stack.Navigator
        initialRouteName="home">

        <Stack.Screen name="Home" 
        component={Homescreen} 
        unmountOnBlur={true}
        options={{ 
          headerShown: false
            }}
        />

          <Stack.Screen name="VehicleView" component={VehicleView}
           options={{ 
            headerTitle:({name ,props}) => <ViewVehicleHeader name={name} {...props} />,
            headerBackTitleVisible:false,
            headerBackTitleStyle:{color:'#5dbcd2'},
            headerTintColor:colors.LightBlue,
            headerStyle: { shadowColor: 'transparent',height:140}
            }}/>
        

        
        </Stack.Navigator>
    )
}




  function ViewVehicleHeader({name, ...props}){
    return(
      <View >
      <Text style={{fontSize:35,color:'#5dbcd2', fontFamily:'Tajawal_400Regular', }}>{name}
</Text>
      </View>
    )
  }


  
export default HomeStack;
