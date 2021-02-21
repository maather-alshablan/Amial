import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image,FlatList, Dimensions, Linking } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import colors from '../../Constants/colors';
import { ModalComponent } from '../../Constants/Components/Modal';
import { database, auth } from '../../Configuration/firebase';


export default class PendingRequests extends Component {
  constructor(props) {
    super(props);
    this.state ={
    request: [],
    hasRequest:false

  }}

  componentDidMount = async () =>{
    
    this.retreiveRequests();
  }


  retreiveRequests = async ()=>{
  
    // user is a vehicle owner
      console.log('owner type')

        await database.collection('Trips')
      .where("ownerID",'==',auth.currentUser.uid)
      .where('status','==','pending')
      .get().then((querySnapshot)=>{
      if (!querySnapshot.empty){
        let requests = []
        console.log(querySnapshot.size,' Pending Requests found')

        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          requests.push(doc.data());
      });
      this.setState({request: requests,hasRequest:true});
      console.log('array > ', this.state.request)
      } else console.log('No Active requests found')
      })
          
  }


  renderRequest = () => {
    
   
    return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        // navigate to view
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
          <Text style={styles.label}>نوع المركبة BMW</Text>
          <Text style={styles.label}>نوع التسليم 
          {/* {vehicle.details.pickupOption} */}
          </Text>
          <Text style={styles.label}>اسم المستأجر  Faisal</Text>
          <Text style={styles.label}>الحالة  لم يتم الدفع</Text>
        </View>
        <View style={{ width: 120, height: 80 }}>
          <Image source={{ uri: 'https://pngimg.com/uploads/maserati/maserati_PNG81.png'
            // vehicle.image 
            }} style={{ width: '100%', height: '100%' }} />
        </View>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => {
            const phone = "05555555"
            Linking.canOpenURL('https://api.whatsapp.com/send?' + 'phone=' + phone)
              .then(supported => {
                if (!supported) {
                  showMessage({
                    message: 'يرجى تنزيل برنامج الواتس اب',
                    type: 'danger',
                    style: {}
                  });
                } else {
                  return Linking.openURL('https://api.whatsapp.com/send?' + 'phone=' + phone).catch(e => console.warn(e));
                }
              })
          }}
          style={{ padding: 8, borderRadius: 6, borderColor: '#3fc250', borderWidth: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: 'https://img.icons8.com/color/452/whatsapp--v1.png' }} style={{ width: 24, height: 24 }} />
          <Text style={{ marginLeft: 8, fontFamily: 'Tajawal_400Regular',  }}>تواصل مع المستأجر</Text>
        </TouchableOpacity>
      </View>

    </TouchableOpacity>)
     
  }
  userHasNoRequests = () => {
    return (
      <View style={{ alignSelf: 'center', justifyContent: 'center', marginVertical: 280 }}>
   
   <MaterialCommunityIcons name={'car-traction-control'} size={150} color={colors.Subtitle} style={{marginHorizontal:100, bottom:30}}/>
        <Text style={styles.emptyTripsText}> لا توجد لديك رحلات معلقة</Text>

      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.hasRequest  ?
          <FlatList
            data={this.state.request}
            renderItem={this.renderRequest}
            contentContainerStyle={{ alignItems: 'center' }}
           /> :  
          this.userHasNoRequests()
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
  label:{
     textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20 
  },
  input:{textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20 , color:colors.LightBlue}

});

