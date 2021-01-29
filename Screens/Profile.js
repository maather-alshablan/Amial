import { StatusBar } from 'expo-status-bar';
import React , {Component} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {firebase} from '../Configuration/firebase'


export default class Profile extends Component {

  state= {
   
  }



handleSignOut= ()=>{
    firebase.auth().signOut();
}
  render(){
    return (
    <View style={styles.container}>
      <Text style={{fontSize:30,color:'blue'}}>Profile</Text>

      <TouchableOpacity onPress={()=> this.handleSignOut()}>
          <Text>
              Sign Out
          </Text>
      </TouchableOpacity>
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

