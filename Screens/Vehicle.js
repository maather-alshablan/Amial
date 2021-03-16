import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Image, TouchableHighlight, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { database } from '../Configuration/firebase';
import { auth } from 'firebase';
import colors from '../Constants/colors';
import CustomButton from '.././components/CustomButton';
import { Rating, AirbnbRating, } from 'react-native-ratings';
import { Ionicons, FontAwesome5 } from '../Constants/icons';


export default class Vehicle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasVehicle: false,
      vehicles: [],
      //add as much as u like
      items: [
        {
          title: 'شارك مركبتك على أميال ',
          // desc: 'desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1 desc1'
        },
        {
          title: 'حدد سعرك والأوقات المناسبة لك',
          // desc: 'desc2 desc2 desc2 desc2 desc2 desc2 desc2 desc2 desc2 desc2 desc2 desc2'
        },

        {
          title: 'لا تشيل هم واكسب المال',
          // desc: 'desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3'
        },
      ]
    }
  }

  async componentDidMount() {

    await this.determineUserHasVehicle();

  }


  determineUserHasVehicle = () => {
    // console.log('true')

    database.collection('Vehicle').where("ownerID", '==', auth().currentUser.uid).get().then((doc) => {
      console.log('true')

      if (doc.empty) {

        console.log('user has no vehicles listed')
        this.setState({ hasVehicle: false });
      }
      else {
        console.log(doc.metadata)
        let vehicles = []
        doc.forEach((vehicle) => {
          vehicles.push(vehicle.data())
        })
        this.setState({ hasVehicle: true, vehicles: vehicles });
        console.log(vehicles)
      }

    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  }



  userHasNoVehicle = () => {
    return (
      <View>
        <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-end', borderBottomWidth: 1, borderColor: colors.Subtitle }}>


        </View>
        <FlatList
          data={this.state.items}
          renderItem={this.renderItem}
          keyExtractor={(index) => index.toString()}
          contentContainerStyle={{ paddingTop: 5 }}
        />

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('AddOrEditVehicle')
          }}>
          <CustomButton
            style={[styles.Button]}
            title='إضافة مركبة'
            onPress={() => {
              this.props.navigation.navigate('AddOrEditVehicle')
            }} />

        </TouchableOpacity>

      </View>
    )
  }

  renderVehicle = ({ item, index }) => {
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
      //  this.props.navigation.navigate('VehicleView', { vehicleID: item.vehicleID })
        this.props.navigation.navigate('AddOrEditVehicle', { vehicleID: item.vehicleID })
      }}
      style={{
        direction: 'rtl',
        width: 320,
        minHeight: 220,
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

          <Rating type='star' ratingCount={5} readonly={true} imageSize={20} startingValue={3} style={{ marginBottom: 5, direction: 'ltr' }} />

        </View>
      </View>
      <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', paddingBottom: 6 }}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('AddOrEditVehicle', { vehicleID: item.vehicleID })
          }}
          style={{ padding: 8,  }}>
          <FontAwesome5 name="edit" color={colors.Subtitle} size={20}/>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>)
  }

  renderItem = ({ item, index }) => {
    return (
      <View style={{ flexDirection: 'row', direction: 'rtl', flex: 1, top: 100, }}>
        <View style={{}}>
          <View style={{ width: 32, height: 32, borderRadius: 16, borderColor: '#5dbcd2', borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontFamily: 'Tajawal_500Medium', color: colors.Subtitle }}>{index + 1}</Text>
            {/* for the timeline */}
          </View>
          {index == this.state.items.length - 1 ? null : <View style={{ flex: 1, width: 2, height: 40, backgroundColor: '#5dbcd2', alignSelf: 'center' }}></View>}
        </View>
        <View style={{ padding: 12, paddingTop: 0, paddingBottom: 24, flex: 1, }}>
          <Text style={{ textAlign: 'left', fontSize: 24, fontWeight: 'bold', marginBottom: 70, fontFamily: 'Tajawal_500Medium', color: colors.Subtitle }}>{item.title}</Text>
          <Text style={{ textAlign: 'left', fontSize: 18 }}>{item.desc}</Text>
        </View>
      </View>
    )
  }
  userHasVehicle = () => {
    return (
      <View>
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', borderBottomWidth: 1, borderColor: colors.LightBlue }}>
          {/* <TouchableOpacity style={styles.Button} onPress={() => this.props.navigation.navigate('AddOrEditVehicle')}>
<Text style={styles.optionText}>إدارة المركبة</Text>
</TouchableOpacity> */}
          <CustomButton
            style={[styles.Button,]}
            onPress={() => this.props.navigation.navigate('AddOrEditVehicle')}
            title='إضافة مركبة' />

          <CustomButton
            onPress={() => this.props.
              navigation.navigate('Requests',
                {
                  screen: 'Pending'
                })}
            style={styles.Button}
            title='الطلبات' />

        </View>

        <FlatList
          data={this.state.vehicles}
          renderItem={(item, index) => this.renderVehicle(item, index)}
          keyExtractor={(index) => index.toString()}
          contentContainerStyle={{ alignItems: 'center' }}
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
    backgroundColor: colors.LightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal:5,
    marginVertical:3,
    width: 170,
    height: 40,
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
    fontSize: 20
  },
  ButtonText: {
    color: 'white',
    fontFamily: 'Tajawal_400Regular',
    fontSize: 23,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  addVehicleButton: {
    backgroundColor: colors.Green,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: {
      height: 3,
      width: 0
    },
    alignItems: 'center',
    marginBottom: 35,
    width: 70,
    height: 70,
    borderRadius: 60,
  },
  EmptyaddVehicleButton: {
    backgroundColor: colors.Green,
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
    marginBottom: 35,

    width: 180,
    height: 40,
    borderRadius: 10,
    color: 'white',
  },
  inputRow: {
    flexDirection: 'row',

    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
  },
  label:
  {
    alignSelf: 'flex-end', textAlign: 'right', fontFamily: 'Tajawal_400Regular', fontSize: 20
  },
  input:
    { textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20, color: colors.Green, marginHorizontal: 5, flex: 1 }


});

