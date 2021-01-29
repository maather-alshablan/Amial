import { StatusBar } from 'expo-status-bar';
import React , {Component} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';


export default class Vehicle extends Component {

  state= {
   
  }




  render(){
    return (
    <View style={styles.container}>
      <Text style={{fontSize:30,color:'blue'}}>My Vehicle</Text>
                </View>
  );
  
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

