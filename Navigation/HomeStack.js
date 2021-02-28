import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View } from 'react-native';


import Homescreen from '../Screens/Homescreen'
import VehicleView from '../Screens/myVehicleScreens/ViewVehicle'
import CustomHeader from "../components/CustomHeader";
import colors from '../Constants/colors'


function HomeStack() {
  const Stack = createStackNavigator()

  return (
    <Stack.Navigator
      initialRouteName="home">

      <Stack.Screen name="Home"
        component={Homescreen}
        unmountOnBlur={true}
        options={{
          headerTitle: null,
          headerStyle: { shadowColor: 'transparent', height: 0 }
        }}
      />

      <Stack.Screen
        name="VehicleView"
        component={VehicleView}
        options={{
          headerTitle: props => <CustomHeader title="المركبة" {...props} />,
          headerBackTitleVisible: false,
          headerBackTitleStyle: { color: '#5dbcd2' },
          headerTintColor: colors.LightBlue,
          headerStyle: { shadowColor: 'transparent', height: 140 }
        }} />

    </Stack.Navigator>
  )
}



export default HomeStack;
