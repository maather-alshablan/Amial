import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Image, Picker, FlatList } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Map from '../Screens/maps'
import colors from '../Constants/colors'
import { Entypo, FontAwesome5, Ionicons } from '../Constants/icons';
import SwitchSelector from "react-native-switch-selector";
import { color } from 'react-native-reanimated';
import { database } from '../Configuration/firebase';


export default class Homescreen extends Component {

state = {
searchValue: null,
mapView: false,
selected: 'white',
cars: []
}

onResult = (queury) => {
let car = null
let docId = ''
const cars = [];
queury.forEach(element => {
car = element.data();
docId = element.id
cars.push({
carId: docId,
...car
})
});
this.setState({ cars })
}
onError = (e) => {
console.log(e, "===")
}
componentDidMount() {
database.collection('Vehicle').onSnapshot(this.onResult, this.onError)
}


switchSelector = () => {

return (
<SwitchSelector
initial={0}
onPress={value => this.setState({ mapView: !this.state.mapView })}
textColor={colors.LightBlue} //'#7a44cf'
selectedColor={'white'}
buttonColor={colors.LightBlue}
borderColor={colors.LightBlue}
style={{ width: 300, marginVertical: 10 }}
hasPadding
textStyle={{ fontSize: 15, fontFamily: 'Tajawal_400Regular', margin: 3, color: colors.Subtitle }}
selectedTextStyle={{ fontSize: 15, fontFamily: 'Tajawal_400Regular', margin: 3, color: 'white' }}
options={[
{ label: "القائمة", customIcon: this.listViewIcon() }, //images.feminino = require('./path_to/assets/img/feminino.png')
{ label: "الخريطة", customIcon: this.mapViewIcon() } //images.masculino = require('./path_to/assets/img/masculino.png')
]}
/>
)
}

listViewIcon() {
return (
<Entypo name='list'
color={this.state.mapView ? colors.LightBlue : 'white'}
size={20} />
)
}

mapViewIcon() {
return (
<FontAwesome5 name='map-marker-alt'
color={this.state.mapView ? 'white' : colors.Subtitle}
size={20} />
)
}


mapView = () => {

return (
<View style={{  marginRight: 300 }} >
<Map />
</View>
)
}

renderCar = ({ item, index }) => {
const { image = "", model = "" } = item.vehicleDetails || {}
return (<TouchableOpacity
activeOpacity={1}
onPress={() => {
this.props.navigation.navigate('VehicleView', { vehicleID: item.carId })
}}
style={{
direction: 'rtl',
width: 320,
height: 220,
backgroundColor: '#fff',
marginVertical:10,
borderWidth:0.2,
shadowColor: '#000',
shadowOpacity: 0.15,
fontFamily: 'Tajawal_400Regular',
shadowRadius: 6,
shadowOffset: {
height: 3,
width: 0
},
borderRadius: 16,
padding: 12
}}>
<View style={{ justifyContent: 'flex-start', alignItems: 'flex-start'}}>
<View style={{ padding: 4, borderRadius: 4, backgroundColor: '#ffb815', flexDirection: 'row', alignItems: 'center' }}>
<Text style={{ color: '#fff' }}> x {item.Rating}</Text>
<FontAwesome5 name="star" color="#fff" />
</View>
</View>
<View style={{ width: '80%', height: 120, marginBottom: 4, alignSelf: 'center' }}>
<Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
</View>
<View style={{ padding: 4 }}>
<Text numberOfLines={1} style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'left' }}>{model}</Text>
<Text style={{ fontSize: 14, fontFamily:'Tajawal_400Regular', textAlign: 'left', color: '#929090', marginVertical:5 }}>{`السعر : ${item.dailyRate} ريال/يوم`}</Text>
</View>
</TouchableOpacity>)
}
listView = () => {

return (
<FlatList
data={this.state.cars}
renderItem={this.renderCar}
/>
// < View style={{ marginTop: 300 }} >
// <TouchableOpacity style={styles.Button} onPress={() => this.props.navigation.navigate('VehicleView')}>
// <Text>
// Request Vehicle
// </Text>
// </TouchableOpacity>
// </View>
)
}

render() {
return (
<View style={styles.container}>
<Image
source={require('../Constants/Logo/PNGLogo.png')}
style={styles.logo} />
<View style={styles.searchContainer}>
<TextInput
style={{ justifyContent: 'flex-end', textAlign: 'right', padding: 10, fontWeight: '600', fontFamily: 'Tajawal_400Regular', color: 'black', fontSize: 20 }}
placeholder={'ابحث عن مركبة..'}
value={this.state.searchValue}
/>
</View>

{this.switchSelector()}
{this.state.mapView ? this.mapView() : this.listView()}
</View>
);

}
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#fff',
alignItems: 'center',
// justifyContent: 'center',
},
searchContainer: {
backgroundColor: '#cad1d1',
width: Dimensions.get('window').width * 0.70,
height: 35,
borderRadius: 25,
},
logo: {
height: 150,
width: 200,
resizeMode: 'contain',
},
Button: {
backgroundColor: colors.LightBlue,
justifyContent: 'center',
alignItems: 'center',
width: 150,
height: 30,
borderRadius: 10,
color: 'white'
},
ViewSelection: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
borderWidth: 0.8,
width: 120,
borderRadius: 10
},
viewSelectionContainer: {
padding: 5,
marginHorizontal: 4,
alignSelf: 'center'
},
selectedView: {

}
});

