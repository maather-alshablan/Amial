import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import colors from '../../Constants/colors';


export default class ConfirmedRequests extends Component {
  //amount of requests
  state = {
    requests: [{}, {}, {}]
  }

  renderRequest = ({ item, index }) => {
    return (<TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        // navigate to view to open the trip / vehicle info
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
        flexDirection: 'row',
        direction: 'rtl',
        padding: 12,
        justifyContent: 'space-between',
      }}>
      <View style={{ padding: 10 }}>
        <Text style={{ textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20 }}>نوع المركبة: Maserati</Text>
        <Text style={{ textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20 }}>اسم المستأجر : Nouf</Text>
        <Text style={{ textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20 }}>طريقة التسليم: توصيل</Text>
        <Text style={{ textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20 }}>الحالة : مؤكدة</Text>
      </View>
      <View style={{ width: 120, height: 80 }}>
        <Image source={{ uri: 'https://pngimg.com/uploads/maserati/maserati_PNG81.png' }} style={{ width: '100%', height: '100%' }} />
      </View>
    </TouchableOpacity>)
  }

  render() {
    return (
      <View style={styles.container}>

        {this.state.requests.length ?
          <FlatList
            data={this.state.requests}
            renderItem={this.renderRequest}
            contentContainerStyle={{ alignItems: 'center' }}
          />
          : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.emptyTripsText}> لا يوجد رحلات..</Text>
          </View>
        }

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


