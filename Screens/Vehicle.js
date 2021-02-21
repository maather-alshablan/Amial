import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableHighlight, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { database } from '../Configuration/firebase';
import { auth } from 'firebase';
import colors from '../Constants/colors';
import { Ionicons } from '../Constants/icons';


export default class Vehicle extends Component {
  constructor(props){
    super(props);
  this.state = {
    hasVehicle: null,
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
      //  desc: 'desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3'
      },
    ]}
  } 

   async componentDidMount() {

     await this.determineUserHasVehicle();
    //this.setState({ hasVehicle: false })
  }


  determineUserHasVehicle =  () => {
   // console.log('true')

     database.collection('Vehicle').where("ownerID" ,'==', auth().currentUser.uid).get().then((doc) => {
      console.log('true')

      if (doc.empty) {
        console.log('true')
        this.setState({ hasVehicle: false });
      }
      else {

        let vehicles =[]
        doc.forEach((vehicle)=>{
          vehicles.push(vehicle.data())
        })
        this.setState({ hasVehicle: true });

        this.setState({ vehicles: vehicles }); 
      }
    
    }).catch((error) => {
      console.log("Error getting document:", error);
    });
  }



  userHasNoVehicle = () => {
    return (
      <View>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', borderBottomWidth: 1, borderColor: colors.Subtitle }}>
         <View style={{
    backgroundColor:  colors.Subtitle,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    width: 170,
    height: 40,
    borderRadius: 10,
    color: 'white'
  }} >
           <Text style={styles.optionText}>إدارة المركبة</Text>
         </View>

         <View style={{
    backgroundColor:  colors.Subtitle,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    width: 170,
    height: 40,
    borderRadius: 10,
    color: 'white'
  }} >
           <Text style={styles.optionText}>الطلبات</Text>
         </View>
       </View>
       <FlatList
         data={this.state.items}
         renderItem={this.renderItem}
         contentContainerStyle={{ paddingTop: 5 }}
       />

         <TouchableOpacity style={styles.addVehicleButton}    
         onPress={() => {
       this.props.navigation.navigate('AddOrEditVehicle')
     }}>
           <Ionicons name={'add'} color={'white'} size={25} style={{marginBottom:3, right:7}}/>
         <Text style={styles.ButtonText}> إضافة مركبة </Text>

         </TouchableOpacity>
      
     </View>
    )
  }

  renderItem = ({ item, index }) => {
    return (
      <View style={{ flexDirection: 'row', direction: 'rtl', flex: 1,top:100 }}>
        <View style={{}}>
          <View style={{ width: 32, height: 32, borderRadius: 16, borderColor: '#5dbcd2', borderWidth: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18,fontFamily: 'Tajawal_500Medium', color:colors.Subtitle}}>{index + 1}</Text>
            {/* for the timeline */}
          </View>
          {index == this.state.items.length - 1 ? null : <View style={{ flex: 1, width: 2,height:40, backgroundColor: '#5dbcd2', alignSelf: 'center' }}></View>}
        </View>
        <View style={{ padding: 12, paddingTop: 0, paddingBottom: 24, flex: 1, }}>
          <Text style={{ textAlign: 'left', fontSize: 24, fontWeight: 'bold', marginBottom: 70, fontFamily: 'Tajawal_500Medium',color:colors.Subtitle}}>{item.title}</Text>
          <Text style={{ textAlign: 'left', fontSize: 18 }}>{item.desc}</Text>
        </View>
      </View>
    )
  }
  userHasVehicle = () => {
    return (
      <View>
       <View style={{ flexDirection: 'row-reverse', alignItems: 'center', borderBottomWidth: 1, borderColor: colors.LightBlue }}>
          <TouchableOpacity style={styles.Button} onPress={() => this.props.navigation.navigate('AddOrEditVehicle')}>
            <Text style={styles.optionText}>إدارة المركبة</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.Button} onPress={() => this.props.
          navigation.navigate('Requests', 
          { screen: 'Pending',
            params:{VehicleOwner: true} 
            })}>
            <Text style={styles.optionText}>الطلبات</Text>
          </TouchableOpacity>
        </View>
     

          <TouchableOpacity style={styles.addVehicleButton}    
          onPress={() => {
        this.props.navigation.navigate('AddOrEditVehicle')
      }}>
            <Ionicons name={'add'} color={'white'} size={25} style={{marginBottom:3, right:7}}/>
          <Text style={styles.ButtonText}> إضافة مركبة </Text>

          </TouchableOpacity>
       
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
    backgroundColor:  colors.LightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
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
  ButtonText:{
    color:'white',
    fontFamily:'Tajawal_400Regular',
    fontSize:23,
    alignSelf:'center',
    justifyContent:'center',
    

},
addVehicleButton:{
  flexDirection:'row-reverse',
    backgroundColor: '#5dbcd2',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal:90,
    marginVertical:60,
    width: 200,
    height: 40,
    borderRadius: 10,
    color: 'white',

  
}

});

