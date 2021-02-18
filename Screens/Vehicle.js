import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image, ImageBackgroundBase } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { database } from '../Configuration/firebase';
import { auth } from 'firebase';
import colors from '../Constants/colors';


export default class Vehicle extends Component {

  state = {
    hasVehicle: null,
    vehicles:[]
  }

  async componentDidMount(){

   // this.determineUserHasVehicle();
   this.setState({hasVehicle:true})
  }


  determineUserHasVehicle = async () => {

    database.collection('vehicle').where("ownerID"==auth().currentUser.uid).get().then((doc) => {
      if (doc.empty) 
      {
        this.setState({hasVehicle: false});
      }
      else{
        this.setState({hasVehicle: true});
        this.setState({vehicles: doc.data()});
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
  }



  userHasNoVehicle = () =>{
    return(
      <View style={{alignSelf:'center', justifyContent:'center',marginVertical:280}}>
       <Text style={styles.emptyTripsText}> لا يوجد مركبة..</Text>
       <Text style={styles.emptyTripsText}> قم بمشاركة مركبتك على اميال</Text>

        </View>
    )
  }


  userHasVehicle = () => {
return(
  <View>
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', borderBottomWidth:1, borderColor:colors.LightBlue }}>
              <TouchableOpacity style={styles.Button} onPress={() => this.props.navigation.navigate('ManageVehicle')}>
                <Text style={styles.optionText}>إدارة المركبة</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.Button} onPress={() => this.props.navigation.navigate('Requests',{VehicleOwner:true})}>
                <Text style={styles.optionText}>الطلبات</Text>
              </TouchableOpacity>
            </View>
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
  emptyTripsText:{
    fontFamily:'Tajawal_700Bold',
    fontSize:20,
    color:'grey',
    marginVertical:10,
  },
  optionText:{
    fontFamily:'Tajawal_500Medium',
    color:'white',
    justifyContent:'center',
    fontSize:18

  }

});

