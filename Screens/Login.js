import { StatusBar } from 'expo-status-bar';
import React , {Component} from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import {firebase} from '../Configuration/firebase'
import Icon from  'react-native-vector-icons/Entypo';
import colors from '../Constants/colors';
import {ModalComponent} from '../Constants/Components/Modal'
import  { showMessage } from "react-native-flash-message";
import { auth } from 'firebase';


export default class Login extends Component {

  state= {
    email: '',
    password:''
  }


  handleSignIn = () =>{
    

    if (this.state.email ==='' || this.state.password =='')
    {
    
    showMessage({
      message: 'يجب تحديد البريد الإلكتروني و كلمة المرور',
      type: 'danger',
      style:{}
    });
    return;
    
  }


    //test account: test@email.com password:123456
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then((userCredential) => {
      console.log('user signed in')
        
      console.log('hi')
      
    })
    .catch((error) => {
      
      showMessage({
        message: 'كلمة المرور او البريد الإلكتروني غير صحيح',
        type: 'danger'
      });
      
    });
  }


  render(){
    return (
      
    <View style={styles.container}>

      <Image 
      source={require('../Constants/Logo/PNGLogo.png')} 
      style={styles.logo}/>
      <View style={{margin:10}}>
      {this.state.errorMessage && <Text style={{ color: 'red' }}>
                        {this.state.errorMessage}</Text>}
                        </View>
      <View style={styles.InputView}>
      {/* <Text>البريد الإلكتروني</Text> */}
      <Icon name='mail' color={'#01b753'} size={30}/>

      <TextInput
      style={styles.InputField}
      placeholder='البريد الإلكتروني'
      onChangeText={email => this.setState({ email })}
      value={this.state.email}
      />
      </View>


      <View style={styles.InputView}>
      {/* <Text style={{color:'#01b753'}}>كلمة المرور </Text> */}
      <Icon name='lock' color={'#01b753'} size={30}/>
      <TextInput
      style={styles.InputField}
      placeholder='كلمة المرور'
      secureTextEntry
      onChangeText={password => this.setState({ password })}
      value={this.state.password}
      />

      </View>
     

      <TouchableOpacity
      onPress={()=> this.props.navigation.navigate('ForgotPassword')}>
            <Text style={{color:'grey',fontFamily:'Tajawal_300Light'}} >
            نسيت كلمة المرور؟</Text>
                </TouchableOpacity>

      <View >
        <TouchableOpacity style={styles.SignInButton} onPress = {() => this.handleSignIn()}>
      <Text style={{color:'white',fontWeight:'600', fontFamily:'Tajawal_700Bold',
}}>تسجيل الدخول</Text>
      </TouchableOpacity>
      </View>
      
                <TouchableOpacity 
                onPress={()=> this.props.navigation.navigate('Registration')}>
                    <Text style={{fontFamily:'Tajawal_700Bold',marginTop:10,textDecorationLine:'underline'}}>
                       سجل كمستخدم جديد؟  </Text>
                </TouchableOpacity>
                <ModalComponent/>
                      <StatusBar style="auto" />

                </View>
  );
  
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  logo:{
    height:200,
    width:350,
    resizeMode:'contain',
    //margin:60,
    marginTop:150
    
  },
  InputView:{
    flexDirection:'row-reverse',
    marginBottom:20,
  },
  InputField:{
   paddingHorizontal: 10,
  textAlign:'right',
  color:'black',
  fontFamily:'Tajawal_400Regular',
  height: 30, 
  borderColor: 'gray',
  borderWidth: 1 ,
  width:250,
  borderStartColor:'white',
  borderEndColor:'white',
  borderTopColor:'white',
  fontSize:20
  },
  SignInButton:{
    backgroundColor:'#01b753',
    justifyContent:'center',
    alignItems:'center',
    margin:10,
    width:150,
    height:30,
    borderRadius:10,
    color:'white'
  }
});

