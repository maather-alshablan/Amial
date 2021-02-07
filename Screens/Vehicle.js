import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image, ImageBackgroundBase } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default class Vehicle extends Component {

  state = {
    hasVehicle: null,
  }




  render() {
    return (
      <View style={styles.container}>
        {this.state.hasVehicle ?
          <View><Text>Upload your vehicle</Text></View> : <View></View>}

        {!this.state.hasVehicle ?
          <View>{/* image is for mockup purposes */}
            <Image
              source={require('../Constants/Logo/PNGLogo.png')}
              style={styles.logo} />
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
              <TouchableOpacity style={styles.Button} onPress={() => this.props.navigation.navigate('ManageVehicle')}>
                <Text style={{ color: 'white' }}>إدارة المركبة</Text>
              </TouchableOpacity>



              <TouchableOpacity style={styles.Button} onPress={() => this.props.navigation.navigate('Requests')}>
                <Text style={{ color: 'white' }}>الطلبات</Text>
              </TouchableOpacity>
            </View>
          </View> : <View></View>
        }</View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',

  }, //for mockup
  logo: {
    height: 200,
    width: 350,
    resizeMode: 'contain',
  },
  Button: {
    backgroundColor: '#5dbcd2',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    width: 150,
    height: 30,
    borderRadius: 10,
    color: 'white'
  }
});

