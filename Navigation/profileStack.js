import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from '../Screens/Profile'

function ProfileStack (){
    const Stack = createStackNavigator()

    return(
        <Stack.Navigator
        initialRouteName="profile"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="profile" component={Profile} unmountOnBlur={true}/>

        
        </Stack.Navigator>
    )
}

export default ProfileStack;
