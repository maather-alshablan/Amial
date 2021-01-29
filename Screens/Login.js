import { StatusBar } from 'expo-status-bar';
import React , {Component} from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import {firebase} from '../Configuration/firebase'
import { log, color } from 'react-native-reanimated';
import Icon from  'react-native-vector-icons/Entypo';

export default class Login extends Component {

  state= {
    email: '',
    password:'',
    error:null
  }


  handleSignIn = () =>{
    //testing navigation
      //  this.props.navigation.navigate('MainNavigation');
      console.log('hi')
    //test account: test@email.com password:123456
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then((userCredential) => {
      console.log('user signed in')
      // Signed in 
      // var user = userCredential.user;
      // this.props.navigation.navigate('MainNavigation');
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error)
      // ..
    });
  }


  render(){
    return (
      
    <View style={styles.container}>

      <Image 
      source={require('../Constants/PNGLogo.png')} 
      style={styles.logo}/>

      <View style={styles.InputView}>
      {/* <Text>البريد الإلكتروني</Text> */}
      <Icon name='mail' color={'#01b753'} size={25}/>

      <TextInput
      style={styles.InputField}
      placeholder='البريد الإلكتروني'
      onChangeText={email => this.setState({ email })}
      value={this.state.email}
      />
      </View>


      <View style={styles.InputView}>
      {/* <Text style={{color:'#01b753'}}>كلمة المرور </Text> */}
      <Icon name='lock' color={'#01b753'} size={25}/>
      <TextInput
      style={styles.InputField}
      placeholder='كلمة المرور'
      secureTextEntry
      onChangeText={password => this.setState({ password })}
      value={this.state.password}
      />

      </View>
      <StatusBar style="auto" />

     

      <TouchableOpacity
      onPress={()=> this.props.navigation.navigate('ForgotPassword')}>
            <Text style={{color:'grey'}} >
            نسيت كلمة المرور؟</Text>
                </TouchableOpacity>

      <View >
        <TouchableOpacity style={styles.SignInButton} onPress = {() => this.handleSignIn()}>
      <Text style={{color:'white',fontWeight:'600'}}>تسجيل الدخول</Text>
      </TouchableOpacity>
      </View>
      
                <TouchableOpacity 
                onPress={()=> this.props.navigation.navigate('Registration')}>
                    <Text>
                       سجل كمستخدم جديد؟  </Text>
                </TouchableOpacity>
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
    margin:60,
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
  height: 30, 
  borderColor: 'gray',
  borderWidth: 1 ,
  width:200,
  borderStartColor:'white',
  borderEndColor:'white',
  borderTopColor:'white'
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

