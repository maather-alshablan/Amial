import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Text, View, } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '../Constants/icons'
import colors from '../Constants/colors'

import HomeStack from '../Navigation/HomeStack'
import Vehicle from '../Navigation/MyVehicleNavigation'
import Profile from '../Navigation/profileStack'
import TripRequestsNavigation from '../Navigation/tripsRequestsNavigation'
import CustomHeader from "../components/CustomHeader";
import TripRequestDetails from '../Screens/TripRequests/TripRequestDetails'
import TripForm from '../Screens/myVehicleScreens/TripForm'
import creditCard from '../Screens/profileScreens/creditCard'


function CreditCardHeader() {
  return (
    <View >
      <Text style={{ fontSize: 35, color: '#5dbcd2', fontFamily: 'Tajawal_400Regular', }}> بيانات البطاقة البنكية</Text>
    </View>
  )
}

function MainNavigation() {

  const Tab = createBottomTabNavigator();


  return (
    <Tab.Navigator initialRouteName='Homescreen'

      tabBarOptions={{
        style: {
          borderTopWidth: 0,
          elevation: 0
        },
        tabStyle: { height: 60 },
        labelStyle: { fontSize: 17, fontFamily: 'Tajawal_300Light' }
      }} >
      <Tab.Screen name='Profile' component={Profile}
        options={
          {
            tabBarLabel: 'حسابي', tabBarIcon: ({ tintColor, focused }) => (
              <FontAwesome
                name={focused ? "user" : "user-o"}
                color={focused ? colors.LightBlue : colors.Subtitle}
                size={25} />)
          }} />
      <Tab.Screen name='Vehicle'
        component={Vehicle}
        options={{
          tabBarLabel: 'مركبتي',
          tabBarIcon: ({ tintColor, focused }) => (
            <Ionicons
              name={focused ? "car" : "car-outline"}
              color={focused ? colors.LightBlue : colors.Subtitle}
              size={30} />)
        }}
      />
      <Tab.Screen name='Trips' component={TripStack}
        options={{
          tabBarLabel: 'رحلاتي', tabBarIcon: ({ tintColor, focused }) => (
            <FontAwesome
              name={focused ? "road" : "road"}
              color={focused ? colors.LightBlue : colors.Subtitle}
              size={30} />)
        }} />

      <Tab.Screen name='Homescreen' component={HomeStack}

        options={{
          tabBarLabel: 'الرئيسية', tabBarIcon: ({ tintColor, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              color={focused ? colors.LightBlue : colors.Subtitle}
              size={30} />)
        }} />
    </Tab.Navigator>
  )
}


function TripStack() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName='Requests'
      screenOptions={{
        headerTitle: false,
        headerBackTitleVisible: false,

        headerStyle: {
          maxHeight: 100,
          shadowRadius: 0,

          shadowOffset: {
            height: 0,
          },
        }
      }}>
      <Stack.Screen name='Requests'
        component={TripRequestsNavigation}

        options={{
          headerTitle: props => <CustomHeader title="رحلاتي" {...props} />,
          headerStyle: {
            height: 150
          }
        }} />
      <Stack.Screen
        name='RequestDetails'
        component={TripRequestDetails}
        options={{
          headerTitle: props => <CustomHeader title="تفاصيل طلب المركبة" {...props} />,
          headerBackTitleStyle: { color: colors.LightBlue },
          headerStyle: {
            height: 150,
            shadowColor: 'transparent'
          },

        }} />

      <Stack.Screen name="creditCard" component={creditCard}
        options={{
          headerTitle: props => <CreditCardHeader {...props} />,
          headerBackTitleVisible: false,
          headerBackTitleStyle: { color: '#5dbcd2' },
          headerTintColor: colors.LightBlue,
          headerStyle: { shadowColor: 'transparent', height: 140 }
        }} />
      <Stack.Screen name='tripForm'
        component={TripForm}
        options={{
          headerRight: null,
          headerTitle: props => <CustomHeader title="بيانات الرحلة" {...props} />,
          headerBackTitleVisible: false,
          headerStyle: {
            height: 170,
            shadowColor: 'transparent',
          }
        }} />
    </Stack.Navigator>
  )
}




export default MainNavigation;
