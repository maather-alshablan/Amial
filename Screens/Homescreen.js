import { StatusBar } from 'expo-status-bar';
import React , {Component} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';


export default class Homescreen extends Component {

  state= {
   
  }




  render(){
    return (
    <View style={styles.container}>
      <Text style={{fontSize:30,color:'blue'}}>Homescreen</Text>
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

