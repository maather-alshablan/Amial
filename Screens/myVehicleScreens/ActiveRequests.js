import { StatusBar } from 'expo-status-bar';
import React , {Component} from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';

import colors from '../../Constants/colors';


export default class ActiveRequests extends Component {

  state= {
  }

  render(){
    return (
    <View style={styles.container}>
      
      <Text style={styles.emptyTripsText}> لا يوجد رحلات..</Text>
      
      </View>
       );  }}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }, //for mockup
  emptyTripsText:{
    color:colors.Subtitle,
    fontSize:20,
    fontFamily:"Tajawal_500Medium"
  }
  
});

