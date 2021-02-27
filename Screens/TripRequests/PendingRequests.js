import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, Image,FlatList,Animated, Dimensions, Linking } from 'react-native';

import colors from '../../Constants/colors';
import { ModalComponent } from '../../Constants/Components/Modal';
import { database, auth } from '../../Configuration/firebase';
import { MaterialCommunityIcons, EvilIcons,  } from '../../Constants/icons';


export default class PendingRequests extends Component {
  constructor(props) {
    super(props);
    this.state ={
    request: [],
    currentRequest:null,
    hasRequest:false

  }}

  componentDidMount = async () =>{
    
    this.retreiveRequests();

    database.collection('users').doc(auth.currentUser.uid).collection('Requests')
    .where("ownerID",'==',auth.currentUser.uid)  .onSnapshot((snapshot) => {
      if(snapshot.empty)
      this.retreiveRequests();

      snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            this.retreiveRequests();
          }
          if (change.type === "modified") {
            this.retreiveRequests();
          }
          if (change.type === "removed") {
            this.retreiveRequests();
          }
      });
    });
 
  }

  

  retreiveRequests = async ()=>{


            console.log('user is borrower')
              database.collection('users').doc(auth.currentUser.uid).collection('Requests')
            .where("borrowerID",'==',auth.currentUser.uid)
            .where('status','in',['pending','accepted',])
            .onSnapshot((querySnapshot)=>{
            if (!querySnapshot.empty){
              let requests = []
              console.log(querySnapshot.size,' Pending Requests found')

                // Object.keys(querySnapshot).map(key=>{
                //   requests.push({
                //     key:key,
                //     ...querySnapshot[key]});
                // })
              querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                //requests.push(doc.id, " => ", doc.data());
                requests.push(doc.data());
                //requests[doc.id] = doc.data();
            });
            this.setState({request: requests, hasRequest:true});
            console.log('array > ', this.state.request)
      } else console.log('No Pending requests found')
            })
  }

  userHasNoRequests = () => {
    return (
      <View style={{ alignSelf: 'center', justifyContent: 'center', marginVertical: 180 }}>
         <MaterialCommunityIcons name={'car-traction-control'} size={150} color={colors.Subtitle} style={{marginHorizontal:100, bottom:30}}/>
        <Text style={styles.emptyTripsText}> لا يوجد لديك رحلة معلقة</Text>

      </View>
    )
  }


  renderRequest = ({ item, index }) => {
    //Status Pending & Waiting for owners reply > 'قيد المراجعة'
   //Status Pending & accepted by owner > 'مقبولة'
  //Status Pending & rejected by owner > 'مرفوضة'
var status=item.status+'';
var button =(<TouchableOpacity style={[styles.Button,{borderColor:colors.Subtitle,borderWidth:1,width:150,marginHorizontal:10, alignSelf:'flex-start'}]}    
onPress={() => {
  this.props.navigation.navigate('RequestDetails', { currentRequest: item })

  }}>
  <Text style={[styles.ButtonText,{color:colors.Subtitle}]}> تفاصيل الطلب  </Text>
  </TouchableOpacity>)

var statusColor =''
  switch (status){
    case 'pending': status='قيد المراجعة' 
    statusColor=colors.Subtitle
   
    break;
    case 'accepted': status='مقبولة' 
    statusColor = colors.Green
    break;
    
    default: status='قيد المراجعة' ;
    statusColor=colors.Subtitle;
  }


    return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        this.props.navigation.navigate('RequestDetails', { currentRequest: item })

      }}
      style={{
        backgroundColor: '#fff',
        width: Dimensions.get('screen').width - 40,
        margin: 12,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        fontFamily: 'Tajawal_400Regular',
        shadowRadius: 6,
        shadowOffset: {
          height: 3,
          width: 0
        },
        borderRadius: 20,
        direction: 'rtl',
        padding: 12,
        alignSelf: 'center'
      }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        <View style={{ padding: 10 }}>
          <View style={styles.inputRow}>
          <Text style={styles.label}>موديل المركبة </Text>
          <Text style={styles.input}> {item.model}</Text>
          </View>
          <View style={styles.inputRow}>
          <Text style={styles.label}> نوع التسليم </Text>
          <Text style={styles.input}> {item.details.pickupOption}</Text>
          </View>
         
          <View style={styles.inputRow}>
          <Text style={styles.label}>حالة الطلب</Text>
        <Text style={[styles.label, {color:statusColor}]}> {status}</Text>
          </View>
        </View>
        <View style={{ width: 120, height: 80 }}>
          <Image source={{ uri: item.image
            }} style={{ width: '100%', height: '100%' }} />
        </View>
      </View>
      <View style={{  alignSelf:'center'}}>
      {button}
      </View>

    </TouchableOpacity>)
     
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.hasRequest  ?
          <FlatList
            data={this.state.request}
            renderItem={this.renderRequest}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ alignItems: 'center' }}
          />  :      this.userHasNoRequests()
        }
        <ModalComponent />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  emptyTripsText: {
    color: colors.Subtitle,
    textAlign:'center',
    fontSize: 25,
    fontFamily: "Tajawal_500Medium"
  },  
  inputRow:{
      flexDirection:'row',
      margin:7,
      justifyContent:'space-evenly'
  },
  
  label:{
      textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20 
      },
  input:
  {textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20 , color:colors.LightBlue, marginHorizontal:5},
  
 Button:{
  shadowColor: '#000',
  shadowOpacity: 0.25,
  shadowRadius: 6,
  shadowOffset: {
    height: 3,
    width: 0 },
  justifyContent:'center',
  alignSelf:'center',
  width: 180,
  height: 40,
  borderRadius: 10,
  color: 'white',
},   
ButtonText:{
  fontFamily:'Tajawal_500Medium',
  fontSize:18,
  alignSelf:'center',
  justifyContent:'center',
},  

});

