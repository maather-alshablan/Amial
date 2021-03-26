import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Animated, Text, View, Alert, TouchableOpacity, Image, FlatList, Dimensions, Linking } from 'react-native';

import colors from '../../Constants/colors';
import { ModalComponent } from '../../Constants/Components/Modal';
import { database, auth } from '../../Configuration/firebase';
import { MaterialCommunityIcons, } from '../../Constants/icons';


export default class PendingRequests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      request: [],
      hasRequest: false,
      currentRequest: null,
      currentBorrower: null,
      isModalVisible: false,

    }
  }

  componentDidMount = () => {

    this.retreiveRequests();

  }


  retreiveRequests = () => {

    // user is a vehicle owner
    console.log('owner type')

    database.collection('users').doc(auth.currentUser.uid).collection('Requests')
      // await database.collection('Trips')
      .where("ownerID", '==', auth.currentUser.uid)
      .where('status', 'in', ['pending', 'accepted',])
      .onSnapshot((querySnapshot) => {
        let requests = []
        if (!querySnapshot.empty) {
          console.log(querySnapshot.size, ' Pending Requests found')

          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //requests.push(doc.id, " => ", doc.data());
            requests.push(doc.data());
            //requests[doc.id] = doc.data();
          });
          this.setState({ request: requests, hasRequest: true });
          console.log('array > ', this.state.request)
        } else {
          console.log('No Pending requests found')
          this.setState({ request: requests, hasRequest: false });
        }
      })

  }


  renderRequest = ({ item, index }) => {
    //Status Pending & Waiting for owners reply >  "ينتظر الرد"'
    //Status Pending & accepted by owner > 'ينتظر التأكيد'
    //Status Pending & rejected by owner > 'لم يتم التأكيد'

    var status = item.status + '';
    var button = (<TouchableOpacity style={[styles.Button, { borderColor: colors.Subtitle, borderWidth: 1, width: 150, marginHorizontal: 10, alignSelf: 'flex-start' }]}
      onPress={() => {
        this.props.navigation.navigate('RequestDetails', { currentRequest: item })

      }}>
      <Text style={[styles.ButtonText, { color: colors.Subtitle }]}> تفاصيل الطلب  </Text>
    </TouchableOpacity>)


    var statusColor = ''
    switch (status) {
      case 'pending': status = "ينتظر الرد"
        statusColor = colors.Subtitle

        break;
      case 'accepted': status = 'ينتظر التأكيد'
        statusColor = colors.Subtitle

        break;
      case 'rejected': status = 'لم يتم التأكيد'
        statusColor = '#fa4353'
        break;
      case 'cancelled': status = 'ملغية'
        statusColor = '#fa4353'
        break;
      default: status = 'معلقة ';
        statusColor = colors.Subtitle;

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
          justifyContent: 'center',
          direction:'rtl',
        }}>
              <View style={{ padding: 10 }}>
            <View style={styles.inputRow}>
              <Text style={styles.label}>موديل المركبة </Text>
              <Text style={[styles.input, { width: 120, flexWrap:'wrap' }]}> {item.model}</Text>
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}> نوع التسليم </Text>
              <Text style={[styles.input, { width: 120, flexWrap:'wrap' }]}> {item.details.pickupOption}</Text>
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.label}>حالة الطلب</Text>
              <Text style={[styles.input, { width: 120, flexWrap:'wrap', color: statusColor }]}> {status}</Text>
            </View>
          </View>
          <View style={{ width: 120, height: 120 }}>
            <Image source={{
              uri: item.image
            }} style={{ width: 100, height: 120, resizeMode:'contain' }}/>
          </View>
        </View>
        <View style={{ alignSelf: 'center' }}>
          {button}
        </View>

      </TouchableOpacity>
      )

  }
  userHasNoRequests = () => {
    return (
      <View style={{ alignSelf: 'center', justifyContent: 'center', marginVertical: 180 }}>

        <MaterialCommunityIcons name={'car-traction-control'} size={150} color={colors.Subtitle} style={{ marginHorizontal: 100, bottom: 30 }} />
        <Text style={styles.emptyTripsText}> لا توجد لديك طلبات معلقة</Text>

      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.hasRequest ?
          <FlatList
            data={this.state.request}
            renderItem={this.renderRequest}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ alignItems: 'center' }}
          /> :
          this.userHasNoRequests()
        }
        {this.state.isModalVisible ? this.showDetails() : <View></View>}

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
    textAlign: 'center',
    fontSize: 25,
    fontFamily: "Tajawal_500Medium"
  },
  Modal: {
    alignSelf: 'center',
    color: '#5dbcd2',
    fontFamily: 'Tajawal_400Regular'
  },
  ModalinputRow: {
    flexDirection: 'column',
    justifyContent: "center"
  },
  ModalTitle: {
    fontFamily: 'Tajawal_500Medium',
    fontSize: 30,
    marginVertical: 30,
    marginLeft: 25,
    color: colors.LightBlue,
    textAlign: 'right'
  },

  ModalLabel:
  {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginHorizontal: 20,
    marginLeft: 150,
    fontSize: 25,
    fontFamily: 'Tajawal_300Light',
  },
  inputRow: {
    flexDirection: 'row',
    margin: 7,
    justifyContent: 'space-evenly'
  },

  label: {
    textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20,marginEnd:10
  },
  input:
    {textAlign:'left' ,justifyContent:'center', fontFamily: 'Tajawal_400Regular', fontSize: 18, color: colors.LightBlue,},

    ModalInput:
  {
    fontFamily: 'Tajawal_400Regular',
    fontSize: 22,
    marginBottom: 5,
    color: colors.LightBlue,
  },
  Button: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: {
      height: 3,
      width: 0
    },
    justifyContent: 'center',
    alignSelf: 'center',
    width: 180,
    height: 40,
    borderRadius: 10,
    color: 'white',
  },
  ButtonText: {
    fontFamily: 'Tajawal_500Medium',
    fontSize: 18,
    alignSelf: 'center',
    justifyContent: 'center',
  },



});



