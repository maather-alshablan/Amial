import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image, Linking } from 'react-native';
import FAQComponent from '../../components/FAQComponent';



export default class FAQ extends Component {

state = {
faq: [

{
qustion: 'كيف تعرض مركبتك',
answer: 'جواب السؤال'
},
{
qustion: ' المركبات المسموحة',
answer: 'جواب السؤال'
},
{
qustion: 'كيفية التواصل مع المستأجر / المؤجر',
answer: 'جواب السؤال'
},
{
qustion: 'طرق استلام المركبة ',
answer: 'جواب السؤال'
},
{
qustion: 'مدة اغلاق / الغاء الطلب ',
answer: 'جواب السؤال'
},
{
qustion: 'غرامة الغاء الطلب',
answer: 'جواب السؤال'
},
{
qustion: 'سياسة الدفع ',
answer: 'جواب السؤال'
},
]
}




render() {
return (
<View style={styles.container}>
<FlatList
data={this.state.faq}
renderItem={({ item }) => <FAQComponent item={item} />}
/>
<View style={{ padding: 16, justifyContent: 'center', alignItems: 'center' }}>

<TouchableOpacity
onPress={() => {
const phone = "0505220440"; //Admin's phone 
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
style={{ padding: 8, paddingHorizontal: 20, borderRadius: 6, borderColor: '#3fc250', borderWidth: 1, flexDirection: 'row', alignItems: 'center' }}>
<Image source={{ uri: 'https://img.icons8.com/color/452/whatsapp--v1.png' }} style={{ width: 24, height: 24 }} />
<Text style={{ marginLeft: 8, fontFamily: 'Tajawal_400Regular', fontSize: 16 }}>تواصل معنا</Text>
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
direction: 'rtl'
}, Button: {
backgroundColor: '#0092e5',
justifyContent: 'center',
alignItems: 'center',
margin: 10,
width: 150,
height: 30,
borderRadius: 10,
color: 'white'
}
});
