
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, ScrollView, Image, } from 'react-native';
import colors from '../../Constants/colors';
import Modal from 'react-native-modal';
import { firebase, database } from '../../Configuration/firebase'
import { Rating, AirbnbRating, } from 'react-native-ratings';
import Icon from 'react-native-vector-icons/FontAwesome';
import { EvilIcons, FontAwesome5, MaterialIcons } from '../../Constants/icons'
import { auth, } from 'firebase';
import { showMessage, hideMessage } from "react-native-flash-message";
import CustomButton from '../../components/CustomButton';



export default class viewVehicle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      VehicleOwner: null,
      vehicleID: props?.route?.params?.vehicleID,
      ownerID: '',
      vehicleDetails: {},
      availability: [],
      features: [],
      address: {},
      Rating: 0,
      InsurancePolicy: {},
      isModalVisible: false,
      calculatedTotalPrice: 0,
      sentRequest: false,
      failedRequest: false,
      selectedPickUp: [],
      selectedItems: [],
      selectedDates: [],

    }
  }


  async componentDidMount() {

    await this.retrieveVehicle();
    this.setHeader();
  }

  setHeader = () => {

    var model = this.state.vehicleDetails.model + '';
    model = model.toUpperCase();

    const ViewVehicleHeader = () => {
      return (
        <View >
          <Text style={{ fontSize: 35, color: '#5dbcd2', fontFamily: 'Tajawal_400Regular', }}>
            {model} {this.state.vehicleDetails.year}
          </Text>
        </View>
      )
    }
    this.props.navigation.setOptions({
      headerTitle: (props) => <ViewVehicleHeader {...props} />
    })
  }


  IsVehicleOwner = (user) => {


    if (user == auth().currentUser.uid) {
      console.log('User is owner of vehicle')
      this.state.VehicleOwner = true;
    } else {
      this.state.VehicleOwner = false;

    }
  }

  successMessage = (message) => {
    showMessage({
      message: message,
      type: "success",
    });
  }


  failureMessage = (message) => {
    showMessage({
      message: message,
      type: 'danger'
    });
  }

  retrieveVehicle = async () => {
console.log('retrieve')
    var vehicle = database.collection('Vehicle').doc(this.state.vehicleID).get();
    var vehicleData = (await vehicle).data();
    this.IsVehicleOwner(vehicleData.ownerID);
    this.setState({
      ownerID: vehicleData.ownerID,
      vehicleDetails: vehicleData.vehicleDetails,
      availability: vehicleData.availability,
      address: vehicleData.address,
      dailyRate: vehicleData.dailyRate,
      Rating: vehicleData.Rating,
      InsurancePolicy: vehicleData.InsurancePolicy,
    })
    
  }

  // createfakedata = () => {
  //   var ref = database.collection('Vehicle').doc().id;
  //   database.collection('Vehicle').doc(ref).set({
  //     ownerID: auth().currentUser.uid,
  //     vehicleDetails: {
  //       features: ['AUX', 'USB Input', 'GPS'],
  //       description: "During these trying times we are all looking for some sense of normalcy and escape.  While many entertainment venues are closed, we want to offer something that can still bring a smile to your face.",
  //       images: 'https://d1zgdcrdir5wgt.cloudfront.net/media/vehicle/images/_sHy9Pm0RbOrhgiKeRW2Pw.2880x1400.jpg',
  //       transmission: 'manual',
  //       year: '2020',
  //       model: 'mustang'
  //     },
  //     address: {
  //       city: 'Riyadh',
  //       street: 'Turki AlAwal',
  //       coordinates: {
  //         lat: 24.7240805257,
  //         lag: 46.6453786543
  //       }
  //     },
  //     Rating: 0,
  //     LicensePlateNumber: "5496 DMB",
  //     InsurancePolicy: {
  //       type: 'شامل',
  //       company: 'التعاونية'
  //     },
  //     dailyRate: 100,
  //     availability: ['2020-2-12', '2020-8-12', '2020-9-12', '2020-4-12', '2020-10-12']
  //   })
  // }



  SelectAvailability = () => {

    const calculateTotalPrice = async () => {
      if (this.state.selectedDates != undefined) {
        var price = this.state.selectedDates.length * this.state.dailyRate;
        var tax = price * 0.15;
        var totalAmount = price + tax;
        this.state.calculatedTotalPrice = totalAmount;
      }
    }

    return (

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'flex-end', marginHorizontal: 30 }}>
        {this.state.availability.map(date => {
          return (<TouchableOpacity
            style={{ margin: 5, padding: 10, borderColor: 'black', borderRadius: 2, borderWidth: 1, color: '#5dbcd2', }}
            onPress={() => {

              if (this.state.selectedDates == undefined) {
                console.log('undefined array')
                const dates = []
                dates.push(date)
                console.log(dates)

                //var newSelection = this.state.selectedDates.push(date)
                this.setState({
                  selectedDates: dates
                })
                console.log(this.state.selectedDates[0])
              }
              else if (this.state.selectedDates.indexOf(date) >= 0) {
                { console.log('remove element') }
                const dates = this.state.selectedDates;

                var index = dates.indexOf((String(date)))
                dates.splice(index, 1)
                console.log(dates)

                this.setState({
                  selectedDates: dates
                })
              }
              else {
                const dates = this.state.selectedDates;
                dates.push(date);
                console.log(dates)

                this.setState({
                  selectedDates: dates
                })
              }
              calculateTotalPrice();


            }}
            style={{
              borderColor: (this.state.selectedDates != undefined && this.state.selectedDates.includes(date)) ? colors.LightBlue : 'black',
              borderWidth: 1, borderRadius: 10, padding: 12, margin: 4,
              backgroundColor: (this.state.selectedDates != undefined && this.state.selectedDates.includes(date)) ? colors.LightBlue : '#fff'
            }}>
            <Text style={{ fontSize: 15, fontFamily: 'Tajawal_300Light', color: (this.state.selectedDates != undefined && this.state.selectedDates.includes(date)) ? '#fff' : 'black' }}>{date}</Text>
          </TouchableOpacity>)
        })}
      </View>

    )
  }


  SelectPickUpOption = () => {



    return (

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'flex-end', marginHorizontal: 30 }}>
        {['توصيل', 'استلام من موقع المالك',].map(option => {
          return (<TouchableOpacity
            style={{ margin: 5, padding: 10, borderColor: 'black', borderRadius: 2, borderWidth: 1, color: '#5dbcd2', }}
            onPress={() => {
              console.log('here')

              if (this.state.selectedPickUp) {
                const selection = []
                selection.push(option)

                //var newSelection = this.state.selectedDates.push(date)
                this.setState({
                  selectedPickUp: selection
                })
                console.log(this.state.selectedPickUp[0])
              }
              else if (this.state.selectedPickUp.indexOf(option) >= 0) {
                { console.log('remove element') }
                const selection = this.state.selectedPickUp;

                var index = selection.indexOf((String(option)))
                selection.splice(index, 1)

                this.setState({
                  selectedPickUp: selection
                })
              }
            }}
            style={{
              borderColor: (this.state.selectedPickUp != undefined && this.state.selectedPickUp.includes(option)) ? colors.LightBlue : 'black',
              borderWidth: 1, borderRadius: 10, padding: 12, margin: 4,
              backgroundColor: (this.state.selectedPickUp != undefined && this.state.selectedPickUp.includes(option)) ? colors.LightBlue : '#fff'
            }}>
            <Text style={{ fontSize: 15, fontFamily: 'Tajawal_300Light', color: (this.state.selectedPickUp != undefined && this.state.selectedPickUp.includes(option)) ? '#fff' : 'black' }}>{option}</Text>
          </TouchableOpacity>)
        })}
      </View>

    )
  }



  sortCalender = () => {

    console.log('sorting calender.. ')
    this.state.selectedDates.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date);
    });
  }

  handleRequest = () => {

    if (this.state.selectedDates[0] == null) {
      this.failureMessage('يرجى اختيار احدى المواعيد المتاحة لحجز المركبة')
      return;
    }
    else {
      this.sortCalender();
    }

    if (this.state.selectedPickUp[0] == null)
      this.state.selectedPickUp[0] = 'من الموقع'

    console.log('handling request..')

    var requestTime = new Date();


    //create request 
    var tripDocument = database.collection('Trips').doc();

    var requestID = tripDocument.id;
    var vehicleID = this.state.vehicleID;
    var ownerID = this.state.ownerID;
    var borrowerID = auth().currentUser.uid;

    var tripRequest = {
      tripID: requestID,
      ownerID: ownerID,
      borrowerID: borrowerID,
      requestTime: requestTime.toLocaleString(),
      status: 'pending',
      model: this.state.vehicleDetails.model,
      vehicleID: vehicleID,
      details: {
        pickupDate: '',
        dropoffDate: '',
        bookedDates: this.state.selectedDates,
        pickupOption: this.state.selectedPickUp[0],
        pickUplocation: this.state.address.coordinates
      },
      image: this.state.vehicleDetails.image,
      totalAmount: this.state.calculatedTotalPrice,
    }
    //send to firestore
    var batch = database.batch();

    var trip = database.collection('Trips').doc(requestID);
    batch.set(trip, tripRequest);

    var ownerRequests = database.collection('users').doc(ownerID).collection('Requests').doc(requestID);
    batch.set(ownerRequests, tripRequest);

    var borrowerRequests = database.collection('users').doc(borrowerID).collection('Requests').doc(requestID);
    batch.set(borrowerRequests, tripRequest);

    batch.commit().then(() =>
      // on success
      this.setState({ sentRequest: true })).catch(() => {
        console.log('failed request')
        this.setState({ failedRequest: true })

        this.unsuccessfulRequest();
      })


  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };


  successfulRequest = () => {
    return (
      <View style={{ flexDirection: 'column', alignSelf: 'center', justifyContent: 'center' }}>

        <View style={{ alignSelf: 'center', marginVertical: 150 }}>
          <FontAwesome5 name={'check-circle'} size={80} color={'green'} style={{ alignSelf: 'center', marginVertical: 15 }} />
          <Text style={styles.RequestText} >تم إرسال الطلب بنجاح</Text>
        </View>
      </View>
    )
  }

  unsuccessfulRequest = () => {
    return (
      <View style={{ flexDirection: 'column', alignSelf: 'center', justifyContent: 'center' }}>

        <View style={{ alignSelf: 'center', marginVertical: 150 }}>
          <MaterialIcons name={'error'} size={80} color={colors.Subtitle} style={{ alignSelf: 'center', marginVertical: 15 }} />
          <Text style={styles.RequestText} >تعذر إرسال الطلب، يرجى المحاولة مرة اخرى</Text>
        </View>
      </View>
    )
  }

  requestVehicleModal = () => {
    return (
      this.state.VehicleOwner ? <View></View> :
        <View>
          <CustomButton
            onPress={() => this.setState({ isModalVisible: true })}
            title="إحجز"
            style={{ marginTop: 12 }}
          />

          <Modal
            onBackdropPress={() => this.toggleModal()}
            onSwipeComplete={() => this.toggleModal()}
            swipeDirection='down'
            isVisible={this.state.isModalVisible}
            style={styles.Modal}
          >
            <View style={{
              height: '55%',
              width: 400,
              marginTop: 'auto',
              backgroundColor: 'white'
            }}>
              <TouchableOpacity onPress={() => this.toggleModal()}>
                <EvilIcons name={'close'} size={35} style={{ position: 'absolute', top: 20, left: 20 }} onPress={() => this.toggleModal()} />
              </TouchableOpacity>
              <View style={{ alignSelf: 'center', justifyContent: "center" }}>


                {this.state.sentRequest ? this.successfulRequest() : <View>
                  <Text style={styles.requestModalTitle}>طلب حجز المركبة</Text>

                  <Text style={styles.requestModalLabel}>التواريخ المتاحة </Text>
                  {this.SelectAvailability()}


                  <Text style={styles.requestModalLabel}>نوع الإستلام </Text>


                  {this.SelectPickUpOption()}

                  <Text style={[styles.requestModalLabel, { fontSize: 20, }]}>المجموع</Text>
                  <Text style={[styles.requestModalLabel, { fontSize: 25, fontFamily: 'Tajawal_500Medium', bottom: 20 }]}> {this.state.calculatedTotalPrice} ريال</Text>


                  <View style={{ bottom: 20 }}>
                    <TouchableOpacity style={styles.Button} onPress={() => this.setState({ isModalVisible: true })}>
                      <CustomButton
                        onPress = {()=> this.handleRequest()}
                        title='إرسال الطلب'
                      />
                    </TouchableOpacity>
                  </View>

                </View>}
              </View>
            </View>
          </Modal>
        </View>
    )
  }


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
        {data.icon && data.icon != "" ? <Icon name={data.icon} color={'#01b753'} size={18} style={{ marginRight: 8 }} /> : <Text style={{ fontSize: 17, textAlign: 'left', fontFamily: 'Tajawal_400Regular' }}> {data.name}   </Text>}
        <Text style={{ fontSize: 17, textAlign: 'left', color: '#5dbcd2', fontFamily: 'Tajawal_400Regular', marginHorizontal: 3 }}> {data.value}</Text>
      </View>
    )
  }

  renderFeature = () => {
    const features = [];
    for (let i = 0; i < this.state.vehicleDetails.features.length; i += 2) {

      features.push(<View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>

          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#5dbcd2', marginRight: 8, }}></View>
          <Text style={{ fontSize: 16, color: 'grey', fontFamily: 'Tajawal_400Regular' }}>{this.state.vehicleDetails.features[i]}</Text>
        </View>
        {this.state.vehicleDetails.features[i + 1] != null ?
          <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#5dbcd2', marginRight: 8 }}></View>
            <Text style={{ fontSize: 16, color: 'grey', fontFamily: 'Tajawal_400Regular' }}>{this.state.vehicleDetails.features[i + 1]}</Text>
          </View> : <View></View>}
      </View>
      )
    }
    return features
  }
  renderVehicleDetails = () => {

    this.state.features = ['aux']

    return (<View style={{ direction: 'rtl' }}>
      <View style={{ height: 180, width: '100%', backgroundColor: 'transparent', marginBottom: 8 }}>
        <Image source={{ uri: this.state.vehicleDetails.image }}
          style={{ width: '100%', height: '100%', resizeMode: 'cover', }} />
      </View>


      <View style={{ alignItems: 'baseline', marginVertical: 5, marginHorizontal: 5, fontFamily: 'Tajawal_400Regular', flexDirection: 'row-reverse', justifyContent: 'space-between', }}>

        <View style={{ alignSelf: 'flex-end', flexDirection: 'row-reverse', justifyContent: 'center' }}>

          <Rating type='star' ratingCount={5} readonly={true} imageSize={20} startingValue={this.state.Rating} style={{ marginBottom: 5, direction: 'ltr' }} />

        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, margin: 10, color: '#5dbcd2', fontFamily: 'Tajawal_700Bold', textAlign: 'left' }}> {this.state.dailyRate} ريال / يوم</Text>
        </View>
      </View>
      <View style={{ padding: 12, }}>
        <Text style={{ fontSize: 16, textAlign: 'left', marginBottom: 12, fontFamily: 'Tajawal_400Regular' }}>وصف المركبة</Text>
        <Text style={{ fontSize: 16, textAlign: 'left', color: '#5dbcd2', fontFamily: 'Tajawal_400Regular' }}>{this.state.vehicleDetails.description}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginHorizontal: 4, fontFamily: 'Tajawal_400Regular' }}>
        {this.renderCell({ name: 'الموديل ', value: this.state.vehicleDetails.model, })}
        {this.renderCell({ name: 'سنة الصنع', value: this.state.vehicleDetails.year })}
      </View>
      <View style={{ flexDirection: 'row', marginHorizontal: 4, fontFamily: 'Tajawal_400Regular' }}>
        {this.renderCell({ name: 'نوع المركبة', value: this.state.vehicleDetails.type })}
        {this.renderCell({ name: 'الجير', value: this.state.vehicleDetails.transmission })}
      </View>
      <View style={{ flexDirection: 'row', }}>

        {/* {this.renderCell({ name: 'نوع التأمين ', value: this.state.InsurancePolicy.type })}
        <View style={{ padding: 12, flex: 0.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 20, margin: 4, borderLeftColor: '#F0EEF0', borderLeftWidth: 1 }}>
        </View> */}
      </View>
      {this.state.vehicleDetails.features === undefined ? <View ></View> :

        <View style={{
          padding: 12, backgroundColor: '#fff', borderRadius: 20, margin: 8, shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowRadius: 6,
          shadowOffset: {
            height: 3,
            width: 0
          }
        }}>

          <View>
            <Text style={{ fontSize: 16, textAlign: 'left', marginBottom: 12, fontFamily: 'Tajawal_400Regular' }}>خصائص المركبة</Text>
            {this.renderFeature()}
          </View>
        </View>
      }


      <View style={{ flexDirection: 'row', }}>
        {this.renderCell({ name: 'المنطقة ', value: this.state.address.city })}
        {this.renderCell({ name: "نوع الإستلام", value: "من الموقع" })}
      </View>


    </View>)
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{ backgroundColor: 'fff' }}>

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

  }, Button: {
    backgroundColor: colors.LightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 140,
    margin: 10,
    width: 150,
    height: 30,
    borderRadius: 10,
    color: 'white',
    fontFamily: 'Tajawal_400Regular',
  },
  RequestButtonText: {
    color: 'white',
    fontFamily: 'Tajawal_400Regular',
    fontSize: 20,
    justifyContent: 'center',
    padding: 5

  },
  OptionsText: {
    fontFamily: 'Tajawal_300Light',
    fontSize: 18
  },


  Modal: {
    // backgroundColor:'white',
    alignSelf: 'center',
    borderTopEndRadius: 120,
    color: '#5dbcd2',
    fontFamily: 'Tajawal_400Regular'
  },
  requestModalTitle: {
    fontFamily: 'Tajawal_500Medium',
    fontSize: 30,
    marginTop: 25,
    marginHorizontal: 30,
    color: colors.LightBlue,
    alignSelf: 'flex-end'
  },

  requestModalLabel:
  {
    alignSelf: 'flex-end',
    marginVertical: 20,
    marginHorizontal: 30,
    marginLeft: 150,
    fontSize: 25,
    fontFamily: 'Tajawal_300Light',
  },
  RequestText: {
    fontSize: 25,
    fontFamily: 'Tajawal_500Medium'
  }
})

