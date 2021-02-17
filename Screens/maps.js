import React , { Component } from 'react';
import {StyleSheet, View} from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';


export default class Map extends Component {
render(){
  return(
      <View style={styles.container}>
      <MapView 
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      region={{
        latitude:24.7136,
        longitude:46.6753,
        latitudeDelta:0,
        longitudeDelta:0
       }}
      showsUserLocation
      maxZoomLevel={10}
      />
      
      </View>
  )  
}
}


const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: 300,
      width: 300,
    justifyContent: 'center',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
   });
   