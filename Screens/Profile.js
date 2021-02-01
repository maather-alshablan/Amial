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

          <TouchableOpacity 
      style={styles.Button}
      onPress={()=>this.props.navigation.navigate('FAQ')}>
          <Text style={{color:'white'}}>
            FAQ
          </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
      style={styles.Button}
      onPress={()=> this.handleSignOut()}>
          <Text style={{color:'white'}}>
            تسجيل الخروج
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
  },Button:{
    backgroundColor:'#0092e5',
    justifyContent:'center',
    alignItems:'center',
    margin:10,
    width:150,
    height:30,
    borderRadius:10,
    color:'white'
  }
});

