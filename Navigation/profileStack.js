import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View} from 'react-native';

import Profile from '../Screens/Profile'
import FAQ from '../Screens/FAQ'

function ProfileStack (){
    const Stack = createStackNavigator()

    return(
        <Stack.Navigator
        initialRouteName="profile">
        <Stack.Screen name="profile" 
        component={Profile} 
        unmountOnBlur={true}
        options={{ 
            headerRight: props => <Header {...props} /> ,
            headerStyle:{
              height:150
            },
            headerTitle:null,
            headerStyle: { shadowColor: 'transparent' }
            }}
        />
        <Stack.Screen name="FAQ" component={FAQ}
           options={{ 
            headerStyle:{
              height:150
            },
            headerTitle:props => <FAQHeader {...props} />,
            headerBackTitleVisible:false,
            headerStyle: { shadowColor: 'transparent' }
            }}
        
        />

        
        </Stack.Navigator>
    )
}



function Header(){
    return(
      <View >
      <Text style={{fontSize:30,color:'#5dbcd2', alignSelf:'flex-end'}}>حسابي</Text>
      </View>
    )
  }

  function FAQHeader(){
    return(
      <View >
      <Text style={{fontSize:30,color:'#5dbcd2', alignSelf:'flex-end'}}>FAQ</Text>
      </View>
    )
  }
export default ProfileStack;
