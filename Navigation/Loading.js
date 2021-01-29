import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Dimensions, View , ActivityIndicator, Image } from 'react-native';


export default function Loading() {
  return (
      <View style={styles}>
          <ActivityIndicator size='large' color='black'/>
   <Image
   source={require('../Constants/PNGLogo.png')}
   style={{width: Dimensions.get('window').height*0.40, height:100, marginTop:300}}
   />
   </View>
  );
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  