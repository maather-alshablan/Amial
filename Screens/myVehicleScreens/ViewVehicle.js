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
      height: '50%',
      width:400,
      justifyContent:'center',
      marginTop: 'auto',
      backgroundColor:'white'
    }}>
            <Text>Request  Vehicle</Text>
            <Text>Pick up - drop off dates  </Text>
            <Text>Pick Up Option </Text>
            <Text>Total Summary</Text>


            <Button title="Hide modal" onPress={()=> {this.setState({isModalVisible:false})}}/>
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
            
        }
})