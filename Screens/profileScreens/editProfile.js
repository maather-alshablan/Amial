import React , {Component} from 'react';
import { StyleSheet, View, Text, TextInput,Image , ScrollView } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
import {firebase, database} from '../../Configuration/firebase'
import {FontAwesome, Entypo } from '../../Constants/icons'
import colors from '../../Constants/colors';
import * as ImagePicker from 'expo-image-picker';
import { auth } from 'firebase';
import  { showMessage, hideMessage } from "react-native-flash-message";

import {ModalComponent} from '../../Constants/Components/Modal'


export default class editProfile extends Component{
  
      constructor(props) {
        super(props);
        this.state = {
        userId: firebase.auth().currentUser.uid,
         hasCameraPermission: null,
         image: 'data:image/png;base64,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',
         name:'',
         nationalID:'',
         email: firebase.auth().currentUser.email,
         mobileNumber:'',
         password:'',
         DoB:'',
         errorMessage:null
        }
       }
      async componentDidMount() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        this.setState({ hasCameraPermission: status === "granted" });
    
        this.retrieveProfileImage();
        this.retrieveUserInfo();

       }
    
      retrieveUserInfo = async () =>{

        
        const documentSnapshot = await database
        .collection('users')
        .doc(this.state.userId)
        .get().catch(()=>
        this.setState({errorMessage: 'يرجى الحفظ  '})
        )

      const userData = documentSnapshot.data();
        this.setState({
          nationalID: userData.nationalID,
          name: userData.name,
          password:userData.password,
          mobileNumber: userData.mobileNumber,
      })}

      handleSaveInfo = () => {
        
        //check name constraint

        //check email constraint 

        //check mobile number constraint 

        


        database.collection('users').doc(this.state.userId).update({
          name: this.state.name,
          email: this.state.email,
          mobileNumber: this.state.mobileNumber,
        }).then(()=>{
          firebase.auth().currentUser.updateEmail(this.state.email);
        }).catch(()=>{
          console.log('failure')
          this.failureMessage()
        }).then(()=>{this.successMessage() })


      }

      retrieveProfileImage(){
        // this is profile or someone else profile
        var personID = this.state.userId
    
        var ref = firebase
        .storage()
        .ref()
        .child('userImages/'+personID);
    // Get the download URL
    ref.getDownloadURL()
    .then((url) => {
     this.setState({image:url})
    })
    .catch((error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
    
        // ...
    
        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    });
      }
      uploadImageToStorageasync= async (uri, userUID)=> {


        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = () => {
              resolve(xhr.response);
          };
          xhr.responseType = 'blob';
          xhr.open('GET', uri, true);
          xhr.send(null);
        });
        
        const ref = firebase
          .storage()
          .ref()
          .child('userImages/'+userUID);
        
        let snapshot = await ref.put(blob);
        console.log(snapshot.ref.getDownloadURL())
        return await snapshot.ref.getDownloadURL();
        
        }
        

 pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log(result);
  
    if (!result.cancelled) {
      this.setState({image:result.uri});
      this.uploadImageToStorageasync(result.uri,auth().currentUser.uid)
    }
  };

  successMessage= ()=> {
    showMessage({
      message:"تم الحفظ بنجاح",
      type: "success",
    });
  }

  
  failureMessage= ()=> {
    showMessage({
      message:  'يرجى محاولة الحفظ مرة أخرى',
      type: 'danger'
    });
  }

    render(){

        const { image, hasCameraPermission } = this.state;

        return(
       //   <ScrollView>
            <View style={styles.container}>
        
                  <TouchableOpacity onPress={this.pickImage.bind(this)} >
              <Image 
              style={styles.profilePicture} 
              source={{
                uri: image
              }}/>
              <Entypo name="plus" color={'white'} size={50} style={{ position: 'absolute', top: 35, left: 35 }} />
              </TouchableOpacity>

                

<View style={{margin:10}}></View>
        {this.state.errorMessage ?  
        <View style={{margin:10}}>
         <Text style={{ color: 'red' }}>
            {this.state.errorMessage}</Text> </View> : <View>
            </View>}


      <View style={styles.InputView}>
      <FontAwesome name='flag' color={colors.Subtitle} size={30} style={styles.icon}  />
      <TextInput
      style={styles.InputField}
      placeholder='الهوية/ الإقامة'
      editable={false}
      value={this.state.nationalID}
      />
      </View>


      <View style={styles.InputView}>
      <FontAwesome name='user' color={colors.Subtitle} size={30} style={styles.icon}  />
      <TextInput
      style={styles.InputField}
      placeholder='الإسم الكامل'
      onChangeText={name => this.setState({ name:name })}
      value={this.state.name}
      returnKeyType={'done'}

      />
      </View>


      <View style={styles.InputView}>
      <Entypo name='mail' color={colors.Subtitle} size={30} style={styles.icon}  />
      <TextInput
      style={styles.InputField}
      placeholder='البريد الإلكتروني'
      onChangeText={email => this.setState({ email : email})}
      value={this.state.email}
      returnKeyType={'done'}

      />
      </View>

      <View style={styles.InputView}>
      <Entypo name='lock' color={colors.Subtitle} size={30} style={styles.icon}  />
      <TextInput
      style={styles.InputField}
      value={this.state.password}
      secureTextEntry
      editable={false}
      onTouchStart={()=>this.props.navigation.navigate('changePassword')}
      />
      </View>

      <View style={styles.InputView}>
      <FontAwesome name='mobile-phone' color={colors.Subtitle} size={30} style={styles.icon}  />
      <TextInput
      style={styles.InputField}
      placeholder='رقم التواصل' 
      onChangeText={phoneNumber => this.setState({ mobileNumber : phoneNumber})}
      value={this.state.mobileNumber}
      keyboardType={"phone-pad"}
      returnKeyType={'done'}
      maxLength={10}
      rejectResponderTermination={true}
      />
      </View>
     

      <View >
        <TouchableOpacity style={styles.Button} onPress = {() => this.handleSaveInfo()}>
      <Text style={{color:'white',fontFamily:'Tajawal_400Regular',fontSize:25}}>حفظ </Text>
      </TouchableOpacity>
      </View>


        <ModalComponent/>
       
              </View>
           //   </ScrollView>
        )
    }
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },  InputField:{
        paddingHorizontal: 10,
       textAlign:'right',
       color:'black',
       height: 30, 
       borderColor: 'gray',
       borderWidth: 1 ,
       width:250,
       borderStartColor:'white',
       borderEndColor:'white',
       borderTopColor:'white',
       fontSize:20
       },
       Button:{
         backgroundColor:colors.LightBlue,
         justifyContent:'center',
         alignItems:'center',
         margin:10,
         width:150,
         height:30,
         borderRadius:10,
         color:'white'
       },
       InputView:{
        flexDirection:'row-reverse',
        marginBottom:20,
        marginVertical:20
      },
      icon:{
          marginHorizontal:10
      },
      profilePicture:{
        width:120,
        height:120,
        borderRadius:60,
        marginBottom:10,
        opacity:0.8
    },
})
