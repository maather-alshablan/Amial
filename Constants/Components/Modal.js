import React, { Component } from 'react';

import { StyleSheet } from 'react-native';
import FlashMessage  from "react-native-flash-message";
export class ModalComponent extends Component {

   
    render() {
      return (
      <FlashMessage 
      ref="myLocalFlashMessage" 
      position="bottom"
      icon='auto'
      style={{
        alignSelf:'center',
        justifyContent:'center',
        top:25
        
      }}
      titleStyle={{
        textAlign:'right',
        paddingTop:10,

        fontSize:22,
        marginRight:5,
        fontFamily:'Tajawal_400Regular'
      }}
      
      />)
        
      }
    }

    const styles = StyleSheet.create({
       
        modalView: {
          margin: 20,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 22,
          backgroundColor: "white",
          borderRadius: 20,
          padding: 35,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2
          }}})