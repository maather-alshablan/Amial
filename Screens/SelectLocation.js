import React, { Component } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import colors from '../Constants/colors';


export default class SelectLocation extends Component {

constructor(props) {
super(props);
this.state = {
latitude: 24.7136,
longitude: 46.6753,
}
this.mapNormal = React.createRef();
}
componentDidMount() {
this.currentLocationBtn()
}
currentLocationBtn = async () => {
let { status } = await Location.requestPermissionsAsync();
if (status !== 'granted') {
alert('Permission to access location was denied');
return;
}

let location = await Location.getCurrentPositionAsync({});
this.moveToPoint({
latitude: location.latitude,
longitude: location.longitude
})

};

moveToPoint = async ({ latitude, longitude }) => {

const region = {
latitude: latitude,
longitude: longitude,
latitudeDelta: 0.012,
longitudeDelta: 0.012,
};
this.mapNormal.current.animateToRegion(region, 500);
};


handleChangeRegion = (regoin) => {
this.setState({
latitude: parseFloat(regoin.latitude.toFixed(6)),
longitude: parseFloat(regoin.longitude.toFixed(6))
})
if (this.props.setCoordinates) {
this.props.setCoordinates({
latitude: parseFloat(regoin.latitude.toFixed(6)),
longitude: parseFloat(regoin.longitude.toFixed(6))
})
}
}

render() {
return (
<>
<View style={styles.mapSize}>
{/* <GooglePlacesAutocomplete
placeholder="Search"
query={{
key: "AIzaSyDHUWPfalHhfjfnxRcyd-PfIUN_sMhdxo4",
language: 'ar', // language of the results
}}
onPress={(data, details = null) => {
console.warn("+++++", data, details)
}}
onFail={(error) => console.error(error)}
renderRow={(data) => <TouchableOpacity
onPress={() => console.warn('eeeee', data)}
style={{ height: 22, width: '100%', backgroundColor: 'red' }}></TouchableOpacity>}
/> */}
</View>
<View style={styles.container}>
<MapView
ref={this.mapNormal}

style={styles.map}
// provider={PROVIDER_GOOGLE}
initialRegion={{
latitude: parseFloat(this.state.latitude != "" ? this.state.latitude : 37.78825),
longitude: parseFloat(this.state.longitude != "" ? this.state.longitude : -122.4324),
latitudeDelta: 0.00922,
longitudeDelta: 0.00421,
}}
showsUserLocation
onRegionChange={this.handleChangeRegion}

>
<Marker
title="موقع المركبة"
style={{color:colors.LightBlue}}
coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
// image={require('../assets/pin.png')}
/>
</MapView>

</View>
</>
)
}
}


const styles = StyleSheet.create({
container: {
...StyleSheet.absoluteFillObject,
height: Dimensions.get('screen').width,
width: Dimensions.get('screen').width,
justifyContent: 'center',
alignItems: 'center',
},
map: {
...StyleSheet.absoluteFillObject,
},
});
