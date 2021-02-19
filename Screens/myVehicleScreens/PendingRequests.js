import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, Dimensions, Linking } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import colors from '../../Constants/colors';
import { ModalComponent } from '../../Constants/Components/Modal';


export default class PendingRequests extends Component {

  state = {
    request: {}
  }

  renderRequest = () => {
    return (<TouchableOpacity
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
          <Text style={{ textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20 }}>نوع المركبة: BMW</Text>
          <Text style={{ textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20 }}>اسم المستأجر : Faisal</Text>
          <Text style={{ textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20 }}>طريقة التسليم: توصيل</Text>
          <Text style={{ textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20 }}>الحالة : لم يتم الدفع</Text>
        </View>
        <View style={{ width: 120, height: 80 }}>
          <Image source={{ uri: 'https://imgd.aeplcdn.com/0x0/n/cw/ec/41406/bmw-8-series-right-front-three-quarter8.jpeg' }} style={{ width: '100%', height: '100%' }} />
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
          <Text style={{ marginLeft: 8, }}>تواصل مع المستأجر</Text>
        </TouchableOpacity>
      </View>

    </TouchableOpacity>)
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.request ? this.renderRequest() :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.emptyTripsText}> لا يوجد رحلات..</Text>
          </View>
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
    fontSize: 20,
    fontFamily: "Tajawal_500Medium"
  }

});

