import React, { useState, useEffect } from 'react';
import {
ActivityIndicator, View, Text, SafeAreaView, TouchableOpacity, ScrollView,
LayoutAnimation,
UIManager,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);


export default function FAQComponent(props) {
console.warn({ props })
const [show, setShow] = useState(false);

const onLayout = () => {
LayoutAnimation.configureNext(
LayoutAnimation.create(200, 'linear', 'opacity')
);
}
return (
<View style={{ marginHorizontal: 16, borderBottomWidth: 0.2, borderBottomColor: '#000' }}>
<TouchableOpacity
activeOpacity={1}
onPress={() => {
setShow(!show)
onLayout()
}} style={{ padding: 16, flexDirection: 'row', alignItems: 'center', }}>
<View style={{ width: 20, height: 20, borderRadius: 10, borderColor: '#000', borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>

<FontAwesome5 name={show ? "minus" : "plus"} color="#000" size="14" />
</View>
<Text style={{
textAlign: 'left',
color: 'black',
fontSize: 20,
fontFamily: 'Tajawal_400Regular'
}}>{props.item?.qustion}</Text>
</TouchableOpacity>
{show ? <View style={{ padding: 16, paddingTop: 8 }}>
<Text style={{
textAlign: 'left',
color: 'green',
fontSize: 16,
fontFamily: 'Tajawal_400Regular'
}}>{props.item?.answer}</Text>
</View> : null}

</View>
)
}
