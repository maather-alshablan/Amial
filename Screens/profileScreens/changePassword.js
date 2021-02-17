import { StatusBar } from 'expo-status-bar';
import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, SafeAreaView, Image, View, Button, ImageBackground, Alert } from 'react-native';
import { auth, firebase } from '../../Configuration/firebase'
import Icon from 'react-native-vector-icons/Entypo';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import colors from '../../Constants/colors';

import {ModalComponent} from '../../Constants/Components/Modal'
import  { showMessage, hideMessage } from "react-native-flash-message";

export default class ChangePassword extends Component {


  state = {
    password: '',
    confirmPassword:'',
    errorMessage:''
  }
  handlePasswordReset = async () => {
    
    if (!(this.state.password === this.state.confirmPassword))
      this.failureMessage();

      await auth.currentUser.updatePassword(this.state.password).catch(()=>{
        showMessage({
          message: 'يرجى اختيار كلمة مرور قوية',
          type: 'danger'
        });
        
      })
      .then(()=>{
        showMessage({
          message:"تم اعادة تعيين كلمة المرور بنجاح",
          type: "success",
        });
      })}
    

  
  
    
    failureMessage= ()=> {
      showMessage({
        message:  'يرجى التأكد من مطابقة كلمة المرور',
        type: 'danger'
      });
    }
  

  render() {
    return (
      <View style={styles.container}>

        <View style={{ marginBottom: 90 }}>
          <Image 
          source={require('../../images/resetIcon.png')}
          style={{
              resizeMode:'contain',
              height:200}} />
        </View>
        {this.state.errorMessage ?  
        <View style={{margin:10}}>
         <Text style={{ color: 'red' }}>
            {this.state.errorMessage}</Text> </View> : <View>
            </View>}

        <View style={styles.InputView}>

          <Text style={styles.FieldTitle}>كلمة المرور</Text>
          <TextInput
            style={styles.InputField}
            secureTextEntry
            placeholder='******'
            onChangeText={password => this.setState({ password: password })}
            value={this.state.password}
          />

        </View>
        <View style={styles.InputView}>

<Text style={styles.FieldTitle}>تأكيد كلمة المرور</Text>
<TextInput
  style={styles.InputField}
  secureTextEntry
  placeholder='******'
  onChangeText={password => this.setState({ confirmPassword: password })}
  value={this.state.confirmPassword}
/>

</View>


        <TouchableOpacity style={styles.Reset} onPress={() => this.handlePasswordReset()} >
          <Text style={{ color: 'white', fontWeight: '800' }}> إعادة ضبط كلمة المرور</Text>

        </TouchableOpacity>
      

        <ModalComponent/>
      </View>

    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Reset: {
    backgroundColor: colors.LightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 15,
    width: 200,
    height: 40,
    borderRadius: 15,
    color: 'white'
  },
  InputView: {
    flexDirection: 'row-reverse',
    marginBottom: 20,


  },
  InputField: {
    paddingHorizontal: 20,
    textAlign: 'right',
    color: 'black',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: 200,
    borderStartColor: 'white',
    borderEndColor: 'white',
    borderTopColor: 'white'
  },
  FieldTitle:{
    alignSelf:'flex-end',
    marginLeft:10,
    textAlign:'right',
    fontSize:20,
    color:'black',
    fontFamily:'Tajawal_400Regular'
  }
});



