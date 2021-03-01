import React, { Component } from "react";
import { StyleSheet, View, Switch, Text ,TouchableOpacity, KeyboardAvoidingView} from "react-native";
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import {firebase} from '../../Configuration/firebase'
import colors from '../../Constants/colors'
import {ModalComponent} from '../../Constants/Components/Modal'
import '../../components/CustomButton'
import  { showMessage, hideMessage } from "react-native-flash-message";
import CustomButton from "../../components/CustomButton";



export default class creditCard extends Component {
  state = {  
    formData:null,
    name:'',
    postalCode:'',
    cvc:'',
    type:'',
    number:'',
    expiry:''
  };

  componentDidMount(){
    console.log('hi')

    this.retrieveBillingAccount();
  }

  _onChange = (formData) => {console.log(JSON.stringify(formData, null, " "))
  console.log(formData.values)
  this.setState({formData:formData.values})}
  _onFocus = (field) => console.log("focusing", field);

  retrieveBillingAccount = async ()=>{
   firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get().then(snapshot=>{

      this.setState({
        formData:snapshot.data().BillingAccount,
         name:snapshot.data().BillingAccount.name,
        postalCode: snapshot.data().BillingAccount.postalCode,
      cvc: snapshot.data().BillingAccount.cvc,
    type: snapshot.data().BillingAccount.type,
  number:snapshot.data().BillingAccount.number,
  expiry: snapshot.data().BillingAccount.expiry
  })

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
  this.setState({addtionalInputsProps:addtionalInputsProps})

console.log(this.state.formData)
    }).catch(error=>{
      console.log('firestore error')
    }) 
  }




  handleSaveInfo= ()=>{
  firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update //collection('BillingAccount').doc(this.state.formData.type)
  ({
    BillingAccount: this.state.formData
  }).catch((error)=>{
    console.log(error)
    showMessage({
      message:  'يرجى محاولة الحفظ مرة أخرى',
      type: 'danger'
    });
  }).then(()=>{
    successMessage= ()=> {
      showMessage({
        message:"تم الحفظ بنجاح",
        type: "success",
      });
    }
  })



  }
  render() {
    return (
      <View style={s.container}>
            <CreditCardInput
              
            //  requiresName
              requiresCVC
              
              //labels={"رقم البطاقة", "تاريخ انتهاء الصلاحية", "CVV"}

              labelStyle={s.label}
              inputStyle={s.input}
              validColor={"black"}
              invalidColor={"red"}
              values= { this.state.number, this.state.expiry, this.state.cvc, this.state.type }
              inputContainerStyle={{alignSelf:'flex-end', marginVertical:10}}
              placeholderColor={"darkgray"}
              allowScroll={false}
              onFocus={this._onFocus}
              onChange={this._onChange}
              
              />
          <View >
        <TouchableOpacity style={s.Button} onPress = {() => this.handleSaveInfo()}>
      {/* <Text style={{color:'white',fontFamily:'Tajawal_400Regular',fontSize:25}}>حفظ </Text> */}
      <CustomButton 
      onPress={() => this.handleSaveInfo()}
      title='حفظ'/>
      </TouchableOpacity>
      </View>
      <ModalComponent/>
      </View>
    );
  }
}

const s = StyleSheet.create({

  container: {
   // marginTop: 60,
   flex:1,
   justifyContent:'center',
  backgroundColor:'white'
  },
  label: {
    color: "black",
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: "black",
  },
  Button:{
    backgroundColor:colors.LightBlue,
    justifyContent:'center',
    alignItems:'center',
    marginTop:80,
    marginHorizontal:130,
    width:150,
    height:30,
    borderRadius:10,
    color:'white'
  }
});