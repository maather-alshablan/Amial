import { StatusBar } from 'expo-status-bar';
import React , {Component} from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Request from './ConfirmedRequest'


export default class ConfirmedRequests extends Component {

  state= {
  }

  render(){
    return (
    <View style={styles.container}>
      
      <Text>Confirmed</Text>
      
      </View>
       );  }}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }, //for mockup
  
});

