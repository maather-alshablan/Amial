import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert, ImageBackground, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import DatePicker from 'react-native-datepicker'
import CustomButton from '../components/CustomButton';
import CustomHeader from '../components/CustomHeader';
import Input from '../components/Input';
import { OverLay } from '../components/OverLay';
import { auth, database } from '../Configuration/firebase'
import { ModalComponent } from '../Constants/Components/Modal'
import CryptoES from 'crypto-es';
import { Fontisto, MaterialIcons } from '../Constants/icons';


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
    date: '',
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
          // console.log(doc.data(), doc.id)
          if (doc.id == nationalID) {
            found = true
            this.setState({ name: doc.data().Name });
            obj = doc.data()
          }
          // console.warn(obj)
        });
        console.log({ found })
        if (found) {
          // check birthdate 
          // if (obj.birthdate?.toString() != this.state.date) {
          //   this.failureMessage("عذرا تاريخ الميلاد غير مطابق لرقم الهوية")
          //   return false
          // } else if (obj['Driving License'] != "Active") {
          //   this.failureMessage("عذرا يرجى تجديد الرخصة قبل استكمال عملية التسجيل")
          //   return false
          // }
          return obj
        } else {
          this.failureMessage("عذرا رقم الهوية المدخل غير صحيح")
          return false;
        }


      })
      .catch((error) => {
        console.warn("Error getting documents: ", error);
      });
  }


  checkMobileNumber = (mobileNumber) => {
    var ref = database.collection('users').where('mobileNumber', '==', mobileNumber).get()
      .then((docSnapshot) => {
        if (!docSnapshot.empty)
          // mobile number found thus already exists
          return false;
      });

    return true;
  }

  sendOtp = () => {

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
    if (this.state.nationalID == '' || this.state.mobileNumber == '' || this.state.email == '' || this.state.password == '' || this.state.confirmPassword == '' || this.state.date == '') {
      this.state.formValid = false;
      this.failureMessage(" يرجى ادخال جميع البيانات")
      return;
    }

    if (!(/^\d+$/.test(this.state.nationalID))) { // validate only numbers
      this.state.formValid = false;
      this.failureMessage(" يرجى ادخال رقم هوية مكون من ١٠ خانات ")
      return;

    }

    if (this.state.mobileNumber.length != 10 || !this.state.mobileNumber.startsWith('05')) {
      this.state.formValid = false;
      this.failureMessage("يرجى استخدام رقم جوال صحيح")
      return
    }

    if (this.state.password.length < 8) {
      this.state.formValid = false;
      this.failureMessage("يرجى ادخال كلمة مرور مكونة من ٨ خانات او اكثر")
      return
    }

    //Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
    if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(this.state.password))) {
      this.state.formValid = false;
      this.failureMessage("يرجى ادخال كلمة مرور مكونة من حرف كبير،حرف صغير، ورموز ورقم ")
      return
    }


    if (!this.state.correctEmail) {
      this.failureMessage("يرجى استخدام بريد الكتروني صحيح")
      return
    }

    const check = await this.checkDataBase(this.state.nationalID);
    if (!check) {
      return;
    }

    if (!this.checkMobileNumber(this.state.mobileNumber)) {
      this.failureMessage("عذرا رقم التواصل المدخل مسجل من قبل")
      return;
    }

    this.props.navigation.navigate('OtpScreen', {
      name: check['Name'],
      phoneNumber: check['Phone Number'],
      email: this.state.email,
      password: this.state.password,
      completeRegister: () => {
        this.successfulRegistration()
      }
    })


    if (this.state.errorMessage == '') {

    }
  }

  successfulRegistration = () => {

    this.setState({ loading: true })
    const userid = auth?.currentUser?.uid;
    console.log({ userid })
    database.collection('users').doc(userid).set({
      name: this.state.name,
      email: this.state.email,
      //password: this.state.password,
      mobileNumber: this.state.mobileNumber,
      nationalID: CryptoES.AES.encrypt(this.state.nationalID, userid,).toString(),
      Rating: 0,
      numberofRatings: 0,
      total: 0,
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

            <View
              style={[{
                flexDirection: 'row-reverse',
                marginBottom: 20,
                alignItems: 'center'
              },]}>

              <DatePicker
                style={{ width: 250, }}
                mode="date"
                date={this.state.date}
                placeholder="تاريخ الميلاد"
                format="DD-MM-YYYY"
                minDate="01-01-1945"
                maxDate="01-01-2006"
                confirmBtnText="تاكيد"
                cancelBtnText="الغاء"
                showIcon={true}
                iconComponent={<MaterialIcons name={"date-range"} color={'#01b753'} size={30} style={{ marginLeft: 4 }} />}
                customStyles={{
                  placeholderText: {
                    paddingHorizontal: 10,
                    textAlign: 'center',
                    fontSize: 20,
                    //color: 'grey',
                    fontFamily: "Tajawal_400Regular",
                  },
                  dateInput: {
                    marginLeft: 17,
                    borderColor: "#fff",

                    height: 30,
                    borderBottomColor: 'gray',
                  } // ... You can check the source to find the other keys.
                }}
                onDateChange={(date) => { this.setState({ date: date }) }}

              />
            </View>
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
