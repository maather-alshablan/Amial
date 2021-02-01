import React , {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';



export default class FAQ extends Component {

  state= {
   
  }




  render(){
    return (
    <View style={styles.container}>

          <Text style={{color:'white'}}>
            FAQ
          </Text>
   
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

