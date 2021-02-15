
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, ScrollView, Image, } from 'react-native';
import colors from '../../Constants/colors';
import Modal from 'react-native-modal';
import {firebase, database} from '../../Configuration/firebase'

import Icon from 'react-native-vector-icons/FontAwesome';
import {EvilIcons , FontAwesome5} from '../../Constants/icons'
import { auth, firestore } from 'firebase';

export default class viewVehicle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      VehicleOwner:false,
      isModalVisible: false,
      calculatedTotalPrice:0,
      sentRequest:false,
    }
  }


  componentDidMount(){

  }

    handleRequest=()=>{


        //create request 
       var tripDocument= database.collection('Trips').doc();

       var requestID= tripDocument.id;
       var vehicleID=0
       var ownerID= 0
       var borrowerID= auth().currentUser.uid;

       var tripRequest = {
           tripID: requestID,
           ownerID: ownerID ,
           borrowerID: borrowerID,
           status:'pending',
           vehicleID: vehicleID,
           details:{
               pickupDate:'',
               dropoffDate:'',
               pickupOption:'',
               pickUplocation:''
           },
           totalAmount:this.state.calculatedTotalPrice,
       }
        //send to firestore
        var batch = database.batch();

        var trip = database.collection('Trips').doc(requestID); 
        batch.set(trip,tripRequest);

        var ownerRequests = database.collection('users').doc(ownerID).collection('Requests').doc(requestID);
        batch.set(ownerRequests,tripRequest);

        var borrowerRequests = database.collection('users').doc(borrowerID).collection('Requests').doc(requestID);
        batch.set(borrowerRequests,tripRequest);

        batch.commit().then(()=>

        // on success
        this.setState({sentRequest:true}) )


    }
    
      toggleModal = () => {
          this.setState({isModalVisible: !this.state.isModalVisible});
        };
   

    successfulRequest = () =>{
        return(
            <View style={{flexDirection:'column', alignSelf:'center' ,justifyContent:'center'}}>

                <View style={{alignSelf:'center',marginVertical:150}}>
                <FontAwesome5 name={'check-circle'} size={80} color={'green'} style={{alignSelf:'center',marginVertical:15}}/>
                <Text style={styles.successfulRequestText} >تم إرسال الطلب بنجاح</Text>
                </View>
            </View>
        )
    }

    requestVehicleModal= ()=>{
        return(
                < View >
          <TouchableOpacity style={styles.Button} onPress={()=> this.setState({isModalVisible:true}) }>
          <Text style={styles.RequestButtonText}> حجز </Text>

          </TouchableOpacity>
          <Modal 
        onBackdropPress={() => this.toggleModal()}
        onSwipeComplete={() => this.toggleModal()}
        swipeDirection='down'
          isVisible={this.state.isModalVisible}
          style={styles.Modal}
          >
          <View style={{
      height: '55%',
      width:400,
      marginTop: 'auto',
      backgroundColor:'white' }}>
                    <EvilIcons name={'close'} size={35} style={{position:'absolute', top:15, left:20}} onPress={()=>this.toggleModal()}/>

<View style={{ alignSelf:'center',justifyContent:"center"}}>
            

            {this.state.sentRequest ? this.successfulRequest() : <View>
            <Text style={styles.requestModalTitle}>طلب حجز المركبة</Text>

            <Text style={styles.requestModalLabel}>التواريخ المتاحة </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' ,alignSelf:'flex-end', marginHorizontal:30  }}>
            {['2020-2-12', '2020-2-12', '2020-2-12',].map(availability => {
              return (<TouchableOpacity style={{ margin: 5 , padding: 10, borderColor: 'black', borderRadius: 2, borderWidth: 1, color: '#5dbcd2', }} >
                <Text style={styles.OptionsText}>{availability}</Text>
              </TouchableOpacity>)
            })}
          </View>

            <Text style={styles.requestModalLabel}>نوع الإستلام </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignSelf:'flex-end', marginHorizontal:30 }}>
            {[ 'توصيل', 'من الموقع',].map(availability => {
              return (<TouchableOpacity style={{  margin:5 ,padding: 10, borderColor: 'black', borderRadius: 2, borderWidth: 1, color: '#5dbcd2',justifyContent:'space-between' }} >
               <Text 
               style={styles.OptionsText}> {availability}</Text>
               
              </TouchableOpacity>)
            })}
          </View>
            <Text style={[styles.requestModalLabel, {fontSize:20, }]}>المجموع</Text>
            <Text style={[styles.requestModalLabel, {fontSize:25, fontFamily:'Tajawal_500Medium',bottom:20}]}> {this.state.calculatedTotalPrice} ريال</Text>
            <TouchableOpacity style={styles.Button} onPress={()=> this.setState({isModalVisible:true}) }>
          <Text style={styles.RequestButtonText} 
            onPress={ ()=> { 
                 //this.handleRequest()}
                this.setState({sentRequest:true})}}
              > إرسال الطلب </Text>
          </TouchableOpacity>
           
          </View>}
            </View> 
            </View>
            </Modal>
        </View>
         ) }


  renderCell = (data = {}) => {
    return (
      <View
        style={{
          padding: 12, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 20, margin: 4,
          shadowColor: '#000',
          shadowOpacity: 0.12,
          fontFamily: 'Tajawal_400Regular',
          shadowRadius: 6,
          shadowOffset: {
            height: 3,
            width: 0
          }
        }}>
        {data.icon && data.icon != "" ? <Icon name={data.icon} color={'#01b753'} size={18} style={{ marginRight: 8 }} /> : <Text style={{ fontSize: 16, textAlign: 'left', fontFamily: 'Tajawal_400Regular' }}>{data.name} : </Text>}
        <Text style={{ fontSize: 14, textAlign: 'left', color: '#5dbcd2', fontFamily: 'Tajawal_400Regular' }}>{data.value}</Text>
      </View>
    )
  }

  renderVehicleDetails = () => {
    const features = [];
    for (let i = 0; i < 4; i += 2) {
      features.push(<View style={{ flexDirection: 'row' }}>
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>

          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#5dbcd2', marginRight: 8, }}></View>
          <Text style={{ fontSize: 14, color: 'grey', fontFamily: 'Tajawal_400Regular' }}>الخاصية {i + 1}</Text>
        </View>
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#5dbcd2', marginRight: 8 }}></View>
          <Text style={{ fontSize: 14, color: 'grey', fontFamily: 'Tajawal_400Regular' }}>الخاصية {i + 2}</Text>
        </View>
      </View>)
    }
    return (<View style={{ direction: 'rtl' }}>
      <View style={{ height: 160, width: '100%' }}>
        <Image source={{ uri: 'https://www.pngitem.com/pimgs/m/609-6094088_2020-x4m-sav-bmw-x4-hd-png-download.png' }}
          style={{ width: '100%', height: '100%' }} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 3, marginTop: 5, fontFamily: 'Tajawal_400Regular', }}>
        <Icon name={"star"} color={'#FFD700'} size={25} />
        <Icon name={"star"} color={'#FFD700'} size={25} />
        <Icon name={"star"} color={'#FFD700'} size={25} />
        <Icon name={"star"} color={'#FFD700'} size={25} />
        <Icon name={"star"} color={'#FFD700'} size={25} />
      </View>
      <Text style={{ fontSize: 18, textAlign: 'center', marginVertical: 8, color: '#5dbcd2', fontFamily: 'Tajawal_400Regular' }}> ابتداءً من 40 ريال / يوم</Text>
      <View style={{ flexDirection: 'row', marginHorizontal: 4, fontFamily: 'Tajawal_400Regular' }}>
        {this.renderCell({ name: 'موديل المركبة', value: 'BMW', })}
        {this.renderCell({ name: 'سنة الصنع', value: '2020' })}
      </View>
      <View style={{ flexDirection: 'row', marginHorizontal: 4, fontFamily: 'Tajawal_400Regular' }}>
        {this.renderCell({ name: 'نوع المركبة', value: 'كبيرة' })}
        {this.renderCell({ name: 'الجير', value: 'اوتوماتيك' })}
      </View>
      <View style={{ flexDirection: 'row', }}>
        <View style={{ padding: 12, flex: 0.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 20, margin: 4, borderLeftColor: '#F0EEF0', borderLeftWidth: 1 }}>
        </View>
        {this.renderCell({ name: 'تامين المركبة', value: "شامل" })}
        <View style={{ padding: 12, flex: 0.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 20, margin: 4, borderLeftColor: '#F0EEF0', borderLeftWidth: 1 }}>
        </View>
      </View>
      <View style={{
        padding: 12, backgroundColor: '#fff', borderRadius: 20, margin: 8, shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 6,
        shadowOffset: {
          height: 3,
          width: 0
        }
      }}>
        <Text style={{ fontSize: 16, textAlign: 'left', marginBottom: 12, fontFamily: 'Tajawal_400Regular' }}>خصائص المركبة</Text>
        {features}
      </View>
      <View style={{ padding: 12, }}>
        <Text style={{ fontSize: 16, textAlign: 'left', marginBottom: 12, fontFamily: 'Tajawal_400Regular' }}>وصف المركبة</Text>
        <Text style={{ fontSize: 14, textAlign: 'left', color: '#5dbcd2', fontFamily: 'Tajawal_400Regular' }}>مركبة سريعة ورائعة جدا</Text>
      </View>

      <View style={{ flexDirection: 'row', }}>
        {this.renderCell({ name: 'منطقة المركبة', value: "الرياض" })}
        {this.renderCell({ name: "نوع الإستلام", value: "من الموقع" })}
      </View>


      <View style={{ padding: 12, }}>
        <Text style={{ fontSize: 16, textAlign: 'left', marginBottom: 12, fontFamily: 'Tajawal_400Regular' }}>تفاصيل الحجز </Text>
        <View style={{ marginBottom: 7 }}>
          <Text style={{ textAlign: 'left', marginBottom: 8, color: '#5dbcd2', fontFamily: 'Tajawal_400Regular' }} >التواقيت المتاحة للطلب</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {['2020-2-12', '2020-2-12', '2020-2-12',].map(availability => {
              return (<View style={{ margin: 2, padding: 8, borderColor: 'black', borderRadius: 2, borderWidth: 1, color: '#5dbcd2', }} >
                <Text>{availability}</Text>
              </View>)
            })}
          </View>
        </View>

      </View>
      {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
<Icon name={"star"} color={'yellow'} size={25} />
<Icon name={"star"} color={'yellow'} size={25} />
<Icon name={"star"} color={'yellow'} size={25} />
<Icon name={"star"} color={'yellow'} size={25} />
<Icon name={"star"} color={'yellow'} size={25} />
</View>
<View style={{ marginBottom: 8 }}>
<Text style={{ fontSize: 18, textAlign: 'center' }}>40 ريال / يوم</Text>
</View> */}

    </View>)
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{ backgroundColor: '#F0EEF0' }}>

          {this.renderVehicleDetails()}
     {this.state.VehicleOwner ? <View></View> :
        this.requestVehicleModal()}
        </ScrollView>

      </View>

    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      fontFamily: 'Tajawal_400Regular',

    },Button:{
        backgroundColor: colors.LightBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 140,
        marginBottom:5,
        width: 150,
        height: 30,
        borderRadius: 10,
        color: 'white',
        fontFamily: 'Tajawal_400Regular',
    },
    RequestButtonText:{
        color:'white',
        fontFamily:'Tajawal_400Regular',
        fontSize:20,
        justifyContent:'center',
        padding:5

    },
    OptionsText:{
        fontFamily:'Tajawal_300Light',
        fontSize:18
    },


        Modal:{
           // backgroundColor:'white',
           alignSelf:'center',
           borderTopEndRadius:120,
            color: '#5dbcd2',
            fontFamily: 'Tajawal_400Regular'
        },
        requestModalTitle:{
            fontFamily:'Tajawal_500Medium',
            fontSize:30,
            marginTop:25,
            marginHorizontal:30,
            color:colors.LightBlue,
            alignSelf:'flex-end'},

        requestModalLabel:
            {
            alignSelf:'flex-end',
            marginVertical:20,
            marginHorizontal:30,
            marginLeft:150,
            fontSize:25,
            fontFamily:'Tajawal_300Light',
            },
        successfulRequestText:{
            fontSize:25,
            fontFamily:'Tajawal_500Medium'
        }})

