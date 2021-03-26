import React, { Component } from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import CryptoES from 'crypto-es';

import { firebase } from '../../Configuration/firebase'
import colors from '../../Constants/colors'
import { ModalComponent } from '../../Constants/Components/Modal'
import '../../components/CustomButton'
import { showMessage, hideMessage } from "react-native-flash-message";
import CustomButton from "../../components/CustomButton";



export default class creditCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: null,
      cvc: '',
      type: '',
      number: '',
      expiry: '',
      amount: props?.route?.params?.amount,
      creditCardData: null
    };

  }

  componentDidMount() {

    var cipher = CryptoES.AES.encrypt("Message234", firebase.auth().currentUser.uid,)
    console.log('ciphering  > ', cipher.toString())
    var decrypt = CryptoES.AES.decrypt(cipher, firebase.auth().currentUser.uid,)

    console.log('decrypting> ', decrypt.toString(CryptoES.enc.Utf8))

    this.retrieveBillingAccount();
  }

  _onChange = (formData) => {
    console.log(JSON.stringify(formData, null, " "))
    console.log(formData.values)
    var cvvEncrypted = CryptoES.AES.encrypt(formData.values.cvc, firebase.auth().currentUser.uid,)
    var numberEncrypted = CryptoES.AES.encrypt(formData.values.number, firebase.auth().currentUser.uid,)
    var creditCard = {
      CVV: cvvEncrypted.toString(),
      number: numberEncrypted.toString(),
      expiry: formData.values.expiry,
      type: formData.values.type
    }
    this.setState({
      formData: creditCard,
      creditCardData: formData.values
    })
    console.log(creditCard)
  }

  _onFocus = (field) => console.log("focusing", field);

  retrieveBillingAccount = async () => {
    var ref = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get();
    if (ref.exists)
      if (ref.data().BillingAccount != null) {
        var addtionalInputsProps = {
          name: {
            defaultValue: this.state.name,
            maxLength: 40,
          },
          cvc: {
            defaultValue: this.state.cvc
          },
          expiry: {
            defaultValue: this.state.expiry
          },
          number: {
            defaultValue: this.state.number
          },
          type: {
            defaultValue: this.state.type
          },
        };
        this.setState({
          formData: ref.data().BillingAccount,
          cvc: ref.data().BillingAccount.cvc,
          type: ref.data().BillingAccount.type,
          number: ref.data().BillingAccount.number,
          expiry: ref.data().BillingAccount.expiry,
          addtionalInputsProps: addtionalInputsProps
        });

        console.log(this.state.formData)
        console.log(CryptoES.AES.decrypt(this.state.formData.CVV, firebase.auth().currentUser.uid,).toString(CryptoES.enc.Utf8))

      }

  }




  handleSaveInfo = () => {

    firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update //collection('BillingAccount').doc(this.state.formData.type)
      ({
        BillingAccount: this.state.formData
      }).then(() => {
        showMessage({
          message: "تم الحفظ بنجاح",
          type: "success",
        });
      }).catch((error) => {
        console.log(error)
        showMessage({
          message: 'يرجى محاولة الحفظ مرة أخرى',
          type: 'danger'
        });
      })
  }


  createPayment = () => {
    const amountUS = parseInt(this.state.amount * 27)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic c2tfdGVzdF81MUlZdzQ1RWZ0NDdSdlUxdnQwc1Y2ODR3YXZPS2Vhb3dJa2JyMDJQR0dGQTg4Vng4eHRZRU9Zbk5EbTBCTWJxZzBnbWlpT1dMa3dpdDRQY1Iwc3pMQzkzdDAwM0Y0TDlldjk6");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const obj = {
      amount: amountUS,
      currency: 'usd',
      "payment_method_types[]": "card"
    }

    const formBody = Object.keys(obj).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])).join('&');

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formBody,
      redirect: 'follow'
    };
    let self = this
    fetch("https://api.stripe.com/v1/payment_intents", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.warn(result, "====result")
        if (result.error) {
          showMessage({
            message: 'حصل خطأ ما يرجى المحاولة لاحقا',
            type: 'danger'
          });
        } else {

          self.addPaymentMethod(result.id)
        }
      })
      .catch(error => console.log('error', error));
  }

  addPaymentMethod = (payment_intent_id = "") => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic c2tfdGVzdF81MUlZdzQ1RWZ0NDdSdlUxdnQwc1Y2ODR3YXZPS2Vhb3dJa2JyMDJQR0dGQTg4Vng4eHRZRU9Zbk5EbTBCTWJxZzBnbWlpT1dMa3dpdDRQY1Iwc3pMQzkzdDAwM0Y0TDlldjk6");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    const ex = this.state.creditCardData?.expiry?.split("/")
    const cardnum = this.state.creditCardData?.number?.split(" ").join("")
    console.warn(cardnum)
    const obj = {
      "type": "card",
      "card[number]": this.state.creditCardData?.number?.split(" ").join(""),
      "card[exp_month]": ex[0],
      "card[exp_year]": ex[1],
      "card[cvc]": this.state.creditCardData?.cvc,
    }

    const formBody = Object.keys(obj).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])).join('&');

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formBody,
      redirect: 'follow'
    };
    let self = this
    fetch("https://api.stripe.com/v1/payment_methods", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.error) {
          showMessage({
            message: 'حصل خطأ ما يرجى المحاولة لاحقا',
            type: 'danger'
          });
        } else {
          console.warn(result, "rrrrr")
          self.completePayment(payment_intent_id, result.id)
        }
      })
      .catch(error => console.log('error', error));
  }

  completePayment = (payment_intent_id = "", payment_method_id = "") => {
    console.warn({ payment_intent_id, payment_method_id })
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic c2tfdGVzdF81MUlZdzQ1RWZ0NDdSdlUxdnQwc1Y2ODR3YXZPS2Vhb3dJa2JyMDJQR0dGQTg4Vng4eHRZRU9Zbk5EbTBCTWJxZzBnbWlpT1dMa3dpdDRQY1Iwc3pMQzkzdDAwM0Y0TDlldjk6");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("payment_method",);

    const obj = {
      "payment_method": payment_method_id,
    }

    const formBody = Object.keys(obj).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])).join('&');

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formBody,
      redirect: 'follow'
    };

    fetch(`https://api.stripe.com/v1/payment_intents/${payment_intent_id}/confirm`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.error) {
          showMessage({
            message: 'حصل خطأ ما يرجى المحاولة لاحقا',
            type: 'danger'
          });
        } else {
          console.warn(result)
          this.props?.route?.params?.handleConfirmRequest()
          this.props.navigation.pop();
        }
      })
      .catch(error => console.log('error', error));
  }
  payment = async () => {
    this.createPayment()
  }
  render() {
    console.warn(this.state.creditCardData, "===exxx")
    return (
      <DismissKeyboard>
        <View style={s.container}>
          <KeyboardAvoidingView >
            <CreditCardInput

              //  requiresName
              requiresCVC

              //labels={"رقم البطاقة", "تاريخ انتهاء الصلاحية", "CVV"}

              labelStyle={s.label}
              inputStyle={s.input}
              validColor={"black"}
              invalidColor={"red"}
              values={this.state.number, this.state.expiry, this.state.cvc, this.state.type}
              inputContainerStyle={{ alignSelf: 'flex-end', marginVertical: 10 }}
              placeholderColor={"darkgray"}
              allowScroll={false}
              onFocus={this._onFocus}
              onChange={this._onChange}


            />
          </KeyboardAvoidingView>
          <View >
            {/* <Text style={{color:'white',fontFamily:'Tajawal_400Regular',fontSize:25}}>حفظ </Text> */}
            <CustomButton
              onPress={() => {
                if (this.state.amount) {
                  this.payment()
                } else {
                  this.handleSaveInfo()
                }

              }}
              title={this.state.amount ? 'ادفع ' + this.state.amount + "ريال" : 'حفظ'} />
          </View>
          <ModalComponent />
        </View>
      </DismissKeyboard>
    );
  }
}

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const s = StyleSheet.create({

  container: {
    // marginTop: 60,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  label: {
    color: "black",
    // width: 150,
    textAlign: 'left',
    fontSize: 20,
    fontFamily: 'Tajawal_400Regular',

  },
  input: {
    fontSize: 18,
    // width: 150,
    textAlign: 'left',
    color: "black",
    fontFamily: 'Tajawal_400Regular'
  },
  Button: {
    backgroundColor: colors.LightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    marginHorizontal: 130,
    paddingHorizontal: 16,
    minWidth: 150,
    height: 30,
    borderRadius: 10,
    color: 'white'
  }
}); 