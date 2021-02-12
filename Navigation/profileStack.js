import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View} from 'react-native';

import Profile from '../Screens/profileScreens/Profile'
import FAQ from '../Screens/profileScreens/FAQ'
import creditCard from '../Screens/profileScreens/creditCard'
import editProfile from '../Screens/profileScreens/editProfile'
import changePassword from '../Screens/profileScreens/changePassword'
import colors from '../Constants/colors'


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
            headerStyle: { shadowColor: 'transparent' ,height:140},
            headerTintColor:colors.LightBlue

            }}
        />

          <Stack.Screen name="EditProfile" component={editProfile}
           options={{ 
            headerTitle:props => <EditProfileHeader {...props} />,
            headerBackTitleVisible:false,
            headerBackTitleStyle:{color:'#5dbcd2'},
            headerTintColor:colors.LightBlue,
            headerStyle: { shadowColor: 'transparent',height:140}
            }}/>
        <Stack.Screen name="FAQ" component={FAQ}
           options={{ 
            headerTitle:props => <FAQHeader {...props} />,
            headerBackTitleVisible:false,
            headerBackTitleStyle:{color:'#5dbcd2'},
            headerStyle: { shadowColor: 'transparent',height:140},
            headerTintColor:colors.LightBlue
            }}/>
           
            <Stack.Screen name="creditCard" component={creditCard}
           options={{ 
            headerTitle:props => <CreditCardHeader {...props} />,
            headerBackTitleVisible:false,
            headerBackTitleStyle:{color:'#5dbcd2'},
            headerTintColor:colors.LightBlue,
            headerStyle: { shadowColor: 'transparent',height:140}
            }}/>
       
                 <Stack.Screen name="changePassword" component={changePassword}
           options={{ 
            headerTitle:props => <ChangePasswordHeader {...props} />,
            headerBackTitleVisible:false,
            headerBackTitleStyle:{color:'#5dbcd2'},
            headerTintColor:colors.LightBlue,
            headerStyle: { shadowColor: 'transparent',height:140}
            }}/>

        
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


  function EditProfileHeader(){
    return(
      <View >
      <Text style={{fontSize:35,color:'#5dbcd2', fontFamily:'Tajawal_400Regular', }}>تعديل بيانات الحساب
</Text>
      </View>
    )
  }


  function FAQHeader(){
    return(
      <View >
      <Text style={{fontSize:33,color:'#5dbcd2', fontFamily:'Tajawal_400Regular', }}>الأسئلة الشائعة</Text>
      </View>
    )
  }

  function CreditCardHeader(){
    return(
      <View >
      <Text style={{fontSize:35,color:'#5dbcd2', fontFamily:'Tajawal_400Regular', }}> بيانات البطاقة البنكية</Text>
      </View>
    )
  }

  function ChangePasswordHeader(){
    return(
      <View >
      <Text style={{fontSize:35,color:'#5dbcd2', fontFamily:'Tajawal_400Regular', }}> تغيير كلمة المرور</Text>
      </View>
    )
  }
export default ProfileStack;
