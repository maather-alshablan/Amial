import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image,FlatList, Dimensions, Linking } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Modal from 'react-native-modal';


import colors from '../../Constants/colors';
import { ModalComponent } from '../../Constants/Components/Modal';
import { database, auth } from '../../Configuration/firebase';
import { MaterialCommunityIcons, EvilIcons } from '../../Constants/icons';


export default class PendingRequests extends Component {
  constructor(props) {
    super(props);
    this.state ={
    request: [],
    isModalVisible: false,
    hasRequest:false

  }}

  componentDidMount = async () =>{
    
    this.retreiveRequests();
  }


  retreiveRequests = async ()=>{


            console.log('user is borrower')
            await  database.collection('Trips')
            .where("borrowerID",'==',auth.currentUser.uid)
            .where('status','==','pending')
            .get().then((querySnapshot)=>{
            if (!querySnapshot.empty){
              let requests = []
              console.log(querySnapshot.size,' Pending Requests found')

              querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                requests.push(doc.data());
            });
            this.setState({request: requests, hasRequest:true});
            console.log('array > ', this.state.request)
      } else console.log('No Pending requests found')
            })
  }

  userHasNoRequests = () => {
    return (
      <View style={{ alignSelf: 'center', justifyContent: 'center', marginVertical: 180 }}>
         <MaterialCommunityIcons name={'car-traction-control'} size={150} color={colors.Subtitle} style={{marginHorizontal:100, bottom:30}}/>
        <Text style={styles.emptyTripsText}> لا يوجد لديك رحلة معلقة</Text>

      </View>
    )
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };


  showDetails = ({item})=>{
    return(
      <Modal 
      onBackdropPress={() => this.toggleModal()}
      onSwipeComplete={() => this.toggleModal()}
      swipeDirection='down'
      isVisible={this.state.isModalVisible}
        style={styles.Modal}
        >
        <View style={{
    height: Dimensions.get('screen').height-400,
    width:Dimensions.get('screen').width-40,
    alignSelf:'center',
    backgroundColor:'white' }}>
      <TouchableOpacity onPress={()=>this.toggleModal()}>
                  <EvilIcons name={'close'} size={30} style={{position:'absolute', top:20, left:20}} onPress={()=>this.toggleModal()}/>
                  </TouchableOpacity>

                  <View style={{ alignSelf:'center',justifyContent:"center"}}>
                 
            <Text style={styles.ModalTitle}>تفاصيل طلب المركبة</Text>

            <Text style={styles.ModalLabel}>تاريخ حجز المركبة  </Text>

            <Text style={styles.ModalLabel}>نوع الإستلام   </Text>

            <Text style={styles.ModalLabel}>العنوان  </Text>

            <Text style={styles.ModalLabel}> المبلغ الإجمالي   </Text>
            


                    </View>
                    
                    </View>
                    </Modal>

    )
  }

  renderRequest = ({ item, index }) => {
    
   
    return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        this.setState({isModalVisible:true})
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
        direction: 'rtl',
        padding: 12,
        alignSelf: 'center'
      }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        <View style={{ padding: 10 }}>
          <View style={styles.inputRow}>
          <Text style={styles.label}>نوع المركبة </Text>
          <Text style={styles.input}> BMW</Text>
          </View>
          <View style={styles.inputRow}>
          <Text style={styles.label}> نوع التسليم </Text>
          <Text style={styles.input}> {item.details.pickupOption}</Text>
          </View>
          {/* <View style={styles.inputRow}>
          <Text style={styles.label}>اسم المستأجر</Text>
          <Text style={styles.input}> Faisal</Text>
          </View> */}

          <View style={styles.inputRow}>
          <Text style={styles.label}>الحالة</Text>
          <Text style={[styles.label, {color:colors.Subtitle}]}> لم يتم الدفع</Text>
          </View>
        </View>
        <View style={{ width: 120, height: 80 }}>
          <Image source={{ uri: item.image
            }} style={{ width: '100%', height: '100%' }} />
        </View>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
        <TouchableOpacity
          onPress={() => {
            const phone = "05555555" //retrieve user phone
            Linking.canOpenURL('https://api.whatsapp.com/send?' + 'phone=' + phone)
              .then(supported => {
                if (!supported) {
                  showMessage({
                    message: 'يرجى تنزيل برنامج الواتس اب',
                    type: 'danger',
                    style: {}
                  });
                } else {
                  return Linking.openURL('https://api.whatsapp.com/send?' + 'phone=' + phone).catch(e => console.warn(e));
                }
              })
          }}
          style={{ padding: 8, borderRadius: 6, borderColor: '#3fc250', borderWidth: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: 'https://img.icons8.com/color/452/whatsapp--v1.png' }} style={{ width: 24, height: 24 }} />
          <Text style={{ marginLeft: 8, fontFamily: 'Tajawal_400Regular',  }}>تواصل مع المستأجر</Text>
        </TouchableOpacity>
      </View>

    </TouchableOpacity>)
     
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.hasRequest  ?
          <FlatList
            data={this.state.request}
            renderItem={this.renderRequest}
            contentContainerStyle={{ alignItems: 'center' }}
          />  :      this.userHasNoRequests()
        }

        {this.state.isModalVisible? this.showDetails():<View></View>}
        <ModalComponent />
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
  },  Modal:{
    // backgroundColor:'white',
    alignSelf:'center',
     color: '#5dbcd2',
     fontFamily: 'Tajawal_400Regular'
 },
  inputRow:{
      flexDirection:'row',
      margin:7,
      justifyContent:'space-evenly'
  },ModalTitle:{
    fontFamily:'Tajawal_500Medium',
    fontSize:30,
    marginVertical:30,
    marginLeft:25,
    color:colors.LightBlue,
    textAlign:'right'},
    ModalLabel:
            {
            alignSelf:'flex-end',
            marginVertical:20,
            marginHorizontal:30,
            marginLeft:150,
            fontSize:25,
            fontFamily:'Tajawal_300Light',
            },

  label:{
     textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20 
  },
  input:{textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20 , color:colors.LightBlue, marginHorizontal:5}

});

