import { StatusBar } from 'expo-status-bar';
import React , {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';
import colors from '../../Constants/colors';
import Modal from 'react-native-modal';

import RequestVehicle from '../myVehicleScreens/requestVehicle'



export default class viewVehicle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalVisible:false,
        }
    }


    
    
        toggleModal = () => {
          this.setState({isModalVisible: !this.state.isModalVisible});
        };
   

    render(){
        return(
            <View style={styles.container}>
                < View >
          <TouchableOpacity style={styles.Button} onPress={()=> this.setState({isModalVisible:true}) }>
            <Text>
              Request Vehicle 
            </Text>
          </TouchableOpacity>
          <Modal 
          isVisible={this.state.isModalVisible}
          style={styles.Modal}
          >
          <View style={{
      height: '60%',
      width:400,
      marginTop: 'auto',
      backgroundColor:'white'
    }}>
<View style={{ alignSelf:'center'}}>
            <Text style={styles.requestModalTitle}>طلب حجز المركبة</Text>
           
            <Text style={styles.requestModalLabel}>التواريخ المتاحة </Text>

            <Text style={styles.requestModalLabel}>نوع الإستلام </Text>

            <Text style={styles.requestModalLabel}>المجموع</Text>

            <Button title="Hide modal" onPress={()=> {this.setState({isModalVisible:false})}}/>
            </View>
            </View>
            </Modal>
        </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
    },Button:{
        backgroundColor:colors.LightBlue,
        justifyContent:'center',
        alignItems:'center',
        margin:10,
        width:150,
        height:30,
        borderRadius:10,
        color:'white'},
        Modal:{
           // backgroundColor:'white',
           alignSelf:'center',
           borderTopEndRadius:120
            
        },
        requestModalTitle:{
            fontFamily:'Tajawal_500Medium',
            fontSize:35,
            marginTop:25,
            color:colors.LightBlue,
            alignSelf:'center'},

        requestModalLabel:
            {
            alignSelf:'flex-end',
            marginVertical:30,
            marginLeft:150,
            fontSize:25,
            fontFamily:'Tajawal_300Light',
            }
})