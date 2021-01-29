import { StatusBar } from 'expo-status-bar';
import React , {Component} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';


export default class Trips extends Component {

  state= {
   
  }




  render(){
    return (
    <View style={styles.container}>
      <Text style={{fontSize:30,color:'blue'}}>Trips</Text>
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

