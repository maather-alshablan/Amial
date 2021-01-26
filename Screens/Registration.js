import { StatusBar } from 'expo-status-bar';
import React , {Component} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import {auth ,database} from '../Configuration/firebase'
export default class Registration extends Component {

  state= {
    name:'',
    nationalID:'',
    email: '',
    mobileNumber:'',
    DoB:'',
    password:'',
    confirmationPassword:''
  }

  handleSignUp = () => {

  }


  render(){
    return (
    <View style={styles.container}>
      <Text>التسجيل</Text>

      <Text>رقم الهوية</Text>
      <TextInput
      value={this.state.nationalID}/>

      <Text>الأسم الكامل</Text>
      <TextInput
      value={this.state.name}/> 
     
      <Text>البريد الإلكتروني</Text>
      <TextInput
      value={this.state.email}/>
      
      <Text>رقم التواصل</Text>
      <TextInput
      value={this.state.mobileNumber}/>
      
      <Text>تاريخ الميلاد</Text>
      <TextInput
      value={this.state.DoB}/>
      
      <Text>كلمة المرور</Text>
      <TextInput
      value={this.state.password}/>
      
      <Text>تأكيد كلمة المرور</Text>
      <TextInput
      value={this.state.confirmationPassword}/>

      <Button
      onPress = {()=> handleSignUp()}
      title='تسجيل'/>

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

