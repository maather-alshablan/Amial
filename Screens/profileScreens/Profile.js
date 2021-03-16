import React, { Component } from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { firebase } from '../../Configuration/firebase'
import Person from '../profileScreens/person'
import { SimpleLineIcons, MaterialCommunityIcons, FontAwesome, Entypo } from '../../Constants/icons'
export default class Profile extends Component {

state = {

}
handleSignOut = () => {
firebase.auth().signOut();
}


render() {


return (
<View style={styles.container}>
<Person />

<View style={styles.list}>

<TouchableOpacity
style={styles.listItem}
onPress={() => this.props.navigation.navigate('EditProfile')}>
<Entypo name='chevron-right' size={20} style={{ margin: 5 }} />
<Text style={styles.title}>
تعديل بيانات الحساب
</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.listItem}
onPress={() => this.props.navigation.navigate('creditCard')}>
<Entypo name='chevron-right' size={20} style={{ margin: 5 }} />
<Text style={styles.title}>
بيانات البطاقة البنكية
</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.listItem}
onPress={() => this.props.navigation.navigate('changePassword')}>
<Entypo name='chevron-right' size={20} style={{ margin: 5 }} />
<Text style={styles.title}>
تغيير كلمة المرور
</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.listItem}
onPress={() => this.props.navigation.navigate('FAQ')}>
<Entypo name='chevron-right' size={20} style={{ margin: 5 }} />
<Text style={styles.title}>
الأسئلة الشائعة
</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.listItem}
onPress={() => {
const phone = "0505220440"; //admin's phone
Linking.canOpenURL('https://api.whatsapp.com/send?' + 'phone=' + phone)
.then(supported => {
if (!supported) {
showMessage({
message: 'يرجى تنزيل برنامج الواتس اب',
type: 'danger',
style: {}
});
} else {
return Linking.openURL('https://api.whatsapp.com/send?' + 'phone=' + phone).catch(e => console.warn(e));
}
})
}}
>
<Entypo name='chevron-right' size={20} style={{ margin: 5 }} />
<Text style={styles.title}>
تواصل معنا
</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.listItem}
onPress={() => this.handleSignOut()}>
<Entypo name='chevron-right' size={20} style={{ margin: 5 }} />
<Text style={styles.title}>
تسجيل الخروج
</Text>
</TouchableOpacity>
</View>

</View>
);

}
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#fff',
alignItems: 'center',
justifyContent: 'flex-end',
},
listItem: {
flexDirection: 'row-reverse',
justifyContent: 'flex-start',
alignItems: 'flex-end',
margin: 10,
width: 300,
height: 34,
borderColor: 'grey',
borderWidth: 1,
borderTopWidth: 0,
borderLeftWidth: 0,
borderRightWidth: 0,
},
list: {
alignItems: 'flex-end',
justifyContent: 'flex-end',
marginLeft: 40,
marginBottom: 140

},
title: {
marginBottom: 5,
color: 'black',
fontSize: 20,
fontFamily: 'Tajawal_400Regular'
}


});


