import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image, ImageBackgroundBase, ScrollView, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Input from '../../components/Input';
import DatePicker from 'react-native-datepicker'
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { auth, database, storage } from '../../Configuration/firebase';
import { OverLay } from '../../components/OverLay';

export default class AddOrEditVehicle extends Component {

  state = {
    carId: '',
    carModel: '',
    carType: '',
    availabilities: [],
    image: null,
    loading: false,
    edit: false,
    docId: ''
  }


  onResult = (queury) => {
    let car = null
    let docId = ''
    queury.forEach(element => {
      car = element.data();
      docId = element.id
    });
    if (car) {
      this.setState({
        carId: car.carId,
        carModel: car.carModel,
        carType: car.carType,
        availabilities: car.availabilities,
        edit: true,
        image: car.image,
        docId: docId
      })
    }
  }
  onError = (e) => {
    console.warn(e, "===")
  }
  componentDidMount() {
    console.warn('eeee')
    database.collection('cars').where('userId', "==", auth.currentUser.uid).onSnapshot(this.onResult, this.onError)

  }



  openImagePickerAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const result = await ImagePicker.launchImageLibraryAsync({
      aspect: 1,
      allowsEditing: true,
    });
    console.warn(result)
    if (!result.cancelled) this.setState({ image: result.uri });
  };


  uploadFile = async (path) => {

    const response = await fetch(path);
    const blob = await response.blob();
    const filename = path.substring(path.lastIndexOf('/') + 1);
    const metadata = {
      contentType: 'image/jpeg',
    };
    const task = storage.ref(filename).put(blob, metadata)
    try {
      return await task;
    } catch (e) {
      console.error(e);
    }

  };


  handleSaveData = async () => {


    if (this.state.carId == "") {
      alert('يرجى كتابة رقم الاستمارة')
      return;
    }
    if (this.state.carModel == "") {
      alert('يرجى كتابة موديل السيارة')
      return;
    }
    if (this.state.carType == "") {
      alert('يرجى كتابة نوع السيارة')
      return;
    }
    if (this.state.availabilities.length == 0) {
      alert('يرجى اختيار التواريخ المتاحة')
      return;
    }
    if (!this.state.image) {
      alert('يرجى اختيار صورة السيارة')
      return;
    }
    this.setState({ loading: true })
    // const response = await this.uploadFile(this.state.image);
    // console.warn(response)
    if (this.state.edit) {

      if (this.state.image.indexOf('http') > -1) {
        database.collection('cars').doc(this.state.docId).update({
          carId: this.state.carId,
          carModel: this.state.carModel,
          carType: this.state.carType,
          userId: auth.currentUser.uid,
          image: this.state.image,
          availabilities: this.state.availabilities
        }).then(success => {
          alert('تم تعديل السيارة بنجاح')
          this.setState({ loading: false })
        }).catch(e => {
          alert('حصل خطأ ما يرجى المحاولة لاحقا')
          this.setState({ loading: false })
          console.warn('error', e);
        })
      } else {
        const response = await this.uploadFile(this.state.image);

        if (response && response.ref) {
          const downloadUrl = await response.ref.getDownloadURL()
          database.collection('cars').doc(this.state.docId).update({
            carId: this.state.carId,
            carModel: this.state.carModel,
            carType: this.state.carType,
            userId: auth.currentUser.uid,
            image: downloadUrl,
            availabilities: this.state.availabilities
          }).then(success => {
            alert('تم تعديل السيارة بنجاح')
            this.setState({ loading: false })
          }).catch(e => {
            alert('حصل خطأ ما يرجى المحاولة لاحقا')
            this.setState({ loading: false })
            console.warn('error', e);
          })
        } else {
          this.setState({ loading: false })
          alert('حصل خطأ ما يرجى المحاولة لاحقا')
        }

      }
    } else {
      const response = await this.uploadFile(this.state.image);

      if (response && response.ref) {
        const downloadUrl = await response.ref.getDownloadURL()
        database.collection('cars').add({
          carId: this.state.carId,
          carModel: this.state.carModel,
          carType: this.state.carType,
          userId: auth.currentUser.uid,
          image: downloadUrl,
          availabilities: this.state.availabilities
        }).then(success => {
          alert('تم إضافة السيارة بنجاح')
          this.setState({ loading: false })
        }).catch(e => {
          alert('حصل خطأ ما يرجى المحاولة لاحقا')
          this.setState({ loading: false })
          console.warn('error', e);
        })
      } else {
        this.setState({ loading: false })
        alert('حصل خطأ ما يرجى المحاولة لاحقا')
      }

    }


  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ padding: 24 }}>

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 24, textAlign: 'right', color: 'grey' }}>{this.state.edit ? 'تعديل سيارة' : 'إضافة سيارة'}</Text>
          <Input
            value={this.state.carId}
            onChangeText={(carId) => this.setState({ carId })}
            placeholder="رقم الاستمارة"
            iconName="file"
          />
          <Input
            value={this.state.carModel}
            onChangeText={(carModel) => this.setState({ carModel })}
            placeholder="نوع السيارة"
            iconName="car"
          />
          <Input
            value={this.state.carType}
            onChangeText={(carType) => this.setState({ carType })}
            placeholder="موديل السيارة"
            iconName="car"
          />
          <View
            style={{
              marginBottom: 20,
              direction: 'rtl',
            }}>
            <View style={{ padding: 16, paddingTop: 0 }}>
              <Text style={{ textAlign: 'left' }} >التواقيت المتاحة للعرض</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {this.state.availabilities.map(availability => {
                  return (<View style={{ margin: 2, padding: 8, borderColor: 'black', borderRadius: 2, borderWidth: 1 }} >
                    <Text>{availability}</Text>
                  </View>)
                })}
              </View>
            </View>
            {/* <Icon name={props.iconName} color={'#01b753'} size={25} /> */}

            <View style={{ flexDirection: 'row' }}>
              <DatePicker
                style={{ width: 200 }}
                date={this.state.date}
                mode="date"
                placeholder="اختر التاريخ"
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
              <TouchableOpacity
                onPress={() => {
                  this.setState(prevState => ({
                    availabilities: [...prevState.availabilities, this.state.date]
                  }))
                }} style={{ marginLeft: 8, padding: 12, borderWidth: 1, borderRadius: 4, borderColor: '#01b753', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ textAlign: 'left', color: '#01b753' }}>إضافة</Text>
              </TouchableOpacity>
            </View>

          </View>

          <View
            style={{
              marginBottom: 20,
              direction: 'rtl',
            }}>
            <Text style={{ textAlign: 'left', marginBottom: 12 }}>إرفاق صورة السيارة</Text>
            <TouchableOpacity
              onPress={this.openImagePickerAsync}
              style={{ width: 80, height: 80, borderRadius: 4, borderWidth: 1, borderColor: 'gray', alignSelf: 'center' }}>
              {this.state.image ? <Image style={{ width: '100%', height: '100%', borderRadius: 4 }} source={{ uri: this.state.image }} /> : <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>

                <Icon name={"download"} color={'gray'} size={32} />
              </View>
              }
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={this.handleSaveData}
            style={{ width: 200, height: 40, borderRadius: 20, backgroundColor: '#01b753', justifyContent: 'center', alignItems: 'center', marginVertical: 16, alignSelf: 'center' }}>
            <Text style={{ fontSize: 14, color: '#fff' }}>حفظ</Text>
          </TouchableOpacity>
        </ScrollView>
        {this.state.loading ? <OverLay /> : null}
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

