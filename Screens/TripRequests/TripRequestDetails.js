import React, { Component } from 'react';
import { StyleSheet, Animated, Text, View, Alert, TouchableOpacity, Image, Linking } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { Rating, AirbnbRating, } from 'react-native-ratings';
import { firebase } from '../../Configuration/firebase'
import colors from '../../Constants/colors';
import { database, auth } from '../../Configuration/firebase';
import { ModalComponent } from '../../Constants/Components/Modal';
import CustomButton from '../../components/CustomButton';
import Modal from 'react-native-modal';
import { RequestDropAuthorization } from '../components/RequestDropAuthorization';

export default class BorrowerRequestDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRequest: props?.route?.params?.currentRequest,
      currentOwner: null,
      cancellationReason: null,
      canReportOwnerNoShow: false,
      ReportModel: false,
      image: 'data:image/png;base64,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'
    }

    //var moyasar = Moyasar('pk_test_qyFJDZVw15LG99swFTTZeVc5bfwmZ7UVZowYNMxf');


  }

  componentDidMount = () => {
    console.log('in borrower request details')

    console.log(this.state.currentRequest)
    this.retrieveOwner(this.state.currentRequest.ownerID);
    this.canReportOwnerNoShow();


  }

  canReportOwnerNoShow = () => {
    // if (this.state.currentRequest.)
    console.log('checking if borrower can report owner no show')
    var bookedDate = new Date(this.state.currentRequest.details.bookedDates[0])
    var currentDate = new Date();


    var isDayOfTrip = currentDate.toDateString() == bookedDate.toDateString(); // is day of booking
    var isLaterThan3PM = currentDate.getHours() >= 15; // is later than 3 pm
    var isNotCheckedIn = this.state.currentRequest.status == 'confirmed' // is yet not checked in

    if (isDayOfTrip && isLaterThan3PM && isNotCheckedIn)
      this.setState({ canReportOwnerNoShow: true });

  }

  retrieveOwner = async (user) => {


    await database.collection('users').doc(user).get().then((doc) => {

      this.setState({
        ownerName: doc.data().name,
        mobileNumber: doc.data().mobileNumber,
        ID: doc.data().nationalID,
        Rating: doc.data().Rating,
        OwnertotalBalance: doc.data().totalBalance ? doc.data().totalBalance : 0
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
    var countdown = 0;

    switch (this.state.currentRequest.status) {
      case 'pending':
        countdown = new Date(new Date(this.state.currentRequest.requestTime).addHours(12)) - new Date();

        break;
      case 'accepted':
        countdown = new Date(new Date(this.state.currentRequest.requestAcceptTime).addHours(12)) - new Date();
        break;

    }
    console.log('countdown> ', countdown)
    console
    console.log('countdown:  ', new Date(new Date(this.state.currentRequest.requestTime).addHours(12)).getTime() - new Date().getTime())

    console.log('countdown', new Date().getHours());
    const children = ({ remainingTime }) => {
      const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % 3600) / 60)
      const seconds = Math.floor((remainingTime % 60))

      return `${hours}:${minutes}:${seconds}`
    }

    return (
      <CountdownCircleTimer
        isPlaying
        size={100}
        onComplete={() => {
          if (this.state.currentRequest.status == 'pending' || this.state.currentRequest.status == 'accepted')
            this.handleCancelRequest(true, true);
          return [true, 1500] // repeat animation in 1.5 seconds
        }}
        initialRemainingTime={countdown}
        duration={countdown}
        colors={[
          ['#004777', 0.4],
          ['#F7B801', 0.4],
          ['#A30000', 0.2],
        ]}
      >
        {({ remainingTime, animatedColor }) => (
          <Animated.Text style={{ color: animatedColor }}>
            {children({ remainingTime })}
          </Animated.Text>
        )}
      </CountdownCircleTimer>)
  }
  handleCancelRequest = async (automatically, timer) => {
    var cancellationReason;

    if (this.state.cancellationReason != null) // case where cancellationReason is not null is when borrower reports owner no show
      cancellationReason = this.state.cancellationReason

    if (this.state.currentRequest.status == 'confirmed') //drop request authorization
    {
      var borrowerRef = database.collection('users').doc(auth.currentUser.uid).get();
      var borrowerInfo = borrowerRef.data();
      var borrowerNationalID = borrowerInfo.nationalID;

      if (!RequestDropAuthorization(this.state.ID, borrowerNationalID, this.state.currentRequest.details.bookedDates))
        this.failureMessage('???????? ???????????????? ?????? ????????')
      return;
    }
    if (timer == true)
      cancellationReason = 'session-expired'

    if (automatically) {

      var batch = database.batch();

      var trip = database.collection('Trips').doc(this.state.currentRequest.tripID);
      batch.update(trip, { status: 'cancelled', cancellationReason: cancellationReason });

      var borrowerRequest = database.collection('users').doc(auth.currentUser.uid)
        .collection('Requests').doc(this.state.currentRequest.tripID);
      batch.update(borrowerRequest, { status: 'cancelled', cancellationReason: cancellationReason });

      var ownerRequest = database.collection('users').doc(this.state.currentRequest.ownerID)
        .collection('Requests').doc(this.state.currentRequest.tripID);
      batch.update(ownerRequest, { status: 'cancelled', cancellationReason: cancellationReason });

      batch.commit().then(() => {
        // on success

        this.props.navigation.pop();
        return;
      })
    } else {
      Alert.alert(
        "?????????? ??????????",
        "???? ?????? ?????????? ???? ?????????? ?????????? ???????? ???????????????? ",
        [
          { text: "????", onPress: () => console.log("OK Pressed") },
          {
            text: " ?????????? ?????????? ",

            onPress: () => {
              console.log('in cancel request ON PRESS')
              // this.props.navigation.pop();
              var batch = database.batch();

              var trip = database.collection('Trips').doc(this.state.currentRequest.tripID);
              batch.update(trip, { status: 'cancelled', cancellationReason: this.state.cancellationReason });

              var borrowerRequest = database.collection('users').doc(auth.currentUser.uid)
                .collection('Requests').doc(this.state.currentRequest.tripID);
              batch.update(borrowerRequest, { status: 'cancelled', cancellationReason: this.state.cancellationReason });

              var ownerRequest = database.collection('users').doc(this.state.currentRequest.ownerID)
                .collection('Requests').doc(this.state.currentRequest.tripID);
              batch.update(ownerRequest, { status: 'cancelled', cancellationReason: this.state.cancellationReason });

              batch.commit().then(() => {
                // on success
                console.log('cancel request is successful ')
                this.successMessage('???? ?????????????? ??????????');
                database.collection('users').doc(this.state.currentRequest.ownerID).get().then((doc) => {
                  let response = fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      to: doc.data().push_token,
                      sound: 'default',
                      title: '?????????? ??????????',
                      body: "???? ?????????? ??????????"
                    })
                  })
                  console.warn({ response })

                })
                this.props.navigation.pop();
              }
              ).catch((e) => {
                console.log('cancel request is unsuccessful ')
                console.log(e)

                this.failureMessage('???????? ???????????????? ?????? ????????')
              })
            },
            style: "destructive"

          },
        ],
      );
    }
  }

  handleDeleteRequest = () => {
    Alert.alert(
      "?????? ??????????",
      "???? ?????? ?????????? ???? ?????? ?????????? ",
      [

        { text: "????", onPress: () => console.log("OK Pressed") }, {
          text: " ?????? ?????????? ",

          onPress: () => {

            database.collection('users').doc(auth.currentUser.uid).collection('Requests').
              doc(this.state.currentRequest.tripID).delete().then(() => {

                // on success
                this.successMessage('???? ?????????? ??????????');
                this.props.navigation.pop();
              }
              ).catch(() => {
                this.failureMessage('???????? ???????????????? ?????? ????????')
              })
          },
          style: "destructive"

        },

      ],
      {
        cancelable: false
      },

    );


  }

  RequestVehicleAuthorization = async () => {
    // vehicle authorization ID made of 15 digits 
    var AuthorizationID = Math.floor(Math.random() * (100000000000000));

    var ownerNationalID = this.state.ID;
    var ownername = this.state.ownerName;


    var vehicleRef = await database.collection('Vehicle').doc(this.state.currentRequest.vehicleID).get();
    var vehicleInfo = vehicleRef.data();
    var licensePlateNumber = vehicleInfo.LicensePlateNumber;
    var vehicleModel = this.state.currentRequest.model;

    var authorizationStartDate = this.state.currentRequest.details.bookedDates;

    var borrowerRef = await database.collection('users').doc(auth.currentUser.uid).get();
    var borrowerInfo = borrowerRef.data();
    var borrowerNationalID = borrowerInfo.nationalID;
    var borrowerName = borrowerInfo.name;

    var RequestDocument = {
      AuthorizationNumber: AuthorizationID,
      StartDate: authorizationStartDate,
      Owner: {
        ID: ownerNationalID,
        Name: ownername,
      },
      vehicle: {
        licensePlateNumber: licensePlateNumber,
        model: vehicleModel
      },
      Driver: {
        ID: borrowerNationalID,
        Name: borrowerName
      }
    }

    return RequestDocument;
  }

  handleConfirmRequest = async () => {
    console.log("handleConfirmRequest")
    var RequestDocument = await this.RequestVehicleAuthorization();


    // Remove booked dates from vehicles availability dates
    var bookedDates = this.state.currentRequest.details.bookedDates;
    var availability = []

    var vehicleRef = database.collection('Vehicle').doc(this.state.currentRequest.vehicleID).get();
    var vehicleData = (await vehicleRef).data();
    availability = vehicleData.availability;

    var newAvailability = availability.filter(function (x) {
      return bookedDates.indexOf(x) < 0;
    });
    console.log('booked dates: ', bookedDates)
    console.log('availabliity dates: ', availability)

    console.log('new dates: ', newAvailability)


    var batch = database.batch();

    var Authorization = database.collection('DataSets').doc(RequestDocument.AuthorizationNumber.toString());
    batch.set(Authorization, { RequestDocument });

    var trip = database.collection('Trips').doc(this.state.currentRequest.tripID);
    batch.update(trip, { status: 'confirmed' , DriverAuthorization:RequestDocument.AuthorizationNumber});

    var borrowerRequest = database.collection('users').doc(auth.currentUser.uid)
      .collection('Requests').doc(this.state.currentRequest.tripID);
    batch.update(borrowerRequest, { status: 'confirmed' ,DriverAuthorization:RequestDocument.AuthorizationNumber});

    var ownerRequest = database.collection('users').doc(this.state.currentRequest.ownerID)
      .collection('Requests').doc(this.state.currentRequest.tripID);
    batch.update(ownerRequest, { status: 'confirmed' ,DriverAuthorization:RequestDocument.AuthorizationNumber});

    var vehicle = database.collection('Vehicle').doc(this.state.currentRequest.vehicleID)
    batch.update(vehicle, { availability: newAvailability })
    console.log("batch")

    batch.commit().then(() => {
      // Add owner balance
      var newBalance = this.state.OwnertotalBalance + this.state.currentRequest.totalAmount;
      this.setState({ OwnertotalBalance: newBalance })

      // on success
      this.successMessage('???? ?????????? ?????????? ??????????');
      this.props.navigation.pop();
    }
    ).catch(() => {
      this.failureMessage('???????? ???????????????? ?????? ????????')
      return;
    })
  }

  handleUnlock = () => {
    this.props.navigation.navigate('tripForm', { formType: 'unlock', currentRequest: this.state.currentRequest });
  }
  handleLock = () => {
    this.props.navigation.navigate('tripForm', { formType: 'lock', currentRequest: this.state.currentRequest });
  }

  actionButton = () => {
    var status = this.state.currentRequest.status + '';
    var button;


    var statusColor = ''
    switch (status) {
      case 'pending': status = "?????????? ????????"
        statusColor = colors.Subtitle

        break;
      case 'accepted': status = '?????????? ??????????????'
        statusColor = colors.Green
        button = (<TouchableOpacity style={[styles.Button, { backgroundColor: statusColor, width: 150, marginHorizontal: 10, alignSelf: 'flex-start' }]}
          onPress={() => {
            this.props.navigation.navigate('creditCard', {
              handleConfirmRequest: this.handleConfirmRequest,
              amount: this.state.currentRequest.totalAmount
            })
            // this.handleConfirmRequest();
          }}>
          <Text style={[styles.ButtonText, { color: 'white' }]}> ?????????? ?????????? </Text>
        </TouchableOpacity>)
        break;
      case 'checkedIn':
        statusColor = colors.Green
        button = (<TouchableOpacity style={[styles.Button, { backgroundColor: statusColor, width: 150, marginHorizontal: 10, alignSelf: 'flex-start' }]}
          onPress={() => {
            this.handleUnlock();
          }}>
          <Text style={[styles.ButtonText, { color: 'white' }]}> ???????? ???????????? </Text>
        </TouchableOpacity>)
        break;
      case 'unlocked':
        statusColor = colors.Subtitle
        button = (<TouchableOpacity style={[styles.Button, { borderColor: statusColor, borderWidth: 1, width: 150, marginHorizontal: 10, alignSelf: 'flex-start' }]}
          onPress={() => {
            this.handleLock();
          }}>
          <Text style={[styles.ButtonText, { color: statusColor }]}> ?????????? ?????????????? </Text>
        </TouchableOpacity>)
        break;
      case 'rejected': status = '???? ?????? ??????????????'
      case 'completed':
      case 'cancelled':
        statusColor = '#fa4353'
        button = (<TouchableOpacity style={[styles.Button, { borderColor: statusColor, borderWidth: 1, width: 150, marginHorizontal: 10, alignSelf: 'flex-start' }]}
          onPress={() => {
            this.handleDeleteRequest();
          }}>
          <Text style={[styles.ButtonText, { color: statusColor }]}> ?????? ?????????? </Text>
        </TouchableOpacity>)
        break;
      case 'active': status = '????????' //allow option to lock the car
        statusColor = colors.Subtitle
        button = (<TouchableOpacity style={[styles.Button, { borderColor: statusColor, borderWidth: 1, width: 150, marginHorizontal: 10, alignSelf: 'flex-start' }]}
          onPress={() => {
            this.handleLock();
          }}>
          <Text style={[styles.ButtonText, { color: statusColor }]}> ?????????? ?????????????? </Text>
        </TouchableOpacity>)
        break;
      default: status = '?????????? ';
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
              {this.state.ownerName}
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
                          message: '???????? ?????????? ???????????? ???????????? ????',
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

        <Text style={styles.ModalTitle}> ?????????????? ???????????? </Text>

        {this.showProfile()}

        <Text style={styles.ModalTitle}>???????????? ?????? ??????????????</Text>

        <View style={{ flexDirection: 'row-reverse', marginHorizontal: 20, marginVertical: 15 }}>
          <View style={{ flexDirection: 'column', marginHorizontal: 20 }}>
            <Text style={[styles.ModalLabel]}>?????????? ?????????? </Text>
            <Text style={[styles.ModalLabel, styles.ModalInput]}>{this.state.currentRequest.details.bookedDates} </Text>
          </View>

          <View style={{ flexDirection: 'column', marginRight: 20 }}>
            <Text style={styles.ModalLabel}> ???????????? ???????????????? </Text>
            <Text style={[styles.ModalLabel, styles.ModalInput]}>{this.state.currentRequest.totalAmount} ???????? </Text>
          </View>
        </View>


        <View style={{ flexDirection: 'row-reverse', marginHorizontal: 20, marginBottom: 15 }}>
          <View style={{ flexDirection: 'column', marginHorizontal: 20 }}>
            <Text style={[styles.ModalLabel]}>?????? ???????????????? </Text>
            <Text style={[styles.ModalLabel, styles.ModalInput]}>{this.state.currentRequest.details.pickupOption} </Text>
          </View>
        </View>



        <View style={{ flexDirection: 'row-reverse', marginHorizontal: 20, marginVertical: 15 }} >

          {this.state.currentRequest.status == 'pending' ?
            <View>
              <Text style={[styles.ModalTitle, { fontSize: 20, marginHorizontal: 10, flexWrap: 'wrap' }]}> ?????????? ?????????????? ?????????? ???????????? ?????????? </Text>
            </View> : this.state.currentRequest.status == 'accepted' ?
              <View>
                <Text style={[styles.ModalTitle, { fontSize: 20, marginHorizontal: 10, flexWrap: 'wrap-reverse' }]}> ?????????? ?????????????? ?????????????? ?????????? </Text>
              </View> : <View></View>}
        </View>

        {this.state.currentRequest.status == 'pending' || this.state.currentRequest.status == 'accepted' ?
          <View style={{ alignSelf: 'flex-end', marginRight: 40, marginVertical: 10 }}>
            {this.TimerComponent()}
          </View> : <View></View>}

        <View style={{ alignSelf: 'center', }}>
          {this.state.canReportOwnerNoShow ? <View>

            <TouchableOpacity

              onPress={() => {
                this.setState({ ReportModel: true })
              }}
              style={{ alignSelf: 'center', marginHorizontal: 10, marginTop: 10, flexDirection: 'row', marginBottom: 15 }}>
              <Text style={[styles.reportLabel, { fontSize: 20 }]} >
                ???????? ???????? ???????????????? ???????????? ????????????????
</Text></TouchableOpacity>
          </View> :
            <View></View>}
          <View style={{ flexDirection: 'row-reverse' }}>{this.actionButton()}

            {//dont show cancel request button if the request is already rejected
              this.state.currentRequest.status == 'pending' || this.state.currentRequest.status == 'accepted' || this.state.currentRequest.status == 'confirmed' ? <View>
                <CustomButton
                  onPress={() => {
                    console.log('cancel button')
                    this.handleCancelRequest();
                  }}
                  title="?????????? ??????????"
                />
              </View> :
                <View></View>}
          </View>

        </View>
      </View>


    )
  }

  reportNoShow = () => {
    console.log('inside no show modal')
    return (
      <View>
        <Modal
          onBackdropPress={() => this.setState({ ReportModel: !this.state.ReportModel })}
          onSwipeComplete={() => this.setState({ ReportModel: !this.state.ReportModel })}
          swipeDirection='down'
          isVisible={this.state.ReportModel}
          style={styles.Modal}>

          <View style={{
            height: '30%',
            width: 370,
            alignSelf: 'center',
            borderRadius: 10,
            backgroundColor: 'white'
          }}>
            <View>
              <Text style={[styles.modalLabel, { marginTop: 20, fontSize: 25, alignSelf: 'center' }]}>?????????? ??????????</Text>
              <Text style={[styles.DescriptionParagraph, { justifyContent: 'center', alignSelf: 'center', textAlign: 'justify', marginTop: 20, width: 300 }]}>
                ???????? ?????????? ?????????? ???? ?????? ?????? ?????? ???????? ???????????? ?????????? ??????????????</Text>
              <Text style={[styles.DescriptionParagraph, { fontFamily: 'Tajawal_700Bold', justifyContent: 'center', alignSelf: 'center', textAlign: 'justify', marginTop: 20, width: 300 }]}>
                ???? ?????? ?????????? ???? ?????????? ????????????
</Text>
              <CustomButton
                style={{ marginTop: 10, }}
                title={'??????????'}
                onPress={() => {
                  this.setState({ cancellationReason: 'owner no show' })
                  this.handleCancelRequest(true)
                }
                }
              />
            </View>
          </View>
        </Modal>
      </View>
    )
  }



  render() {
    return (
      <View style={styles.container}>
        {this.showDetails()}
        <View >
          {this.reportNoShow()}
        </View>
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
    // fontFamily: 'Tajawal_900Black',
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
  }, Modal: {
    // backgroundColor:'white',
    alignSelf: 'center',
    borderTopEndRadius: 120,
    color: '#5dbcd2',
    fontFamily: 'Tajawal_400Regular'
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
  }, DescriptionParagraph: { textAlign: 'justify', fontFamily: 'Tajawal_300Light', writingDirection: 'rtl', lineHeight: 20, flexWrap: 'wrap', alignSelf: 'center', marginHorizontal: 5, fontSize: 17, marginHorizontal: 10 }
  , modalLabel: {
    fontFamily: 'Tajawal_400Regular', writingDirection: 'rtl', flexWrap: 'wrap', alignSelf: 'flex-end', fontSize: 25, marginHorizontal: 10
  }
  , reportLabel: { fontFamily: 'Tajawal_300Light', color: colors.Subtitle, fontSize: 16, writingDirection: 'rtl', flexWrap: 'wrap', textDecorationLine: 'underline', },
});