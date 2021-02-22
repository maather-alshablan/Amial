import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button,Dimensions, Image, TouchableHighlight, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { database } from '../Configuration/firebase';
import { auth } from 'firebase';
import colors from '../Constants/colors';
import { Ionicons, FontAwesome5 } from '../Constants/icons';


export default class Vehicle extends Component {
  constructor(props){
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
      //  desc: 'desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3 desc3'
      },
    ]}
  } 

   async componentDidMount() {

  //   await this.determineUserHasVehicle();
     
  }


  determineUserHasVehicle =  () => {
   // console.log('true')

     database.collection('Vehicle').where("ownerID" ,'==', auth().currentUser.uid).get().then((doc) => {
      console.log('true')

      if (doc.empty) {
        console.log('user has no vehicles listed')
        this.setState({ hasVehicle: false });
      }
      else {

        let vehicles =[]
        doc.forEach((vehicle)=>{
          vehicles.push(vehicle.data())
        })
        this.setState({ hasVehicle: true , vehicles: vehicles }); 
        console.log(vehicles)
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

         <TouchableOpacity style={styles.EmptyaddVehicleButton}    
         onPress={() => {
       this.props.navigation.navigate('AddOrEditVehicle')
     }}>
           <Ionicons name={'add'} color={'white'} size={28} style={{top:3}}/>
         <Text style={styles.ButtonText}> إضافة مركبة </Text>

         </TouchableOpacity>
      
     </View>
    )
  }

  renderVehicle = ({ item, index }) => {
    return (<TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        // navigate to view
      }}
      style={{
        backgroundColor: '#fff',
        width: Dimensions.get('screen').width - 40,
        margin: 10,
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
          <View style={{ padding: 8 }}>
          <View style={styles.inputRow}>
          <Text style={styles.label}>نوع المركبة </Text>
          <Text style={styles.input}> {item.vehicleDetails.model}</Text>
          </View>

          <View style={styles.inputRow}>
          <Text style={styles.label}> لوحة المركبة</Text>
          <Text style={styles.input}> {item.LicensePlateNumber}</Text>
          </View>


          <View style={styles.inputRow}>
          <Text style={styles.label}>السعر اليومي</Text>
          <Text style={styles.input}> {item.dailyRate}</Text>
          </View>
          <View style={styles.inputRow}>
    <Text style={styles.input}> {<FontAwesome5 name={'star'} size={20}/>}{item.Rating} </Text>
          </View>
        </View>
        <View style={{ width: 120, height: 80 }}>
          <Image source={{ uri: item.vehicleDetails.image }} style={{ width: '100%', height: '100%' }} />
        </View>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>

      </View>

    </TouchableOpacity>)
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
          { screen: 'Pending'
            })}>
            <Text style={styles.optionText}>الطلبات</Text>
          </TouchableOpacity>
        </View>
     
        <FlatList
            data={this.state.vehicles}
            renderItem={this.renderVehicle}
            contentContainerStyle={{ alignItems: 'center' }}
           /> 

          <TouchableOpacity style={styles.addVehicleButton}    
          onPress={() => {
        this.props.navigation.navigate('AddOrEditVehicle')
      }}>
            <Ionicons name={'add'} color={'white'} size={50} style={{left:3}}/>

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
    backgroundColor: colors.Green,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
        shadowOffset: {
          height: 3,
          width: 0
        },
      },
EmptyaddVehicleButton:{
          backgroundColor: colors.Green,
          flexDirection:"row-reverse",
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 6,
              shadowOffset: {
                height: 3,
                width: 0
              },
    justifyContent:'center',
    alignSelf:'center',
    marginBottom:35,
    margin:20,
    width: 180,
    height: 40,
    borderRadius: 10,
    color: 'white',
},  
inputRow:{
  flexDirection:'row',
  margin:7,
  justifyContent:'flex-start'
},
label:
{
alignSelf:'flex-end', textAlign: 'right', fontFamily: 'Tajawal_400Regular', fontSize: 20 
},
input:
{textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20 , color:colors.Green, marginHorizontal:5}


});

