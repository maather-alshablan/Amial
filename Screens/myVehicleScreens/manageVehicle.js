import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image, ImageBackgroundBase, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import Input from '../../components/Input';
import DatePicker from 'react-native-datepicker'
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { auth, database, storage } from '../../Configuration/firebase';
import { OverLay } from '../../components/OverLay';


export default class manageVehicle extends Component {

  state = {
    cars: []
  }

  onResult = (queury) => {
    let cars = []
    let docId = ''
    queury.forEach(element => {
      cars.push({ docId: element.id, car: element.data() })

    });
    this.setState({
      cars
    })
  }
  onError = (e) => {
    console.warn(e, "===")
  }
  componentDidMount() {
    console.warn('eeee')
    database.collection('cars').where('userId', "==", auth.currentUser.uid).onSnapshot(this.onResult, this.onError)

  }

  renderAddCar = () => {
    return (<TouchableOpacity
      onPress={() => {
        this.props.navigation.navigate('AddOrEditVehicle')
      }}
      style={{ height: 200, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 14, color: '#000' }}>add car</Text>
    </TouchableOpacity>)
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          {this.state.cars.length == 0 ? this.renderAddCar() : this.state.cars.map(car => {
            return (<TouchableOpacity key={car.docId}
              style={{ backgroundColor: '#ccc', borderRadius: 6 }}
            >
              <View style={{ height: 200 }}>
                <Image source={{ uri: car.car.image }} style={{ width: '100%', height: '100%' }} />
              </View>
              <View style={{ padding: 16, direction: 'rtl' }}>

                <Text style={{ color: '#5dbcd2', fontSize: 20, textAlign: 'left', fontFamily: 'Tajawal_400Regular', }}>موديل السيارة: {car.car.carModel}</Text>
                <Text style={{ color: '#5dbcd2', fontSize: 20, textAlign: 'left', fontFamily: 'Tajawal_400Regular', }}>نوع السيارة: {car.car.carType}</Text>
              </View>
              <View style={{ flexDirection: 'row', flex: 1, borderTopColor: '#fff', borderTopWidth: 1 }}>

                <TouchableOpacity
                  onPress={() => {

                    Alert.alert(
                      "حذف السيارة",
                      "هل أنت متأكد من حذف السيارة؟",
                      [
                        {
                          text: "إلغاء",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel"
                        },
                        {
                          text: "موافق", onPress: () => {
                            database.collection('cars').doc(car.docId).delete()
                          }
                        }
                      ],
                      { cancelable: false }
                    );
                  }}
                   style={{ flex: 1, padding: 12, justifyContent: 'center', alignItems: 'center', fontFamily: 'Tajawal_400Regular', color: '#5dbcd2', }}>
                  <Text>حذف السيارة</Text>
                </TouchableOpacity>
                <View style={{ height: '100%', width: 1, backgroundColor: '#000' }}></View>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('AddOrEditVehicle')
                  }}
                  style={{ flex: 1, padding: 12, justifyContent: 'center', alignItems: 'center' , fontFamily: 'Tajawal_400Regular', color: '#5dbcd2', }}>
                  <Text>تعديل معلومات السيارة</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>)
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  },

});

