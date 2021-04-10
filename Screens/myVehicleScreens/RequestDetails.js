import React, { Component } from 'react';
import { StyleSheet, Animated, Text, View, Alert, TouchableOpacity, Image, Linking } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { Rating, AirbnbRating, } from 'react-native-ratings';
import CustomButton from '../../components/CustomButton';

import colors from '../../Constants/colors';
import { database, auth } from '../../Configuration/firebase';
import { firebase } from '../../Configuration/firebase'
import { ModalComponent } from '../../Constants/Components/Modal';


export default class OwnerRequestDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRequest: props?.route?.params?.currentRequest,
      currentBorrower: null,
      isDayOfTrip: false,
      image: 'data:image/png;base64,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'
    }
  }

  componentDidMount = () => {
    console.log('in request details')

    console.log(this.state.currentRequest)
    this.retrieveBorrower(this.state.currentRequest.borrowerID);

    //check day of trip
    this.isDayOfTrip();


  }

  isDayOfTrip = () => {
    // if (this.state.currentRequest.)
    console.log('check day of trip')
    var bookedDate = new Date(this.state.currentRequest.details.bookedDates[0])
    var currentDate = new Date();

    console.log(currentDate.toDateString() == bookedDate.toDateString())
    if (currentDate.toDateString() == bookedDate.toDateString())
      this.setState({ isDayOfTrip: true });

  }
  retrieveBorrower = async (user) => {

    await database.collection('users').doc(user).get().then((doc) => {

      this.setState({
        borrowerName: doc.data().name,
        mobileNumber: doc.data().mobileNumber,
        Rating: doc.data().Rating,

      })

    })

    var ref = firebase.storage()
      .ref()
      .child('userImages/' + user);

    // Get the download URL
    ref.getDownloadURL()
      .then((url) => {
        this.setState({ image: url })
      }).catch((error) => {
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

  successMessage = (message) => {
    showMessage({
      message: message,
      type: "success",
    });
  }


  failureMessage = (message) => {
    showMessage({
      message: message,
      type: 'danger'
    });
  }

  TimerComponent = () => {


    Date.prototype.addHours = function (h) {
      this.setTime(this.getTime() + (h * 60 * 60 * 1000));
      return this;
    }

    switch (this.state.currentRequest.status) {
      case 'pending':
        var countdown = new Date(this.state.currentRequest.requestTime).addHours(12) - new Date();
        break;
      case 'accepted':
        var countdown = new Date(this.state.currentRequest.requestAcceptTime).addHours(12) - new Date();
        break;
      default: var countdown = new Date(this.state.currentRequest.requestTime).addHours(12) - new Date();

    }

    if (countdown <= 0) return

    const children = ({ remainingTime }) => {
      const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % 3600) / 60)
      const seconds = Math.floor((remainingTime % 60))

      return `${hours}:${minutes}:${seconds}`
    }

    return (
      <CountdownCircleTimer
        isPlaying
        size={80}
        onComplete={() => {
          this.handleCancelRequest('cancelled', true)
          return [true, 1500] // repeat animation in 1.5 seconds
        }}
        duration={countdown}
        colors={[
          ['#004777', 0.3],
          ['#F7B801', 0.3],
          ['#A30000', 0.3],
        ]}
      >
        {({ remainingTime, animatedColor }) => (
          <Animated.Text style={{ color: animatedColor }}>
            {children({ remainingTime })}
          </Animated.Text>
        )}
      </CountdownCircleTimer>)
  }

  handleCancelRequest = (status, automatically) => {

    if (automatically) {
      var batch = database.batch();

      var trip = database.collection('Trips').doc(this.state.currentRequest.tripID);
      batch.update(trip, { status: status });

      var borrowerRequest = database.collection('users').doc(this.state.currentRequest.borrowerID)
        .collection('Requests').doc(this.state.currentRequest.tripID);
      batch.update(borrowerRequest, { status: status });

      var ownerRequest = database.collection('users').doc(auth.currentUser.uid)
        .collection('Requests').doc(this.state.currentRequest.tripID);
      batch.update(ownerRequest, { status: status });
      batch.commit().then(() => {
        this.props.navigation.pop();
      })

    } else {
      Alert.alert(
        "إلغاء الطلب",
        "هل أنت متأكد من إلغاء الطلب ؟ ",
        [{
          text: " إلغاء الطلب ",
          

          onPress: () => {
            var batch = database.batch();

            var trip = database.collection('Trips').doc(this.state.currentRequest.tripID);
            batch.update(trip, { status: status });

            var borrowerRequest = database.collection('users').doc(this.state.currentRequest.borrowerID)
              .collection('Requests').doc(this.state.currentRequest.tripID);
            batch.update(borrowerRequest, { status: status });

            var ownerRequest = database.collection('users').doc(auth.currentUser.uid)
              .collection('Requests').doc(this.state.currentRequest.tripID);
            batch.update(ownerRequest, { status: status });
            batch.commit().then(() => {
              // on success
              if (status == 'reject') {
                this.successMessage('تم الرفض بنجاح')
                database.collection('users').doc(this.state.currentRequest.borrowerID).get().then((doc) => {
                  let response = fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      to: doc.data().push_token,
                      sound: 'default',
                      title: "تم رفض الطلب",
                      body: "تم رفض الطلب"
                    })
                  })
                  console.warn({ response })

                })
                this.props.navigation.pop();
              }
              else {
                this.successMessage('تم الإلغاء بنجاح')
                database.collection('users').doc(this.state.currentRequest.borrowerID).get().then((doc) => {

                  let response = fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      to: doc.data().push_token,
                      sound: 'default',
                      title: "تم الغاء الطلب",
                      body: "تم الغاء الطلب"
                    })
                  })
                  console.warn({ response })

                })
                this.props.navigation.pop();
              }
            }
            ).catch(() => {
              this.failureMessage('يرجى المحاولة مرة أخرى')
            })
          },
          style: "destructive"

        },
        { text: "لا", },

        ],
        {
          cancelable: false
        },

      );
    }
  }

  handleDeleteRequest = () => {
    Alert.alert(
      "حذف الطلب",
      "هل أنت متأكد من حذف الطلب ",
      [
        { text: "لا", onPress: () => console.log("OK Pressed") },
        {
          text: " حذف الطلب ",

          onPress: () => {
            database.collection('users').doc(auth.currentUser.uid).collection('Requests').
              doc(this.state.currentRequest.tripID).delete().then(() => {

                // on success
                this.successMessage('تم الحذف بنجاح');
                this.props.navigation.pop();
              }
              ).catch(() => {
                this.failureMessage('يرجى المحاولة مرة أخرى')
              })
          },
          style: "destructive"

        },

      ],

    );


  }

  handleAcceptRequest = () => {

    var requestAcceptTime = new Date().toISOString();
    var batch = database.batch();

    var trip = database.collection('Trips').doc(this.state.currentRequest.tripID);
    batch.update(trip, { status: 'accepted', requestAcceptTime: requestAcceptTime });

    var borrowerRequest = database.collection('users').doc(auth.currentUser.uid)
      .collection('Requests').doc(this.state.currentRequest.tripID);
    batch.update(borrowerRequest, { status: 'accepted', requestAcceptTime: requestAcceptTime });

    var ownerRequest = database.collection('users').doc(this.state.currentRequest.borrowerID)
      .collection('Requests').doc(this.state.currentRequest.tripID);
    batch.update(ownerRequest, { status: 'accepted', requestAcceptTime: requestAcceptTime });


    batch.commit().then(() => {
      database.collection('users').doc(this.state.currentRequest.borrowerID).get().then((doc) => {
        let response = fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: doc.data().push_token,
            sound: 'default',
            title: "تم قبول الطلب",
            body: "تم قبول الطلب"
          })
        })
        console.warn({ response })

      })
      // on success
      this.successMessage('تم قبول الطلب بنجاح');
      this.props.navigation.pop();
    }
    )
  }

  handleCheckInTrip = () => {
    this.props.navigation.navigate('tripForm', { formType: 'checkIn', currentRequest: this.state.currentRequest });
  }
  handleCheckOutTrip = () => {
    this.props.navigation.navigate('tripForm', { formType: 'checkOut', currentRequest: this.state.currentRequest });
  }



  actionButton = () => {
    var status = this.state.currentRequest.status + '';
    var button;


    var statusColor = ''
    switch (status) {
      case 'pending': status = "ينتظر الرد"
        statusColor = colors.Subtitle
        button =

          <CustomButton
            style={{ marginTop: 10, backgroundColor: colors.Green, }}
            title={'قبول الطلب '}
            onPress={() => {
              this.handleAcceptRequest()
            }} />

        break;
      case 'accepted': status = 'ينتظر التأكيد'
        statusColor = colors.Subtitle
        break;
      case 'confirmed':
        statusColor = colors.Green
        if (this.state.isDayOfTrip == true)
          button = (<TouchableOpacity style={[styles.Button, { backgroundColor: statusColor, width: 150, marginHorizontal: 10, alignSelf: 'flex-start' }]}
            onPress={() => {
              this.handleCheckInTrip();
            }}>
            <Text style={[styles.ButtonText, { color: 'white' }]}>  ابدأ الرحلة   </Text>
          </TouchableOpacity>)
        break;
      case 'completed':
      case 'rejected': status = 'لم يتم التأكيد'
      case 'cancelled': status = 'لم يتم التأكيد'
        statusColor = '#fa4353'
        button = (<TouchableOpacity style={[styles.Button, { borderColor: statusColor, borderWidth: 1, width: 150, marginHorizontal: 10, alignSelf: 'flex-start' }]}
          onPress={() => {
            this.handleDeleteRequest();
          }}>
          <Text style={[styles.ButtonText, { color: statusColor }]}> حذف الطلب  </Text>
        </TouchableOpacity>)
        break;
      case 'locked':
        statusColor = colors.Subtitle
        button = (<TouchableOpacity style={[styles.Button, { borderColor: statusColor, borderWidth: 1, width: 150, marginHorizontal: 10, alignSelf: 'flex-start' }]}
          onPress={() => {
            this.handleCheckOutTrip();
          }}>
          <Text style={[styles.ButtonText, { color: statusColor }]}> إنهاء الرحلة </Text>
        </TouchableOpacity>)
      case 'checkedIn':
      case 'unlocked':
        break;
      default: status = 'معلقة ';
        statusColor = colors.Subtitle;
    }

    return button;

  }




  showProfile = () => {

    return (
      <View style={{ flexDirection: "row-reverse", marginVertical: 20 }} >
        <View style={{ alignSelf: 'flex-start', marginLeft: 8, marginRight: 30, }}>
          <Image
            style={styles.profilePicture}
            source={{
              uri: this.state.image
            }} />
        </View>
        <View style={{ flexDirection: 'column', alignSelf: 'center', alignItems: 'center', marginLeft: 100 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Rating type='star' ratingCount={5} readonly={true} imageSize={20} startingValue={this.state.userRating} style={{ marginBottom: 5 }} />
            {/* <Text style={{ color: '#f1c40f', fontSize: 20, fontFamily: 'Tajawal_300Light', marginHorizontal: 5, marginTop: 3 }}>{this.state.userRating}/5</Text> */}

            <Text style={styles.Name}>
              {this.state.borrowerName}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', marginBottom: 10 }}>

            <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  const phone = this.state.mobileNumber; //retrieve user phone
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
                style={{ padding: 8, borderRadius: 6, borderColor: '#3fc250', borderWidth: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#3fc250' }}>
                <Image source={{ uri: 'https://img.icons8.com/color/452/whatsapp--v1.png' }} style={{ width: 24, height: 24 }} />
                <Text style={[styles.Location, { color: '#fff' }]}>
                  {this.state.mobileNumber}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }

  showDetails = () => {
    return (


      <View style={{ justifyContent: "center", alignSelf: 'center' }}>

        <Text style={styles.ModalTitle}> معلومات المستأجر </Text>

        {this.showProfile()}

        <Text style={styles.ModalTitle}>تفاصيل طلب المركبة</Text>

        <View style={{ flexDirection: 'row-reverse', marginHorizontal: 20, marginVertical: 15 }}>
          <View style={{ flexDirection: 'column', marginHorizontal: 20 }}>
            <Text style={[styles.ModalLabel]}>تاريخ الحجز </Text>
            <Text style={[styles.ModalLabel, styles.ModalInput]}>{this.state.currentRequest.details.bookedDates} </Text>
          </View>

          <View style={{ flexDirection: 'column', }}>
            <Text style={styles.ModalLabel}> المبلغ الإجمالي </Text>
            <Text style={[styles.ModalLabel, styles.ModalInput]}>{this.state.currentRequest.totalAmount} ريال </Text>
          </View>
        </View>


        <View style={{ flexDirection: 'row-reverse', marginHorizontal: 20, marginVertical: 15 }}>
          <View style={{ flexDirection: 'column', marginHorizontal: 20 }}>
            <Text style={[styles.ModalLabel]}>نوع الإستلام </Text>
            <Text style={[styles.ModalLabel, styles.ModalInput]}>{this.state.currentRequest.details.pickupOption} </Text>
          </View>
        </View>



        <View style={{ flexDirection: 'row-reverse', marginHorizontal: 20, marginVertical: 15 }} >
          {this.state.currentRequest.status == 'pending' ?
            <View>
              <Text style={[styles.ModalTitle, { fontSize: 20, marginHorizontal: 10, flexWrap: 'wrap' }]}> الوقت المتبقي لقبولك للطلب </Text>
            </View> : this.state.currentRequest.status == 'accepted' ?
              <View>
                <Text style={[styles.ModalTitle, { fontSize: 20, marginHorizontal: 10, flexWrap: 'wrap-reverse' }]}> الوقت المتبقي لتأكيد المستأجر للطلب </Text>
              </View> : <View></View>}

        </View>
        {this.state.currentRequest.status == 'pending' || this.state.currentRequest.status == 'accepted' ?

          <View style={{ alignSelf: 'flex-end', marginRight: 40, marginVertical: 10 }}>
            {this.TimerComponent()}
          </View> : <View></View>}


        <View style={{ flexDirection: 'row-reverse', alignSelf: 'center', justifyContent: 'center', }}>
          {this.actionButton()}
          {this.state.currentRequest.status == 'pending' ? <View style={{ flexDirection: 'row-reverse', alignSelf: 'center', marginHorizontal: 10 }}>
            <CustomButton
              title={'إلغاء الطلب '}
              onPress={() => {
                this.handleCancelRequest('rejected');
              }} />

          </View> : <View></View>}


          {/* {//dont show cancel request button if the request is already rejected
this.state.currentRequest.status == 'rejected' || this.state.currentRequest.status == 'cancelled' || this.state.currentRequest.status =='completed'? <View>
<TouchableOpacity style={[styles.Button,{borderColor:'#fa4353',borderWidth:1,}]}
onPress={() => {
this.handleDeleteRequest();
}}>
<Text style={[styles.ButtonText,{color:'#fa4353'}]}> حذف الطلب </Text>
</TouchableOpacity>
</View>:<View></View>} */}

          {this.state.currentRequest.status == 'accepted' || this.state.currentRequest.status == 'confirmed' ? <View style={{ flexDirection: 'row-reverse', alignSelf: 'center', marginHorizontal: 10 }}>
            <CustomButton
              title={'إلغاء الطلب'}
              onPress={() => {
                this.handleCancelRequest('cancelled');
              }} /></View> : <View></View>}

        </View>
      </View>



    )
  }


  render() {
    return (
      <View style={styles.container}>
        { this.showDetails()}
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
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 10
  },
  Name: {
    marginVertical: 15,
    fontFamily: 'Tajawal_900Black',
    fontSize: 20
  },
  Location: {
    marginVertical: 3,
    // fontFamily: 'Tajawal_200ExtraLight',
    fontSize: 20,
    color: 'grey'
  },


  inputRow: {
    flexDirection: 'row',
    margin: 7,
    justifyContent: 'space-evenly'
  },
  ModalinputRow: {
    flexDirection: 'column',
    justifyContent: "center"
  },
  ModalTitle: {
    fontFamily: 'Tajawal_500Medium',
    fontSize: 25,
    marginHorizontal: 40,
    alignSelf: 'flex-end',
    color: colors.Subtitle,
  },

  ModalLabel:
  {
    marginVertical: 5,
    alignSelf: 'flex-end',
    fontSize: 25,
    fontFamily: 'Tajawal_300Light',
  },
  label: {
    textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20
  },
  input:
    { textAlign: 'left', fontFamily: 'Tajawal_400Regular', fontSize: 20, color: colors.LightBlue, marginHorizontal: 5 },
  ModalInput:
  {
    fontFamily: 'Tajawal_400Regular',
    fontSize: 22,
    marginBottom: 5,
    color: colors.LightBlue,
  },
  Button: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: {
      height: 3,
      width: 0
    },
    justifyContent: 'center',
    alignSelf: 'center',
    width: 180,
    height: 40,
    borderRadius: 10,
    color: 'white',
  },
  ButtonText: {
    fontFamily: 'Tajawal_500Medium',
    fontSize: 18,
    alignSelf: 'center',
    justifyContent: 'center',
  },



});