import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image, ImageBackgroundBase, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { database } from '../Configuration/firebase';
import { auth } from 'firebase';
import colors from '../Constants/colors';


export default class Vehicle extends Component {

  state = {
    hasVehicle: null,
    vehicles: [],
    //add as much as u like
    items: [
      {
        title: 'title1 title1 title1 ',
        desc: 'desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1'
      },
      {
        title: 'title2 title2 title2',
        desc: 'desc2 desc2 desc2 desc2 desc2 desc2 desc2 desc2 desc2 desc2 desc2 desc2'
      },

      {
        title: 'title3 title3 title3',
        desc: 'desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3'
      },
    ]
  }

  async componentDidMount() {

    // this.determineUserHasVehicle();
    this.setState({ hasVehicle: true })
  }


  determineUserHasVehicle = async () => {

    database.collection('vehicle').where("ownerID" == auth().currentUser.uid).get().then((doc) => {
      if (doc.empty) {
        this.setState({ hasVehicle: false });
      }
      else {
        this.setState({ hasVehicle: true });
        this.setState({ vehicles: doc.data() });
      }
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  }



  userHasNoVehicle = () => {
    return (
      <View style={{ alignSelf: 'center', justifyContent: 'center', marginVertical: 280 }}>
        <Text style={styles.emptyTripsText}> لا يوجد مركبة..</Text>
        <Text style={styles.emptyTripsText}> قم بمشاركة مركبتك على اميال</Text>

      </View>
    )
  }

  renderItem = ({ item, index }) => {
    return (
      <View style={{ flexDirection: 'row', direction: 'rtl', flex: 1, }}>
        <View style={{}}>
          <View style={{ width: 32, height: 32, borderRadius: 16, borderColor: '#5dbcd2', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 14 }}>{index + 1}</Text>
            {/* for the timeline */}
          </View>
          {index == this.state.items.length - 1 ? null : <View style={{ flex: 1, width: 1, backgroundColor: '#5dbcd2', alignSelf: 'center' }}></View>}
        </View>
        <View style={{ padding: 12, paddingTop: 0, paddingBottom: 24, flex: 1, }}>
          <Text style={{ textAlign: 'left', fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>{item.title}</Text>
          <Text style={{ textAlign: 'left', fontSize: 18 }}>{item.desc}</Text>
        </View>
      </View>
    )
  }
  userHasVehicle = () => {
    return (
      <View>
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', borderBottomWidth: 1, borderColor: colors.LightBlue }}>
          <TouchableOpacity style={styles.Button} onPress={() => this.props.navigation.navigate('ManageVehicle')}>
            <Text style={styles.optionText}>إدارة المركبة</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.Button} onPress={() => this.props.navigation.navigate('Requests', { VehicleOwner: true })}>
            <Text style={styles.optionText}>الطلبات</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.items}
          renderItem={this.renderItem}
          contentContainerStyle={{ paddingTop: 30 }}
        />
      </View>
    )
  }


  render() {
    return (
      <View style={styles.container}>

        {this.state.hasVehicle ?
          this.userHasVehicle() : this.userHasNoVehicle()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',

  }, //for mockup
  logo: {
    height: 150,
    width: 350,
    marginTop: 10,
    resizeMode: 'contain',
  },
  Button: {
    backgroundColor: '#5dbcd2',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    width: 150,
    height: 30,
    borderRadius: 10,
    color: 'white'
  },
  emptyTripsText: {
    fontFamily: 'Tajawal_700Bold',
    fontSize: 20,
    color: 'grey',
    marginVertical: 10,
  },
  optionText: {
    fontFamily: 'Tajawal_500Medium',
    color: 'white',
    justifyContent: 'center',
    fontSize: 18

  }

});

