import React , {Component} from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {firebase} from '../Configuration/firebase'
import Person from '../Screens/person'
import {SimpleLineIcons, MaterialCommunityIcons, FontAwesome, Entypo} from '../Constants/icons'
export default class Profile extends Component {

  state= {
   
  }
  handleSignOut= ()=>{
    firebase.auth().signOut();
}
   

  render(){


    return (
    <View style={styles.container}>
      <Person/>
      <View style={styles.list}>

      <TouchableOpacity 
      style={styles.listItem}
      onPress={()=>this.props.navigation.navigate('EditProfile')}>
          <Entypo name='chevron-right' size={20} style={{margin:5}}/>
          <Text style={styles.title}>
          تعديل بيانات الحساب
         </Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={styles.listItem}
      onPress={()=>this.props.navigation.navigate('creditCard')}>
          <Entypo name='chevron-right' size={20} style={{margin:5}}/>
          <Text style={styles.title}>
          بيانات البطاقة البنكية
         </Text>
      </TouchableOpacity>

          <TouchableOpacity 
      style={styles.listItem}
      onPress={()=>this.props.navigation.navigate('FAQ')}>
          <Entypo name='chevron-right' size={20} style={{margin:5}}/>
          <Text style={styles.title}>
            الأسئلة الشائعة
          </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
      style={styles.listItem}
      onPress={()=> this.handleSignOut()}>
        <Entypo name='chevron-right' size={20} style={{margin:5}}/>
          <Text style={styles.title}>
            تسجيل الخروج
          </Text>
      </TouchableOpacity>
      </View>
     
                </View>
  );
  
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  listItem:{
    flexDirection:'row-reverse',
    justifyContent:'flex-start',
    alignItems:'flex-end',
    margin:10,
    width:300,
    height:34,
    borderColor:'grey',
    borderWidth:1,
    borderTopWidth:0,
    borderLeftWidth:0,
    borderRightWidth:0,
  },
  list:{
    alignItems:'flex-end',
    justifyContent:'flex-end',
    marginLeft:40,
    marginBottom:140

  },
  title:{
    marginBottom:5,
    color:'black',
    fontSize:20
  }


});

