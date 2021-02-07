import { StatusBar } from 'expo-status-bar';
import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, SafeAreaView, Image, View, Button, ImageBackground, Alert } from 'react-native';
import { auth, firebase } from '../Configuration/firebase';
import Icon from 'react-native-vector-icons/Entypo';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

export default class ForgotPassword extends Component {


  state = {
    email: ''
  }
  handlePasswordReset = async () => {
    const { email } = this.state;

    try {
      await auth.sendPasswordResetEmail(email);
      console.log('Password reset email sent successfully');

      Alert.alert(
        "اعادة تعيين كلمة المرور",
        "تم ارسال رابط اعادة تعيين كلمة المرور",
        [

          { text: "موافق", onPress: () => this.props.navigation.navigate('Login') }
        ],
        { cancelable: false }
      );

    } catch (error) {
      console.log(error)
    }
  };

  render() {
    return (
      <View style={styles.container}>

        <View style={{ marginBottom: 40 }}>
          <Image source={require('../images/resetIcon.png')} />
        </View>

        <View style={styles.InputView}>

          <Icon name='mail' color={'#0093e5'} size={25} />

          <TextInput
            style={styles.InputField}
            placeholder='البريد الإلكتروني'
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />

        </View>


        <TouchableOpacity style={styles.Reset} onPress={() => this.handlePasswordReset()} >
          <Text style={{ color: 'white', fontWeight: '800' }}> إعادة ضبط كلمة المرور</Text>

        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.pop()} >
          <Text style={{ color: 'gray', fontWeight: '500', marginTop: 20 }}>العودة إلى صفحة الدخول</Text>

        </TouchableOpacity>


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
    backgroundColor: '#01b753',
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
    paddingHorizontal: 10,
    textAlign: 'right',
    color: 'black',
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    width: 200,
    borderStartColor: 'white',
    borderEndColor: 'white',
    borderTopColor: 'white'
  },
});



