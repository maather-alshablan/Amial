import { StatusBar } from 'expo-status-bar';
import React , {Component} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

export default class Registration extends Component {

  state= {
    email: ''
  }
  render(){
    return (
    <View style={styles.container}>
      <Text>التسجيل</Text>
        <Button 
        onPress = {() => this.props.navigation.pop()}
        title='back to login'/>

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

