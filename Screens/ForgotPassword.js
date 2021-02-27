import { StatusBar } from 'expo-status-bar';
import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, SafeAreaView, Image, View, Button, ImageBackground, Alert } from 'react-native';
import { auth, firebase } from '../Configuration/firebase';
import Icon from 'react-native-vector-icons/Entypo';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import CustomButton from '../components/CustomButton';

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
      <ImageBackground
        source={require('../images/b2.png')}
        style={{ width: '100%', height: '100%' }}
      >
        <View style={styles.container}>

          <View style={{ marginBottom: 40 }}>
            <Image source={require('../images/resetIcon.png')} style={{ width: 200, height: 200, resizeMode: "contain" }} />
          </View>

          <View style={styles.InputView}>

            <Icon name='mail' color={'#01b753'} size={30} />

            <TextInput
              style={styles.InputField}
              placeholder='البريد الإلكتروني'
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
            />

          </View>

          <CustomButton
            onPress={() => this.handlePasswordReset()}
            title="إعادة ضبط كلمة المرور"
            style={{}}
          />

          <TouchableOpacity onPress={() => this.props.navigation.pop()} >
            <Text style={{ color: 'gray', marginTop: 20, fontSize: 18, fontFamily: 'Tajawal_300Light', }}>العودة إلى صفحة الدخول</Text>
            <View style={{ height: 1, width: '100%', backgroundColor: 'gray' }}></View>
          </TouchableOpacity>


        </View>
      </ImageBackground>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 120
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
    fontFamily: 'Tajawal_400Regular',
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    width: 250,
    borderStartColor: 'white',
    borderEndColor: 'white',
    borderTopColor: 'white',
    fontSize: 20
  },
});



