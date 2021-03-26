import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert, ImageBackground  , Keyboard,TouchableWithoutFeedback} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import CustomButton from '../components/CustomButton';
import CustomHeader from '../components/CustomHeader';
import Input from '../components/Input';
import { OverLay } from '../components/OverLay';
import { auth, database } from '../Configuration/firebase'
import { ModalComponent } from '../Constants/Components/Modal'
import CryptoES from 'crypto-es';


export default class Registration extends Component {

  state = {
    name: '',
    nationalID: '',
    email: '',
    mobileNumber: '',
    confirmEmail: '',
    DoB: '',
    password: '',
    confirmPassword: '',
    loading: false,
    correctEmail: false
  }

  checkDataBase = (nationalID) => {
    return database.collection('DataSets')
      .get()
      .then((querySnapshot) => {
        let found = false;
        let obj = null;
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots

          if (doc.id == nationalID) {
            found = true
            obj = doc.data()
          }
          // console.warn(obj)
        });

        if (found) {
          return true
        } else {
          return false;
        }
        console.warn('eeee');
      })
      .catch((error) => {
        console.warn("Error getting documents: ", error);
      });
  }
  handleSignUp = async () => {

    if (this.state.password !== this.state.confirmPassword) {
      this.state.formValid = false;

      this.failureMessage("يرجى التأكد من مطابقة كلمة المرور")
      return;

    }


    if (this.state.email === '' && this.state.password === '') {
      this.state.formValid = false;
      this.failureMessage(" يرجى ادخال جميع البيانات")
      return;

    }
    if (this.state.nationalID == '' || this.state.name == '' || this.state.mobileNumber == '' || this.state.email == '' || this.state.password == '' || this.state.confirmPassword == '') {
      this.state.formValid = false;
      this.failureMessage(" يرجى ادخال جميع البيانات")
      return;

    }

    if (this.state.mobileNumber.length != 10) {
      this.state.formValid = false;

      this.failureMessage("يرجى استخدام رقم جوال صحيح")
      return
    }

    if (this.state.password.length < 8) {
      this.state.formValid = false;

      this.failureMessage("يرجى ادخال كلمة مرور مكونة من ٨ خانات او اكثر")
      return
    }

    if (!this.state.correctEmail) {
      this.failureMessage("يرجى استخدام بريد الكتروني صحيح")
      return
    }
    const check = await this.checkDataBase(this.state.nationalID);
    if (!check) {
      this.failureMessage("عذرا رقم الهوية المدخل غير صحيح")
      return;
    }

    auth.
      createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((response) => {
        this.successfulRegistration()
      })
      .catch(
        (e) => {
          console.warn('successfulRegistration[error]', e)
          this.failureMessage('يرجى التأكد من ادخال البيانات بالشكل الصحيح')
        })

    if (this.state.errorMessage == '') {

    }
  }

  successfulRegistration = () => {
    this.setState({ loading: true })
    const userid = auth.currentUser.uid;
    database.collection('users').doc(userid).set({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      mobileNumber: this.state.mobileNumber,
      nationalID: CryptoES.AES.encrypt(this.state.nationalID, firebase.auth().currentUser.uid,).toString(),
      Rating: 0,
      numberofRatings:0,
      totalBalance:0,
    }).then(success => {
      this.setState({ loading: false })
    }).catch(e => {
      this.failureMessage('حصل خطأ ما يرجى المحاولة لاحقا')
      this.setState({ loading: false })
      console.warn('error', e);
    })

  }

  successMessage = () => {
    showMessage({
      message: "تم الحفظ بنجاح",
      type: "success",
    });
  }


  failureMessage = (message) => {
    showMessage({
      message: message,
      type: 'danger'
    });
  }

  render() {
    return (
      <DismissKeyboard >
      <ImageBackground
        source={require('../images/b2.png')}
        style={{ width: '100%', height: '100%' }}
      >
        <View style={styles.container}>
          <View style={{ marginBottom: 100, marginTop: 20 }}>
            <CustomHeader
              subTitle="إنشاء حساب جديد"
            />
          </View>
          <Input
            placeholder="رقم الهوية / الاقامة"
            value={this.state.nationalID}
            onChangeText={(nationalID) => this.setState({ nationalID })}
            iconName={'flag'}
          />
          <Input
            placeholder="الاسم الرباعي"
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
            iconName={'user'}
          />
          <Input
            placeholder="البريد الالكتروني"
            value={this.state.email}
            onChangeText={(email) => {

              var regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
              var matches = regex.exec(email);
              if (matches && matches.length > 0) {
                this.setState({ correctEmail: true });
              } else {
                this.setState({ correctEmail: false });
              }
              this.setState({ email })
            }}
            iconName={'envelope'}
          />
          <Input
            placeholder="رقم الجوال"
            value={this.state.mobileNumber}
            onChangeText={(mobileNumber) => this.setState({ mobileNumber })}
            iconName={'phone'}
            keyboardType={"phone-pad"}
            returnKeyType={'done'}
          />
          <Input
            placeholder="كلمة المرور"
            value={this.state.password}
            onChangeText={(password) => this.setState({ password })}
            iconName={'lock'}
            secureTextEntry={true}

          />
          <Input
            placeholder="تاكيد كلمة المرور"
            value={this.state.confirmPassword}
            onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
            iconName={'lock'}
            secureTextEntry={true}
          />
          <CustomButton
            onPress={this.handleSignUp}
            title='تســجــيـــــل'
            style={{ marginTop: 32, marginBottom: 16 }}
          />

          <Text style={{ fontSize: 14 }} >مسجل مسبقا؟ <Text style={{ textDecorationLine: 'underline', color: '#01b753' }}
            onPress={() => this.props.navigation.navigate('Login')}
          >تسجيل الدخول</Text></Text>
          {this.state.loading ? <OverLay /> : null}
        </View>

      </ImageBackground>
      </DismissKeyboard>
    );

  }
}
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100
  },
});
