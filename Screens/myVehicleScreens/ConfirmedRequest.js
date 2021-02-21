import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native';
import colors from '../../Constants/colors';
import { database, auth } from '../../Configuration/firebase';
import { MaterialCommunityIcons } from '../../Constants/icons';


export default class ConfirmedRequests extends Component {
  constructor(props) {
    super(props);
    this.state = {
    requests: [{}, {}, {}],
    hasRequest:false
  }}
  componentDidMount() {
    this.retrieveConfirmedTrips();
  }

 

   retrieveConfirmedTrips = async () => {
    // user is a vehicle owner
      console.log('user is owner')

      await database.collection('Trips')
      .where("ownerID",'==',auth.currentUser.uid)
      .where('status','==','confirmed')
      .get().then((querySnapshot)=>{
      if (!querySnapshot.empty){
        let requests = []
        console.log(querySnapshot.size,' Confirmed Requests found')

        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          requests.push(doc.data());
      });
      this.setState({request: requests,hasRequest:true});
      console.log('array > ', this.state.request)
      } else console.log('No confirmed requests found')
      })
  }

  userHasNoRequests = () => {
    return (
      <View style={{ alignSelf: 'center', justifyContent: 'center', marginVertical: 280 }}>
   
   <MaterialCommunityIcons name={'car-traction-control'} size={150} color={colors.Subtitle} style={{marginHorizontal:100, bottom:30}}/>
        <Text style={styles.emptyTripsText}> لا توجد لديك رحلة مؤكدة</Text>

      </View>
    )
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

        {this.state.hasRequest  ?
          <FlatList
            data={this.state.requests}
            renderItem={this.renderRequest}
            contentContainerStyle={{ alignItems: 'center' }}
          />
          : this.userHasNoRequests()
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
    textAlign:'center',
    fontSize: 25,
    fontFamily: "Tajawal_500Medium"
  }

});


