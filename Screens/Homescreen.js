import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Image, FlatList, ImageBackground, Picker, Platform } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Map from '../Screens/maps'
import colors from '../Constants/colors'
import { Entypo, FontAwesome5, Ionicons } from '../Constants/icons';
import SwitchSelector from "react-native-switch-selector";
import { auth, database } from '../Configuration/firebase';
import ExploreScreen from './ExploreScreen';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-datepicker'
import { Rating, AirbnbRating, } from 'react-native-ratings';

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


const carTypes = [
  { id: 1, label: 'فخمة', value: 'فخمة' },
  { id: 2, label: 'اقتصادية', value: 'اقتصادية' },
  { id: 3, label: 'صغيرة', value: 'صغيرة' },
  { id: 4, label: 'سيدان متوسطة', value: 'سيدان متوسطة' },
  { id: 5, label: 'سيدان كبيرة', value: 'سيدان كبيرة' },
  { id: 6, label: 'عائلية', value: 'عائلية' },
  { id: 7, label: 'متعددة الاستخدامات', value: 'متعددة الاستخدامات' },
]
export default class Homescreen extends Component {
  state = {
    searchValue: "",
    mapView: false,
    selected: 'white',
    cars: [],
    isModalVisible: false,
    carType: '',
    date: '',
    originalCars: []
  }
  onResult = (queury) => {
    let car = null
    //let docId = ''
    const cars = [];
    queury.forEach(element => {
      car = element.data();
      cars.push(car)
    });
    this.setState({
      originalCars: cars,
      cars: cars,
    })
  }
  // onError = (e) => {
  // console.log(e, "===")
  // }
  componentDidMount() {
    //await database.collection('Vehicle').onSnapshot(this.onResult, this.onError)
    this.retreiveVehicles();
    this.generateToken()
    this.getMyRequests()
    this.getMyCars()
  }

  getMyRequests = () => {


    database.collection('users').doc(auth.currentUser.uid)
      .collection('Requests').onSnapshot((doc) => {
        let vehicles = []
        doc.forEach((vehicle) => {
          this.cancelAllScheduledNotificationsAsync()
          const vv = vehicle.data()
          const { details = {}, status = "" } = vv || {}
          const { bookedDates = [] } = details || {}

          if (status == 'accepted') {
            console.warn('send')
            const endDate = new Date(bookedDates[0]);
            const nowDate = new Date();
            // alert(new Date().getUTCDate() + "," + new Date(bookedDates[0]).getUTCDate() + "," + new Date().getHours() + "," + bookedDates[0])
            if (new Date().getUTCDate() == new Date(bookedDates[0]).getUTCDate() && new Date().getHours() <= 15) {
              // alert('yess')
              this.scheduleNotification(10);
            } else {
              // alert((endDate / 1000 - nowDate / 1000))
              // this.scheduleNotification((endDate / 1000 - nowDate / 1000));
            }
          }
          // alert(JSON.stringify(vehicle.data()))
        })
      })

    // if ((endDate / 1000 - nowDate / 1000) > (24 * 60 * 60)) { // offer has more than one day 
    //   this.scheduleNotification(offers[key], ((endDate / 1000 - nowDate / 1000) - (24 * 60 * 60)));
    // }

  }

  getMyCars = () => {
    database.collection('Vehicle').where("ownerID", '==', auth.currentUser.uid).get().then((doc) => {
      console.log('true')

      if (doc.empty) {

        console.log('user has no vehicles listed')
        this.setState({ hasVehicle: false });
      }
      else {
        let vehicles = []
        doc.forEach((vehicle) => {
          const { availability = [], vehicleDetails = {}, } = vehicle.data() || {}
          const { model = "" } = vehicleDetails || {}
          let found = false
          for (let i = 0; i < availability.length; i++) {
            if (new Date(availability[i]) - new Date() < 0) {
              found = true
            } else {
              found = false
            }
          }
          if (found) {
            Notifications.scheduleNotificationAsync({
              content: {
                sound: 'default',
                title: "تحديث تواريخ العرض",
                body: "يرجى تحديث التواريخ المتاحة للعرض للمركبة " + model
              },
              trigger: {
                seconds: 10,
                repeats: false
              },
            });
          }

        })

      }

    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  }

  onResultCars = (queury) => {
    let cars = []
    let docId = ''
    queury.forEach(element => {
      cars.push({ docId: element.id, car: element.data() })

    });
    alert(cars.length)
  }
  onError = (e) => {
    console.warn(e, "===")
  }
  cancelAllScheduledNotificationsAsync = async () => {
    return await Notifications.cancelAllScheduledNotificationsAsync()
  }

  scheduleNotification = (seconds) => {

    Notifications.scheduleNotificationAsync({
      content: {
        sound: 'default',
        title: "تسليم المركبة",
        body: 'يرجى التسليم قبل الساعة الثالثة عصرا'
      },
      trigger: {
        seconds: seconds,
        repeats: false
      },
    });
  }

  generateToken = async () => {

    const token = await this.registerForPushNotificationsAsync();
    database.collection('users').doc(auth.currentUser.uid).update({
      push_token: token,
    }).then(success => {
    }).catch(e => {
      alert('failureMessage' + JSON.stringify(e))
    })

  }

  registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }

    // if (Platform.OS === 'android') {
    //   Notifications.setNotificationChannelAsync('default', {
    //     name: 'default',
    //     importance: Notifications.AndroidImportance.MAX,
    //     vibrationPattern: [0, 250, 250, 250],
    //     lightColor: '#FF231F7C',
    //   });
    // }

    return token;
  }

  retreiveVehicles = () => {
    database.collection('Vehicle').orderBy('created_at', 'desc').onSnapshot((doc) => {
      let vehicles = []
      doc.forEach((vehicle) => {
        vehicles.push(vehicle.data())
      })
      this.setState({ cars: vehicles, originalCars: vehicles })
    })
  }


  switchSelector = () => {
    return (
      <SwitchSelector
        initial={0}
        onPress={value => this.setState({ mapView: !this.state.mapView })}
        textColor={colors.LightBlue} //'#7a44cf'
        selectedColor={'white'}
        buttonColor={colors.LightBlue}
        borderColor={colors.LightBlue}
        style={{ width: 300, marginVertical: 10 }}
        hasPadding
        textStyle={{ fontSize: 15, fontFamily: 'Tajawal_400Regular', margin: 3, color: colors.Subtitle }}
        selectedTextStyle={{ fontSize: 15, fontFamily: 'Tajawal_400Regular', margin: 3, color: 'white' }}
        options={[
          { label: "القائمة", customIcon: this.listViewIcon() }, //images.feminino = require('./path_to/assets/img/feminino.png')
          { label: "الخريطة", customIcon: this.mapViewIcon() } //images.masculino = require('./path_to/assets/img/masculino.png')
        ]}
      />
    )
  }
  listViewIcon() {
    return (
      <Entypo name='list'
        color={this.state.mapView ? colors.LightBlue : 'white'}
        size={20} />
    )
  }
  mapViewIcon() {
    return (
      <FontAwesome5 name='map-marker-alt'
        color={this.state.mapView ? 'white' : colors.Subtitle}
        size={20} />
    )
  }
  mapView = () => {
    return (
      <View style={{ flex: 1 }} >
        {/* <Map
cars={[...this.state.cars, ...this.state.cars, ...this.state.cars]}
navigation={this.props.navigation}
/> */}
        <ExploreScreen
          cars={this.state.cars}
          navigation={this.props.navigation}
        />
      </View>
    )
  }
  renderCar = ({ item, index }) => {
    const { image = "", model = "" } = item.vehicleDetails || {}
    const stars = []
    for (let i = 0; i < 5; i++) {
      if (i < 4) {
        stars.push(<FontAwesome5 name="star" color="#fff" />)
      }
    }
    return (<TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        this.props.navigation.navigate('VehicleView', { vehicleID: item.vehicleID })
      }}
      style={{
        direction: 'rtl',
        width: 320,
        height: 220,
        backgroundColor: '#fff',
        marginVertical: 10,
        borderWidth: 0.2,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        fontFamily: 'Tajawal_400Regular',
        shadowRadius: 6,
        shadowOffset: {
          height: 3,
          width: 0
        },
        borderRadius: 16,
        padding: 12
      }}>

      <View style={{ width: '80%', height: 120, marginBottom: 4, alignSelf: 'center' }}>
        <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

        <View style={{ padding: 4 }}>
          <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'left' }}>{model}</Text>
          <Text style={{ fontSize: 14, fontFamily: 'Tajawal_400Regular', textAlign: 'left', color: '#929090', marginVertical: 5 }}>{`السعر : ${item.dailyRate} ريال/يوم`}</Text>
        </View>
        <View style={{ flexDirection: 'row-reverse', justifyContent: 'center' }}>

          <Rating type='star' ratingCount={5} readonly={true} imageSize={20} startingValue={item.Rating} style={{ marginBottom: 5, direction: 'ltr' }} />

        </View>
      </View>
    </TouchableOpacity>)
  }
  listView = () => {
    return (
      <FlatList
        data={this.state.cars}
        renderItem={this.renderCar}
        keyExtractor={(index) => index.toString() + "a"}
        contentContainerStyle={{ alignItems: 'center' }}
      />
    )
  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  search = (searchOnly = false) => {
    // availability
    // type
    if (this.state.carType != "" || this.state.date != "" || this.state.searchValue != "") {
      const filterCars = this.state.originalCars.filter(car => {
        const { image = "", model = "", type = "" } = car.vehicleDetails || {}

        const avs = car.availability.join(',')
        if (this.state.carType == type || (this.state.date ? avs.indexOf(this.state.date) > -1 : false)) {
          if (this.state.searchValue != "") {
            if (model.toLocaleLowerCase().indexOf(this.state.searchValue?.toLocaleLowerCase()) > -1) {
              return true
            } else {
              return false
            }
          } else {
            return true
          }
        }
      })
      console.log(filterCars, "----", this.state.carType)
      this.setState({
        cars: filterCars
      })
    } else {
      this.setState({
        cars: [...this.state.originalCars]
      })
    }
    if (!searchOnly)
      this.toggleModal()
  }
  render() {
    return (
      <ImageBackground
        source={require('../images/b1.jpeg')}
        style={{ width: '100%', height: '100%' }}
      >


        <View style={styles.container}>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('../Constants/Logo/PNGLogo.png')}
              style={styles.logo} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={this.toggleModal}
                style={{ paddingHorizontal: 8 }}>
                <FontAwesome5 name='filter'
                  color={colors.LightBlue}
                  size={24}
                />
              </TouchableOpacity>
              <View style={styles.searchContainer}>
                <TextInput
                  style={{ justifyContent: 'flex-end', textAlign: 'right', padding: 10, fontWeight: '600', fontFamily: 'Tajawal_400Regular', color: 'black', fontSize: 20 }}
                  placeholder={'ابحث عن مركبة..'}
                  value={this.state.searchValue}
                  onChangeText={(text) => {

                    this.setState({ searchValue: text }, () => {
                      this.search(true)
                    })
                  }}
                />
              </View>
            </View>
            {this.switchSelector()}
          </View>
          <View style={{ flex: 1 }}>
            {this.state.mapView ? this.mapView() : this.listView()}
          </View>
          <Modal
            onBackdropPress={() => this.toggleModal()}
            onSwipeComplete={() => this.toggleModal()}
            swipeDirection='down'
            isVisible={this.state.isModalVisible}
            style={styles.Modal}
          >
            <View style={{
              height: '40%',
              width: 400,
              marginTop: 'auto',
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 24,
              direction: 'rtl'
            }}>
              <View style={{ marginBottom: 24 }}>
                <Text style={{ textAlign: 'left', marginBottom: 12, fontSize: 16, fontFamily: 'Tajawal_400Regular', }}>حدد التاريخ</Text>
                <DatePicker
                  style={{ width: 200, }}
                  date={this.state.date}
                  mode="date"
                  placeholder="حدد التاريخ"
                  format="YYYY-MM-DD"
                  minDate={new Date()}
                  // maxDate="2016-06-01"
                  confirmBtnText="تاكيد"
                  cancelBtnText="الغاء"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => { this.setState({ date: date }) }}
                />
              </View>
              <View style={{ marginBottom: 64 }}>
                <Text style={{ textAlign: 'left', marginBottom: 12, fontSize: 16, fontFamily: 'Tajawal_400Regular', }}>حدد نوع المركبة</Text>
                <Picker
                  itemStyle={{
                    height: 50,
                    fontFamily: "Tajawal_400Regular"
                  }}
                  selectedValue={this.state.carType}
                  style={{
                    height: 50,
                    width: '50%',
                  }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ carType: itemValue })
                  }>
                  <Picker.Item label="نوع المركبة" value="نوع المركبة" />
                  {carTypes.map(item => <Picker.Item key={item.id} label={item.label} value={item.value}
                    color={item.value == this.state.carType ? colors.LightBlue : '#000'}
                  />)}
                </Picker>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity style={[styles.EmptyaddVehicleButton, { marginHorizontal: 8 }]}
                  onPress={() => {
                    this.search()
                  }}>
                  <Text style={styles.ButtonText}>{'ابحث'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.EmptyaddVehicleButton, { marginHorizontal: 8 }]}
                  onPress={() => {
                    this.setState({
                      date: '',
                      carType: ''
                    }, () => {
                      this.search()
                    })
                  }}>
                  <Text style={styles.ButtonText}>{'إلغاء البحث'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,

    // alignItems: 'center',
    // justifyContent: 'center',
  },
  searchContainer: {
    backgroundColor: '#cad1d1',
    width: Dimensions.get('window').width * 0.70,
    height: 35,
    borderRadius: 25,
  },
  logo: {
    height: 150,
    width: 250,
    resizeMode: 'contain',
  },
  Button: {
    backgroundColor: colors.LightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 30,
    borderRadius: 10,
    color: 'white'
  },
  ViewSelection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.8,
    width: 120,
    borderRadius: 10
  },
  viewSelectionContainer: {
    padding: 5,
    marginHorizontal: 4,
    alignSelf: 'center'
  },
  selectedView: {
  },
  Modal: {
    // backgroundColor:'white',
    alignSelf: 'center',
    borderTopEndRadius: 120,
    color: '#5dbcd2',
    fontFamily: 'Tajawal_400Regular'
  },
  ButtonText: {
    color: 'white',
    fontFamily: 'Tajawal_400Regular',
    fontSize: 20,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  EmptyaddVehicleButton: {
    backgroundColor: '#1894E5', // #1BB754
    flexDirection: "row-reverse",
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: {
      height: 3,
      width: 0
    },
    justifyContent: 'center',
    alignSelf: 'center',
    height: 40,
    borderRadius: 10,
    color: 'white',
    paddingHorizontal: 24,
    minWidth: 160
  },
});