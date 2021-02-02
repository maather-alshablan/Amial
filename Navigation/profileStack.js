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
          headerTitle: props => <Header {...props} /> ,
            headerStyle: { shadowColor: 'transparent' ,height:170}
            }}
        />
        <Stack.Screen name="FAQ" component={FAQ}
           options={{ 
            headerTitle:props => <FAQHeader {...props} />,
            headerBackTitleVisible:false,
            headerBackTitleStyle:{color:'#5dbcd2'},
            headerStyle: { shadowColor: 'transparent',height:170}
            }}
        
        />

        
        </Stack.Navigator>
    )
}



function Header(){
    return(
      <View >
      <Text style={{fontSize:35,color:'#5dbcd2',fontFamily:'Tajawal_400Regular'}}>حسابي</Text>
      </View>
    )
  }

  function FAQHeader(){
    return(
      <View >
      <Text style={{fontSize:35,color:'#5dbcd2', fontFamily:'Tajawal_400Regular', }}>الأسئلة الشائعة</Text>
      </View>
    )
  }
export default ProfileStack;
