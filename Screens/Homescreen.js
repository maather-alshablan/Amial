import { StatusBar } from 'expo-status-bar';
import React , {Component} from 'react';
import { StyleSheet, Text, View, Button,Dimensions, Image, Picker } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Map from '../Screens/maps'
import colors from '../Constants/colors'
import { Entypo, FontAwesome5, Ionicons } from '../Constants/icons';
import SwitchSelector from "react-native-switch-selector";
import { color } from 'react-native-reanimated';


export default class Homescreen extends Component {

  state= {
    searchValue:null,
    mapView:false,
    selected:'white'
  }

  switchSelector = () =>{
 
    return(
      <SwitchSelector 
      initial={0}
      onPress={value => this.setState({ mapView: !this.state.mapView })}
      textColor={colors.LightBlue} //'#7a44cf'
      selectedColor={'white'}
      buttonColor={colors.LightBlue}
      borderColor={colors.LightBlue}
      style={{width:300, marginVertical:10}}
      hasPadding
      textStyle={{fontSize:15, fontFamily:'Tajawal_400Regular',margin:3,color:colors.Subtitle}}
      selectedTextStyle={{fontSize:15, fontFamily:'Tajawal_400Regular',margin:3 ,color:'white'}}
      options={[
        { label: "القائمة", customIcon:this.listViewIcon()}, //images.feminino = require('./path_to/assets/img/feminino.png')
        { label: "الخريطة", customIcon:this.mapViewIcon()  } //images.masculino = require('./path_to/assets/img/masculino.png')
      ]}
    />
    )
  }

  listViewIcon (){
    return(
      <Entypo name='list' 
      color={this.state.mapView? colors.LightBlue: 'white'}
      size={20}/> 
    )
  }

  mapViewIcon(){
    return(
      <FontAwesome5 name='map-marker-alt' 
      color={this.state.mapView?  'white': colors.Subtitle}
      size={20} /> 
    )
  }


  mapView = ()=>{

    return(
      <View style={{margin:20, marginRight:300}} >
        <Map/>
      </View>
    )
  }


  listView =()=>{

    return(
    < View style={{marginTop:300}} >
          <TouchableOpacity style={styles.Button}  onPress={()=> this.props.navigation.navigate('VehicleView')}>
            <Text>
              Request Vehicle 
            </Text>
          </TouchableOpacity>
        </View>)
  }

  render(){
    return (
    <View style={styles.container}>
       <Image
        source={require('../Constants/Logo/PNGLogo.png')} 
        style={styles.logo}/>
      <View style={styles.searchContainer}>
        <TextInput
        style={{justifyContent:'flex-end',textAlign:'right',padding:10,fontWeight:'600', fontFamily:'Tajawal_400Regular',color:'black',fontSize:20}}
        placeholder={'ابحث عن مركبة..'}
        value={this.state.searchValue}
        />
      </View>

      {this.switchSelector()}
      {this.state.mapView ? this.mapView() : this.listView()}
                </View>
  );
  
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
   // justifyContent: 'center',
  },
  searchContainer:{
    backgroundColor:'#cad1d1',
    width: Dimensions.get('window').width*0.70,
    height: 35,
    borderRadius:25,
  }, 
  logo:{
    height:150,
    width:200,
    resizeMode:'contain',
  },  
  Button:{
    backgroundColor:colors.LightBlue,
    justifyContent:'center',
    alignItems:'center',
    margin:10,
    width:150,
    height:30,
    borderRadius:10,
    color:'white'},
    ViewSelection:{
      margin:5,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
      borderWidth:0.8,
      width:120,
      borderRadius:10
    },
    viewSelectionContainer:{
    padding:5,
    marginHorizontal:4,
    alignSelf:'center'
    },
    selectedView:{
      
    }
});

