import React, { Component } from 'react';
import { StyleSheet, Keyboard, Text, View, Alert, TouchableOpacity, TouchableWithoutFeedback, Linking } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import colors from '../../Constants/colors';
import { database, auth } from '../../Configuration/firebase';
import { firebase } from '../../Configuration/firebase'
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Entypo, Ionicons } from '../../Constants/icons';
import Input from '../../components/Input'
import CustomButton from '../../components/CustomButton'
import CustomHeader from '../../components/CustomHeader';
import { Rating, AirbnbRating, } from 'react-native-ratings';
import Modal from 'react-native-modal';



export default class tripForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formType: props?.route?.params?.formType,
            currentRequest: props?.route?.params?.currentRequest,
            vehicleDescription: null,
            borrowerVerified: false,
            vehicleSafeConidtionVerified:false,
            violationDescription: null,
            ReportModel: false,
            Rating:0,
            exteriorImage: null,
            InteriorImage: null,
            RateModal: false,
            ReportNoShowModel:false,
            cancellationReason: ''
        }
    }



    componentDidMount =  () => {
       
    }

    submitRating = async ()=>{
       var currentRating=0;
       var numberofRatings=0;
       var ref =  database.collection('users').doc(this.state.currentRequest.borrowerID).get();
        //For Rating borrower on owners checkout step
        if(this.state.formType =='checkOut'){
        var borrowerID = this.state.currentRequest.borrowerID;
        // calculate all Ratings on 
         ref = await database.collection('users').doc(borrowerID).get();
        var borrower =  ref.data();
            console.log('Borrower Rating: ',borrower.userRating)
            currentRating = borrower.userRating;
            numberofRatings = borrower.numberofRatings

    }

         if(this.state.formType=='lock'){
        var vehicleID = this.state.currentRequest.vehicleID;
         ref = await database.collection('Vehicle').doc(vehicleID).get()
        var vehicle =  ref.data();
            console.log('Vehicle Rating: ',vehicle.Rating)
          currentRating= vehicle.Rating;
         numberofRatings = vehicle.numberofRatings
    }
   
    await database.runTransaction((transaction)=>{
        if (this.state.formType =='checkOut')
        ref =  database.collection('users').doc(borrowerID);
        else
        ref =  database.collection('Vehicle').doc(vehicleID);


        return transaction.get(ref).then((res) => {
            if (!res.exists) {
                throw "Document does not exist!";
            }
            // Compute new number of ratings
            var newNumRatings = numberofRatings + 1;

            // Compute new average rating
            var oldRatingTotal = currentRating * numberofRatings;
            var newAvgRating = (oldRatingTotal + this.state.Rating) / newNumRatings;

            console.log('before transaction update of rating')
            // Commit to Firestore
            transaction.update(ref, {
                Rating: newAvgRating,
                numberofRatings: newNumRatings
            })
        }).then(()=>{
            console.log('successful rating')
            this.successMessage('تم اكتمال الرحلة بنجاح');
                }).catch(()=>{ console.log('rating was not saved')
                }).
        finally(()=>{
            console.log('rating')
            this.props.navigation.popToTop();

                })
    })

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
    renderFormType =   () => {
        //   console.log(this.state.formType)
        var form;
        switch (this.state.formType) {
            case 'checkIn':
                form = this.renderCheckIn();
                break;
            case 'unlock':
                form = this.renderUnlock();
                break;
            case 'lock':
                form = this.renderLock();
                break;
            case 'checkOut':
                form = this.renderCheckOut();
               
                break;
        }
        return form;
    }

    openImagePickerAsync = async (image) => {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const result = await ImagePicker.launchImageLibraryAsync({
            aspect: 1,
            allowsEditing: true,
        });
        // console.warn(result)

        if (!result.cancelled)
            if (image == 'exteriorImage')
                this.setState({ exteriorImage: result.uri });
            else
                this.setState({ InteriorImage: result.uri });

    };

    validateForm = () => {

        var formValid = true;

        if (this.state.formType =='checkIn' && !this.state.borrowerVerified){
            this.failureMessage('يرجى مطابقة المستأجر برخصة القيادة ')
            formValid = false;
        }

        if (this.state.formType =='checkOut' && !this.state.vehicleSafeConidtionVerified){
            this.failureMessage('يرجى التأكد من سلامة المركبة ')
            formValid = false;
        }

        if (this.state.vehicleDescription == null) {
            this.failureMessage('يرجى تزويدنا بوصف عن حالة المركبة ')
            formValid = false;
        }

        if (this.state.InteriorImage == null) {
            this.failureMessage('يرجى إضافة صورة داخلية للمركبة ')
            formValid = false;
        }
        if (this.state.exteriorImage == null) {
            this.failureMessage('يرجى إضافة صورة خارجية للمركبة ')
            formValid = false;
        }

        return formValid;
    }


    uploadFile = async (path) => {

        const response = await fetch(path);
        const blob = await response.blob();
        const filename = path.substring(path.lastIndexOf('/') + 1);
        const metadata = {
            contentType: 'image/jpeg',
        };
        const task = firebase.storage().ref(filename).put(blob, metadata)
        try {
            return await task;
        } catch (e) {
            console.error(e);
        }

    };

    cancelTrip = async () => {

        console.log('beginning cancellation ')
        var batch = database.batch();

        var trip = database.collection('Trips').doc(this.state.currentRequest.tripID);
        batch.update(trip, { status: 'cancelled', cancellationReason: this.state.cancellationReason });

        var borrowerRequest = database.collection('users').doc(this.state.currentRequest.borrowerID)
            .collection('Requests').doc(this.state.currentRequest.tripID);
        batch.update(borrowerRequest, { status: 'cancelled', cancellationReason: this.state.cancellationReason });

        var ownerRequest = database.collection('users').doc(this.state.currentRequest.ownerID)
            .collection('Requests').doc(this.state.currentRequest.tripID);
        batch.update(ownerRequest, { status: 'cancelled', cancellationReason: this.state.cancellationReason });

        batch.commit().then(() => {
            console.log(' cancellation  successful')
            // on success
            this.successMessage('تم إلغاء الحجز بنجاح');
            this.props.navigation.popToTop();
        }
        )
    }


    Rate = () => {
        return (
            <Modal
                onBackdropPress={() => this.setState({ RateModal: !this.state.RateModal })}
                onSwipeComplete={() => this.setState({ RateModal: !this.state.RateModal })}
                swipeDirection='down'
                isVisible={this.state.RateModal}
                style={styles.Modal}
            >
                <View style={{
                    height: '30%',
                    width: 350,
                    alignSelf: 'center',
                    borderRadius: 10,
                    backgroundColor: 'white'
                }}>
                    <Text style={[styles.label, { marginTop: 20, fontSize: 25, alignSelf: 'center' }]}>
                      
                    كيف كانت تجربتك؟  </Text>
                    <View style={{alignSelf:'center',marginTop:30}}>
                    <AirbnbRating
                    count={5}
                    reviews={["سيئة", "مقبولة","متوسطة","جيد جداً","ممتازة"]}
                    defaultRating={0}
                    size={35}
                    onFinishRating={(rating)=>{ 
                    this.setState({Rating:rating})
                    }}/>
                        </View>
                        <CustomButton
                                style={{ marginTop: 30 }}
                                title={'حفظ'}
                                onPress={() => this.submitRating()}
                            />
                </View>
            </Modal>
        )
    }

    reportViolation = () => {
        console.log('inside violation modal')
        return (
            <View>
                <Modal
                    onBackdropPress={() => this.setState({ ReportModel: !this.state.ReportModel })}
                    onSwipeComplete={() => this.setState({ ReportModel: !this.state.ReportModel })}
                    swipeDirection='down'
                    isVisible={this.state.ReportModel}
                    style={styles.Modal}>

                    <View style={{
                        height: '50%',
                        width: 370,
                        alignSelf: 'center',
                        borderRadius: 10,
                        backgroundColor: 'white'
                    }}>
                        <View>
                            <Text style={[styles.label, { marginTop: 20, fontSize: 25, alignSelf: 'center' }]}>مخالفات سوء استخدام المركبة </Text>
                            <Text style={[styles.vehicleDescriptionParagraph, { justifyContent: 'center', alignSelf: 'center', textAlign: 'justify', marginTop: 20, width: 300 }]}>
                                في حالة حدوث أضرار أو عيوب نتجت على المركبة عند الاستلام من المستأجر، سنقوم بمراجعة تفاصيل المخالفة والتعويض حسب الحالة بعد دراستها.
                </Text>


                            <Text style={[styles.label, { fontSize: 16, marginTop: 15, width: 320, alignSelf: 'center' }]}>
                                يرجى تزويدنا بنوع الضرر الناتج عند استلامك للمركبة مع إيضاح التفاصيل 
                                 </Text>
                            <Input
                                value={this.state.violationDescription}
                                onChangeText={(violationDescription) => this.setState({ violationDescription })}
                                placeholder="عيوب، خدشات، غير نظيفة،بقع.."
                                style={{ width: 320, backgroundColor: '#F0EEF0', borderBottomWidth: 0, height: 120, borderRadius: 10 }}
                                textProps={{
                                    multiline: true,
                                    textAlign: 'right',
                                    fontSize: 17
                                }}
                                containerStyle={{ paddingRight: 16, alignSelf: 'center', marginVertical: 10 }}

                            />

                            <CustomButton
                                style={{ marginTop: 10 }}
                                title={'حفظ'}
                                onPress={() => this.setState({ ReportModel: !this.state.ReportModel })}
                            />


                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    reportNoShow = () => {
        console.log('inside violation modal')
        return (
            <View>
                <Modal
                    onBackdropPress={() => this.setState({ ReportNoShowModel: !this.state.ReportNoShowModel })}
                    onSwipeComplete={() => this.setState({ ReportNoShowModel: !this.state.ReportNoShowModel })}
                    swipeDirection='down'
                    isVisible={this.state.ReportNoShowModel}
                    style={styles.Modal}>

                    <View style={{
                    height: '30%',
                    width: 370,
                    alignSelf: 'center',
                    borderRadius: 10,
                    backgroundColor: 'white'
                }}>
                    <View>
                        <Text style={[styles.modalLabel, { marginTop: 20, fontSize: 25, alignSelf: 'center' }]}>إلغاء الطلب</Text>
                        <Text style={[styles.vehicleDescriptionParagraph, { justifyContent: 'center', alignSelf: 'center', textAlign: 'justify', marginTop: 20, width: 300 }]}>
                          سيتم إلغاء الطلب في حال عدم عدم حضور المؤجر لموقع التسليم</Text>
                        <Text style={[styles.vehicleDescriptionParagraph, { fontFamily:'Tajawal_700Bold',justifyContent: 'center', alignSelf: 'center', textAlign: 'justify', marginTop: 20, width: 300 }]}>
                           هل انت متأكد من إلغاء الطلب؟
                        </Text>

                            <CustomButton
                                style={{ marginTop: 10 }}
                                title={'إلغاء'}
                                onPress={() => {
                                    this.cancelTrip()
                                    //this.setState({ ReportNoShowModel: !this.state.ReportNoShowModel })
                                 }
                                }
                            />


                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    checkOut = async () => {
        console.log('checking out')

        if (!this.validateForm())
            return;

        

        console.log('locking vehicle')

        const response = await this.uploadFile(this.state.InteriorImage);
        const response2 = await this.uploadFile(this.state.exteriorImage);

        if (response && response.ref && response2 && response2.ref) {
            const interiorImage = await response.ref.getDownloadURL();
            const exteriorImage = await response2.ref.getDownloadURL();
            var time = new Date();

            var OwnerPostTrip = {
                vehicleDescription: this.state.vehicleDescription,
                InteriorImage: interiorImage,
                ExteriorImage: exteriorImage,
                reportViolation:this.state.violationDescription,
                CheckOutTime: time
            }

            var batch = database.batch();

            var trip = database.collection('Trips').doc(this.state.currentRequest.tripID);
            batch.update(trip, { status: 'completed', OwnerPostTrip: OwnerPostTrip });

            var ownerRequest = database.collection('users').doc(this.state.currentRequest.ownerID)
                .collection('Requests').doc(this.state.currentRequest.tripID);
            batch.update(ownerRequest, { status: 'completed' });

            batch.commit().then(() => {
                // on success
               console.log('completed trip')
                this.setState({ RateModal: true});
            }

            ) .catch(() => this.failureMessage('يرجى المحاولة مرة اخرى'))
        }
    }


    lockVehicle = async () => {
        console.log('locking vehicle')

        if (!this.validateForm())
            return;

        console.log('locking vehicle')

        const response = await this.uploadFile(this.state.InteriorImage);
        const response2 = await this.uploadFile(this.state.exteriorImage);

        if (response && response.ref && response2 && response2.ref) {
            const interiorImage = await response.ref.getDownloadURL();
            const exteriorImage = await response2.ref.getDownloadURL();
            var time = new Date();

            var borrowerPostTrip = {
                vehicleDescription: this.state.vehicleDescription,
                InteriorImage: interiorImage,
                ExteriorImage: exteriorImage,
                LockTime: time
            }

            var batch = database.batch();

            var trip = database.collection('Trips').doc(this.state.currentRequest.tripID);
            batch.update(trip, { status: 'locked', borrowerPostTrip: borrowerPostTrip });

            var borrowerRequest = database.collection('users').doc(this.state.currentRequest.borrowerID)
                .collection('Requests').doc(this.state.currentRequest.tripID);
            batch.update(borrowerRequest, { status: 'completed' });

            var ownerRequest = database.collection('users').doc(this.state.currentRequest.ownerID)
                .collection('Requests').doc(this.state.currentRequest.tripID);
            batch.update(ownerRequest, { status: 'locked' });

            batch.commit().then(() => {
                // on success
                // open modal for rating vehicle
            
                this.setState({ RateModal: true})
            }

            ).catch(() => this.failureMessage('يرجى المحاولة مرة اخرى'))
        }
    }

    unlockVehicle = async () => {
        console.log('unlocking vehicle')

        if (!this.validateForm())
            return;

        console.log('unlocking vehicle')

        const response = await this.uploadFile(this.state.InteriorImage);
        const response2 = await this.uploadFile(this.state.exteriorImage);

        if (response && response.ref && response2 && response2.ref) {
            const interiorImage = await response.ref.getDownloadURL();
            const exteriorImage = await response2.ref.getDownloadURL();
            var time = new Date();

            var borrowerPreTrip = {
                vehicleDescription: this.state.vehicleDescription,
                InteriorImage: interiorImage,
                ExteriorImage: exteriorImage,
                unlockTime: time
            }

            var batch = database.batch();

            var trip = database.collection('Trips').doc(this.state.currentRequest.tripID);
            batch.update(trip, { status: 'active', borrowerPreTrip: borrowerPreTrip });

            var borrowerRequest = database.collection('users').doc(this.state.currentRequest.borrowerID)
                .collection('Requests').doc(this.state.currentRequest.tripID);
            batch.update(borrowerRequest, { status: 'active' });

            var ownerRequest = database.collection('users').doc(this.state.currentRequest.ownerID)
                .collection('Requests').doc(this.state.currentRequest.tripID);
            batch.update(ownerRequest, { status: 'active' });

            batch.commit().then(() => {
                // on success
                this.successMessage('تم تنشيط الحجز بنجاح');
                this.props.navigation.popToTop();
            }
            ).catch(() => this.failureMessage('يرجى المحاولة مرة اخرى'))
        }
    }

    activateTrip = async () => {

        //1. check vehicle permit exist 
        console.log('checking first for vehicle permit')

        //check verify identity 
        if (!this.state.borrowerVerified) {
            this.failureMessage('يرجى التحقق من المستأجر')
            return;
        }

        if (!this.validateForm())
            return;

        // change trip status to checked in 

        const response = await this.uploadFile(this.state.InteriorImage);
        const response2 = await this.uploadFile(this.state.exteriorImage);

        if (response && response.ref && response2 && response2.ref) {
            const interiorImage = await response.ref.getDownloadURL();
            const exteriorImage = await response2.ref.getDownloadURL();
            var checkInTime = new Date();

            var ownerPreTrip = {
                vehicleDescription: this.state.vehicleDescription,
                InteriorImage: interiorImage,
                ExteriorImage: exteriorImage,
                checkInTime: checkInTime
            }

            var batch = database.batch();

            var trip = database.collection('Trips').doc(this.state.currentRequest.tripID);
            batch.update(trip, { status: 'checkedIn', ownerPreTrip: ownerPreTrip });

            var borrowerRequest = database.collection('users').doc(this.state.currentRequest.borrowerID)
                .collection('Requests').doc(this.state.currentRequest.tripID);
            batch.update(borrowerRequest, { status: 'checkedIn' });

            var ownerRequest = database.collection('users').doc(this.state.currentRequest.ownerID)
                .collection('Requests').doc(this.state.currentRequest.tripID);
            batch.update(ownerRequest, { status: 'checkedIn' });

            batch.commit().then(() => {

                // on success
                this.successMessage('تم تنشيط الحجز بنجاح');
                this.props.navigation.popToTop();
            }
            )
        }

    }

    renderCheckIn = () => {
        console.log('in state checkIn')
        this.props.navigation.setOptions({
            headerTitle: (props) => <CustomHeader title={'بدء الرحلة'} props />
        })


        var form = (
            <View style={{ alignSelf: 'center', justifyContent: 'center', direction: 'rtl' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Text style={{
                        textAlign: 'left', fontSize: 30, fontWeight: 'bold', letterSpacing: 1, paddingTop: 3,
                        fontFamily: 'Tajawal_500Medium', color: colors.LightBlue, marginHorizontal: 20,
                    }}>تحقق </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20, marginHorizontal: 10 }}>
                    <TouchableOpacity
                        style={{ height: 30, width: 30, borderRadius: 10, borderWidth: 1, borderColor: colors.Subtitle, marginLeft: 15 }}
                        onPress={() => this.setState({ borrowerVerified: !this.state.borrowerVerified })} >
                        {this.state.borrowerVerified ? <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Entypo name={'check'} color={colors.LightBlue} size={25} />
                        </View> : <View></View>}
                    </TouchableOpacity>
                    <Text style={{
                        fontFamily: 'Tajawal_400Regular', writingDirection: 'rtl', flexWrap: 'wrap', fontSize: 18, marginHorizontal: 10, paddingHorizontal: 5
                    }}>
                        تم التحقق من هوية المستأجر
                        بمطابقته برخصة القيادة
                            </Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({ReportNoShowModel:true})
                        // Alert.alert(
                        //     "إلغاء الطلب",
                        //     "سيتم إلغاء الطلب في حال عدم إبراز رخصة سارية او عدم حضور المستأجر لموقع التسليم، هل انت متأكد من إلغاء الطلب؟",
                        //     [
                        //         {
                        //             text: 'لا',
                        //             style: 'default',
                        //         }, {
                        //             text: "نعم",
                        //             onPress: () => Alert.prompt("إلغاء الطلب", 'يرجى ذكر السبب', (value) => {
                        //                 this.setState({ cancellationReason: value })
                        //                 this.cancelTrip();

                        //             }),
                        //             style: "destructive",
                        //         }
                        //     ],
                        // );
                    }}
                    style={{ alignSelf: 'center', marginHorizontal: 30 }}>
                    <Text style={styles.reportLabel} >
                        عدم أهلية المستأجر او تعذر حضوره لمنطقة التسليم ؟                 </Text></TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 25 }}>
                    <Text style={{
                        textAlign: 'left', fontSize: 30, fontWeight: 'bold', letterSpacing: 1, paddingTop: 4,
                        fontFamily: 'Tajawal_500Medium', color: colors.LightBlue, marginHorizontal: 20,
                    }}>وثق </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10, marginHorizontal: 10 }}>
                    <Text style={styles.vehicleDescriptionParagraph}>

                        لتجربة آمنه ومريحة في مشاركة المركبة مع الأخرين بثقة ومن دواعي حفظ الحقوق في حالة التعرض على المركبة، يرجى تزويدنا بمعلومات عن حالة المركبة و صورة داخلية وخارجية للمركبة. </Text>
                </View>

                <View style={{ direction: 'ltr', marginVertical: 10, marginHorizontal: 10, }}>

                    <Text style={
                        [styles.label]}>
                        وصف المركبة
                            </Text>

                    <Input
                        value={this.state.vehicleDescription}
                        onChangeText={(vehicleDescription) => this.setState({ vehicleDescription })}
                        placeholder="عيوب، خدشات، عداد المسافات المقطوعة، عداد الوقود.."
                        style={{ width: 320, backgroundColor: '#F0EEF0', borderBottomWidth: 0, height: 120, borderRadius: 10 }}
                        textProps={{
                            multiline: true,
                            textAlign: 'right',
                            fontSize: 17
                        }}
                        containerStyle={{ paddingRight: 16, alignSelf: 'center', marginVertical: 10 }}

                    />
                    <TouchableOpacity
                        onPress={() => this.openImagePickerAsync('interiorImage')}
                        style={{ flexDirection: 'row-reverse', margin: 10 }}>
                        <Ionicons name={'cloud-upload-outline'} size={30} color={
                            this.state.InteriorImage ? colors.Green : colors.Subtitle} />
                        <Text style={[styles.label, { color: this.state.InteriorImage ? colors.Green : colors.Subtitle }]}>
                            إرفاق صورة داخلية للمركبة
                            </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.openImagePickerAsync('exteriorImage')}
                        style={{ flexDirection: 'row-reverse', margin: 10, }}>
                        <Ionicons name={'cloud-upload-outline'} size={30} color={
                            this.state.exteriorImage ? colors.Green : colors.Subtitle} />
                        <Text style={[styles.label, {
                            color:
                                this.state.exteriorImage ? colors.Green : colors.Subtitle
                        }]}>
                            إرفاق صورة خارجية للمركبة
                            </Text>
                    </TouchableOpacity>

                    <CustomButton
                        style={{ marginTop: 10 }}
                        title={'بدء الرحلة'}
                        onPress={() => this.activateTrip()}
                    />

                </View>

            </View>)

        return form;
    }


    renderCheckOut = () => {
        console.log('in state checkOut')
        this.props.navigation.setOptions({
            headerTitle: (props) => <CustomHeader title={'إنهاء الرحلة'} props />
        })

        var form = (
            <View style={{ alignSelf: 'center', justifyContent: 'center', direction: 'rtl' }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Text style={{
                        textAlign: 'left', fontSize: 30, fontWeight: 'bold', letterSpacing: 1, paddingTop: 3,
                        fontFamily: 'Tajawal_500Medium', color: colors.LightBlue, marginHorizontal: 20,
                    }}>تحقق </Text>
                </View>


                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 20, marginLeft: 15 }}>
                    <TouchableOpacity
                        style={{ height: 25, width: 25, borderRadius: 10, borderWidth: 1, borderColor: colors.Subtitle, marginLeft: 10 }}
                        onPress={() => this.setState({ vehicleSafeConidtionVerified: !this.state.vehicleSafeConidtionVerified })} >
                        {this.state.vehicleSafeConidtionVerified ? <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                            <Entypo name={'check'} color={colors.LightBlue} size={25} />
                        </View> : <View></View>}
                    </TouchableOpacity>
                    <Text style={{
                        fontFamily: 'Tajawal_400Regular', writingDirection: 'rtl', flexWrap: 'wrap', fontSize: 18, marginHorizontal: 10, paddingHorizontal: 5
                    }}>
                        تم استلام المركبة في حالة سليمة.                            </Text>
                </View>
                <TouchableOpacity
                style={{ justifyContent: 'center', alignSelf: 'flex-start', marginStart:30 }}
                    onPress={() => {
                        this.setState({ ReportModel: true })
                    }}>
                    <Text style={[styles.reportLabel,]} >
                    في حال تعرض المركبة لسوء الإستعمال 
                        </Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 25 }}>
                    <Text style={{
                        textAlign: 'left', fontSize: 30, fontWeight: 'bold', letterSpacing: 1, paddingTop: 4,
                        fontFamily: 'Tajawal_500Medium', color: colors.LightBlue, marginHorizontal: 20,
                    }}>وثق </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10, marginHorizontal: 10 }}>
                    <Text style={styles.vehicleDescriptionParagraph}>
                        لأن الثقة هي الركيزة الأساسية لتجربة آمنه ومريحة في مشاركة المركبات، ولضرورة حفظ الحقوق في حالة التعرض على المركبة، يرجى تزويدنا بمعلومات عن حالة المركبة من عيوب خارجية وغيرها وصورة داخلية وخارجية للمركبة.
 </Text>
                </View>

                <View style={{ direction: 'ltr', marginVertical: 10, marginHorizontal: 10, }}>

                    <Text style={
                        [styles.label]}>
                        وصف المركبة
                            </Text>

                    <Input
                        value={this.state.vehicleDescription}
                        onChangeText={(vehicleDescription) => this.setState({ vehicleDescription })}
                        placeholder="عيوب، خدشات، عداد المسافات المقطوعة، عداد الوقود.."
                        style={{ width: 320, backgroundColor: '#F0EEF0', borderBottomWidth: 0, height: 120, borderRadius: 10 }}
                        textProps={{
                            multiline: true,
                            textAlign: 'right',
                            fontSize: 17
                        }}
                        containerStyle={{ paddingRight: 16, alignSelf: 'center', marginVertical: 10 }}

                    />
                    <TouchableOpacity
                        onPress={() => this.openImagePickerAsync('interiorImage')}
                        style={{ flexDirection: 'row-reverse', margin: 10 }}>
                        <Ionicons name={'cloud-upload-outline'} size={30} color={
                            this.state.InteriorImage ? colors.Green : colors.Subtitle} />
                        <Text style={[styles.label, { color: this.state.InteriorImage ? colors.Green : colors.Subtitle }]}>
                            إرفاق صورة داخلية للمركبة
                            </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.openImagePickerAsync('exteriorImage')}
                        style={{ flexDirection: 'row-reverse', margin: 10, }}>
                        <Ionicons name={'cloud-upload-outline'} size={30} color={
                            this.state.exteriorImage ? colors.Green : colors.Subtitle} />
                        <Text style={[styles.label, {
                            color:
                                this.state.exteriorImage ? colors.Green : colors.Subtitle
                        }]}>
                            إرفاق صورة خارجية للمركبة
                            </Text>
                    </TouchableOpacity>

                    <CustomButton
                        style={{ marginTop: 10 }}
                        title={'إنهاء الرحلة'}
                        onPress={() =>this.checkOut()  }
                    />

                </View>

            </View>)

        return form;
    }


    renderUnlock = () => {
        console.log('in state Unlock')
        this.props.navigation.setOptions({
            headerTitle: (props) => <CustomHeader title={'استلام المركبة'} props />
        })
        var form = (
            <View style={{ alignSelf: 'center', justifyContent: 'center', direction: 'rtl' }}>


                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Text style={styles.Title}>وثق </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10, marginHorizontal: 10 }}>
                    <Text style={styles.vehicleDescriptionParagraph}>

                        لأن الثقة هي الركيزة الأساسية لتجربة آمنه ومريحة في مشاركة المركبات، ولضرورة حفظ الحقوق في حالة التعرض على المركبة،
                        يرجى تزويدنا بمعلومات عن حالة المركبة من عيوب خارجية وغيرها وصورة داخلية وخارجية للمركبة.
 </Text>

                </View>

                <View style={{ direction: 'ltr', marginVertical: 10, marginHorizontal: 10, }}>

                    <Text style={
                        styles.label}>
                        وصف المركبة
                            </Text>

                    <Input
                        value={this.state.vehicleDescription}
                        onChangeText={(vehicleDescription) => this.setState({ vehicleDescription })}
                        placeholder="عيوب، خدشات، عداد المسافات المقطوعة، عداد الوقود.."
                        style={{ width: 320, backgroundColor: '#F0EEF0', borderBottomWidth: 0, height: 120, borderRadius: 10 }}
                        textProps={{
                            multiline: true,
                            textAlign: 'right',
                            fontSize: 17
                        }}
                        containerStyle={{ paddingRight: 16, alignSelf: 'center', marginVertical: 10 }}

                    />
                    <TouchableOpacity
                        onPress={() => this.openImagePickerAsync('interiorImage')}
                        style={{ flexDirection: 'row-reverse', margin: 10 }}>
                        <Ionicons name={'cloud-upload-outline'} size={30} color={
                            this.state.InteriorImage ? colors.Green : colors.Subtitle} />
                        <Text style={[styles.label, { color: this.state.InteriorImage ? colors.Green : colors.Subtitle }]}>
                            إرفاق صورة داخلية للمركبة
                            </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.openImagePickerAsync('exteriorImage')}
                        style={{ flexDirection: 'row-reverse', margin: 10 }}>
                        <Ionicons name={'cloud-upload-outline'} size={30} color={
                            this.state.exteriorImage ? colors.Green : colors.Subtitle} />
                        <Text style={[styles.label, {
                            color:
                                this.state.exteriorImage ? colors.Green : colors.Subtitle
                        }]}>
                            إرفاق صورة خارجية للمركبة
                            </Text>
                    </TouchableOpacity>

                    <CustomButton
                        style={{ alignSelf: 'center', justifyContent: 'center', marginTop: 120, }}
                        title={'بدء الرحلة'}
                        onPress={() => this.unlockVehicle()}
                    />

                </View>


            </View>)

        return form;
    }

    renderLock = () => {
        console.log('in state lock')
        this.props.navigation.setOptions({
            headerTitle: (props) => <CustomHeader title={'إعادة المركبة'} props />
        })

        var form = (
            <View style={{ alignSelf: 'center', justifyContent: 'center', direction: 'rtl' }}>


                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Text style={styles.Title}>وثق </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10, marginHorizontal: 10 }}>
                    <Text style={styles.vehicleDescriptionParagraph}>

                        لأن الثقة هي الركيزة الأساسية لتجربة آمنه ومريحة في مشاركة المركبات، ولضرورة حفظ الحقوق في حالة التعرض على المركبة، يرجى تزويدنا بمعلومات عن حالة المركبة من عيوب خارجية وغيرها وصورة داخلية وخارجية للمركبة.
</Text>
                </View>

                <View style={{ direction: 'ltr', marginVertical: 10, marginHorizontal: 10, }}>

                    <Text style={
                        styles.label}>
                        وصف المركبة
                            </Text>

                    <Input
                        value={this.state.vehicleDescription}
                        onChangeText={(vehicleDescription) => this.setState({ vehicleDescription })}
                        placeholder="عيوب، خدشات، عداد المسافات المقطوعة، عداد الوقود.."
                        style={{ width: 320, backgroundColor: '#F0EEF0', borderBottomWidth: 0, height: 120, borderRadius: 10 }}
                        textProps={{
                            multiline: true,
                            textAlign: 'right',
                            fontSize: 17
                        }}
                        containerStyle={{ paddingRight: 16, alignSelf: 'center', marginVertical: 10 }}

                    />
                    <TouchableOpacity
                        onPress={() => this.openImagePickerAsync('interiorImage')}
                        style={{ flexDirection: 'row-reverse', margin: 10 }}>
                        <Ionicons name={'cloud-upload-outline'} size={30} color={
                            this.state.InteriorImage ? colors.Green : colors.Subtitle} />
                        <Text style={[styles.label, { color: this.state.InteriorImage ? colors.Green : colors.Subtitle }]}>
                            إرفاق صورة داخلية للمركبة
                            </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.openImagePickerAsync('exteriorImage')}
                        style={{ flexDirection: 'row-reverse', margin: 10 }}>
                        <Ionicons name={'cloud-upload-outline'} size={30} color={
                            this.state.exteriorImage ? colors.Green : colors.Subtitle} />
                        <Text style={[styles.label, {
                            color:
                                this.state.exteriorImage ? colors.Green : colors.Subtitle
                        }]}>
                            إرفاق صورة خارجية للمركبة
                            </Text>
                    </TouchableOpacity>

                    <CustomButton
                        style={{ alignSelf: 'center', justifyContent: 'center', marginTop: 120, }}
                        title={'إنهاء الرحلة'}
                        onPress={() => this.lockVehicle()}
                    />

                </View>


            </View>)

        return form;
    }




    render() {
        const form = this.renderFormType();
        const ViolationModal = this.reportViolation();
        const RateModal = this.Rate();
        const NoShowModal = this.reportNoShow();


        return (

            <View style={styles.container}>
                <View >
                    <DismissKeyboard>
                        {form}
                    </DismissKeyboard>

                    {ViolationModal}
                    {RateModal}
                    {NoShowModal}
                </View>
            </View>

        )
    }

}



const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: 'Tajawal_400Regular',
    },
    verifyBorrower: {

        borderWidth: 1,
        borderRadius: 4,
        width: 22,
        height: 22,
        marginHorizontal: 5

    },

    Modal: {
        // backgroundColor:'white',
        alignSelf: 'center',
        borderTopEndRadius: 120,
        color: '#5dbcd2',
        fontFamily: 'Tajawal_400Regular'
    },
    stepIndicator: {
        marginVertical: 0,
        flex: 2,
        bottom: 100,
        height: 800,
        direction: 'rtl',
        paddingHorizontal: 10,
    },
    reportLabel: { fontFamily: 'Tajawal_300Light', color: colors.Subtitle, fontSize: 16, writingDirection: 'rtl', flexWrap: 'wrap', },
    Title: {
        textAlign: 'left', fontSize: 30, fontWeight: 'bold', letterSpacing: 1, paddingTop: 3,
        fontFamily: 'Tajawal_500Medium', color: colors.LightBlue, marginHorizontal: 20,
    },
    label: {
        fontFamily: 'Tajawal_400Regular', writingDirection: 'rtl', flexWrap: 'wrap', alignSelf: 'flex-end', fontSize: 25, marginHorizontal: 10
    },
    vehicleDescriptionParagraph: { textAlign: 'justify', fontFamily: 'Tajawal_300Light', writingDirection: 'rtl', lineHeight: 20, flexWrap: 'wrap', alignSelf: 'center', marginHorizontal: 5, fontSize: 17, marginHorizontal: 10 }
})