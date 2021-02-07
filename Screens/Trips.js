import { StatusBar } from 'expo-status-bar';
import React , {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';


export default class Trips extends Component {

  state= {
   
  }




  render(){
    return (
    <View style={styles.container}>
     <Text style={{fontSize:30,color:'#0092e5', marginTop:40}}>رحلاتي</Text>

  
      <View style={{flexDirection:'row-reverse' , margin:10}}>
        <TouchableOpacity  style={styles.Button}>
        <Text style={styles.tabText}>النشطة</Text>
         </TouchableOpacity>
         <TouchableOpacity  style={styles.Button}>
        <Text style={styles.tabText}>المؤكدة</Text>
         </TouchableOpacity>
         <TouchableOpacity  style={styles.Button}>
        <Text style={styles.tabText}>المعلقة</Text>
         </TouchableOpacity>
         </View>
                </View>
  );
  
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    //justifyContent: 'center',
   
  }, Button:{
    backgroundColor:'#0092e5',
    justifyContent:'center',
    alignItems:'center',
    margin:10,
    width:150,
    height:30,
    borderRadius:10,
    color:'white'
  }, tabText:{
    color:'white',
    fontFamily:'Tajawal_300Light',
    fontSize:15
  }
});

