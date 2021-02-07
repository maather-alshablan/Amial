import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Input from '../components/Input';
import { OverLay } from '../components/OverLay';
import { auth, database } from '../Configuration/firebase'
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
    loading: false
  }

  handleSignUp = () => {
    if (this.state.password !== this.state.confirmPassword) {
      this.state.formValid = false;
      alert("يرجى التأكد من مطابقة كلمة المرور")
      return;

    }

    if (this.state.email !== this.state.confirmEmail) {
      this.state.formValid = false;
      alert("يرجى التأكد من مطابقة البريد الإلكتروني ")
      return;

    }

    if (this.state.email === '' && this.state.password === '') {
      this.state.formValid = false;
      alert(" يرجى ادخال جميع البيانات")
      return;

    }
    if (this.state.nationalId == '' || this.state.name == '' || this.state.phone == '' || this.state.email == '' || this.state.confirmEmail == '' || this.state.password == '' || this.state.confirmPassword == '') {
      this.state.formValid = false;
      alert(" يرجى ادخال جميع البيانات")
      return;

    }


    if (this.state.password.length < 8) {
      this.state.formValid = false;

      alert("يرجى ادخال كلمة مرور مكونة من ٨ خانات او اكثر")
      return
    }



    auth.
      createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((response) => {
        this.successfulRegistration()
      })
      .catch(
        (e) => {
          console.warn('successfulRegistration[error]', e)
          alert('يرجى التأكد من ادخال البيانات بالشكل الصحيح')
        })

    if (this.state.errorMessage == '') {

    }
  }

  successfulRegistration = () => {
    this.setState({ loading: true })
    const userid = auth.currentUser.uid;
    database.collection('users').add({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      mobileNumber: this.state.mobileNumber,
      nationalID: this.state.nationalID,
      userid: userid
    }).then(success => {
      this.props.navigation.navigate('Home');
      this.setState({ loading: false })
    }).catch(e => {
      alert('حصل خطأ ما يرجى المحاولة لاحقا')
      this.setState({ loading: false })
      console.warn('error', e);
    })

  }


  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginBottom: 64 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>إنشاء حساب جديد </Text>
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
          onChangeText={(email) => this.setState({ email })}
          iconName={'envelope'}
        />
        <Input
          placeholder="تاكيد البريد الالكتروني"
          value={this.state.confirmEmail}
          onChangeText={(confirmEmail) => this.setState({ confirmEmail })}
          iconName={'envelope'}
        />
        <Input
          placeholder="رقم الجوال"
          value={this.state.mobileNumber}
          onChangeText={(mobileNumber) => this.setState({ mobileNumber })}
          iconName={'phone'}
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
        <TouchableOpacity
          onPress={this.handleSignUp}
          style={{ width: 200, height: 40, borderRadius: 20, backgroundColor: '#01b753', justifyContent: 'center', alignItems: 'center', marginVertical: 16 }}>
          <Text style={{ fontSize: 14, color: '#fff' }}>تسجيل</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 14 }} >مسجل مسبقا؟ <Text style={{ textDecorationLine: 'underline', color: '#01b753' }}
          onPress={() => this.props.navigation.navigate('Login')}
        >تسجيل الدخول</Text></Text>
        {this.state.loading ? <OverLay /> : null}
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
});
