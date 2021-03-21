import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Keyboard, Image, TouchableWithoutFeedback, ScrollView, Platform, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Input from '../../components/Input';
import DatePicker from 'react-native-datepicker'
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { auth, database, storage } from '../../Configuration/firebase';
import { OverLay } from '../../components/OverLay';
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { Picker } from '@react-native-picker/picker';
import { regoins } from '../../dataSet/regoins';
import { Entypo } from '../../Constants/icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import CustomLabel from '../../components/CustomLabel';
import SelectLocation from '../myVehicleScreens/SelectLocation';
import colors from '../../Constants/colors';
import { ModalComponent } from '../../Constants/Components/Modal';
import { showMessage } from 'react-native-flash-message';
import CryptoES from 'crypto-es';
import { firebase } from '../../Configuration/firebase'


const carTypes = [
    { id: 1, label: 'فخمة', value: 'فخمة' },
    { id: 2, label: 'اقتصادية', value: 'اقتصادية' },
    { id: 3, label: 'صغيرة', value: 'صغيرة' },
    { id: 4, label: 'سيدان متوسطة', value: 'سيدان متوسطة' },
    { id: 5, label: 'سيدان كبيرة', value: 'سيدان كبيرة' },
    { id: 6, label: 'عائلية', value: 'عائلية' },
    { id: 7, label: 'متعددة الاستخدامات', value: 'متعددة الاستخدامات' },
]

// const vehicleFeatures = [
// { id: 1, label: 'مفتاح ذكي', value: 'مفتاح ذكي' },
// { id: 2, label: 'AUX', value: 'AUX' },
// { id: 3, label: 'مكيف أوتوماتك', value: 'مكيف أوتوماتك' },
// { id: 4, label: 'CarPlay', value: 'CarPlay' },
// { id: 5, label: 'أضواء محيطة', value: 'أضواء محيطة' },
// { id: 6, label: 'GPS', value: 'GPS' },
// { id: 7, label: 'شاشة تعمل باللمس', value: 'شاشة تعمل باللمس' },
// ]

const vehicleFeatures = ['مفتاح ذكي', 'AUX', 'مكيف أوتوماتك', 'CarPlay', 'أضواء محيطة', 'GPS', 'شاشة تعمل باللمس',]

export default class AddOrEditVehicle extends Component {

    state = {
        carId: '',
        carModel: '',
        carType: '',
        availabilities: [],
        image: null,
        loading: false,
        edit: false,
        docId: '',
        years: [],
        transmission: '',
        pickUpOption: '',
        dailyRate: 0,
        year: '',
        insuranceType: '',
        InsuranceCompany: '',
        state: '',
        description: '',
        selectedValues: [50, 500],
        selectedFeatures: [],
        carNumber: '',
        pickUpOptionCost: [15],
        coordinates: null

    }


    onResult = (queury) => {
        let car = null
        let docId = ''
        queury.forEach(element => {
            car = element.data();
            docId = element.id
        });

        if (car) {
            const features = Object.keys(car?.vehicleDetails?.features).map(key => {
                return car?.vehicleDetails?.features[key]
            })
            this.setState({
                selectedFeatures: features,
                description: car?.vehicleDetails?.description,
                image: car?.vehicleDetails?.image,
                transmission: car?.vehicleDetails?.transmission,
                year: car?.vehicleDetails?.year,
                carType: car?.vehicleDetails?.type,
                carModel: car?.vehicleDetails?.model,
                availabilities: car?.availability,
                carId: CryptoES.AES.decrypt(car?.vehicleRegistration, firebase.auth().currentUser.uid).toString(CryptoES.enc.Utf8) != "" ? CryptoES.AES.decrypt(car?.vehicleRegistration, firebase.auth().currentUser.uid).toString(CryptoES.enc.Utf8) : car?.vehicleRegistration,
                carNumber: CryptoES.AES.decrypt(car?.LicensePlateNumber, firebase.auth().currentUser.uid).toString(CryptoES.enc.Utf8) != "" ? CryptoES.AES.decrypt(car?.LicensePlateNumber, firebase.auth().currentUser.uid).toString(CryptoES.enc.Utf8) : car?.LicensePlateNumber,
                pickUpOption: car?.pickUpOption,
                pickUpOptionCost: car?.pickUpOptionCost,
                state: car?.address?.city,
                coordinates: car?.address?.coordinates,
                selectedValues: [car?.dailyRate],
                insuranceType: car?.InsurancePolicy?.type,
                InsuranceCompany: car?.InsurancePolicy.company,
                edit: true,
                docId: docId
            })
        }

        // if (car) {
        // this.setState({
        // carId: car.carId,
        // carModel: car.carModel,
        // carType: car.carType,
        // availabilities: car.availabilities,
        // edit: true,
        // image: car.image,
        // docId: docId
        // })
        // }
    }
    onError = (e) => {
        // console.warn(e, "===")
    }
    componentDidMount() {
        // console.warn('eeee')
        const { vehicleID = "" } = this.props.route?.params || {}
        // console.warn(this.props, "====")
        database.collection('Vehicle').where('vehicleID', "==", vehicleID).onSnapshot(this.onResult, this.onError)
        this.gnerateYears()
    }

    gnerateYears = () => {
        const arr = []
        for (let i = 2021; i > 2010; i--) {
            arr.push({ id: i, label: i.toString(), value: i.toString() },)
        }
        // console.warn({ arr })
        this.setState({
            years: arr
        })
    }
    checkDataBase = (PlatNumber) => {
        return database.collection('DataSets').where('PlatNumber', "==", PlatNumber)
            .get()
            .then((querySnapshot) => {
                let found = false;
                let obj = null;
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    found = true
                    obj = doc.data()
                });

                if (found) {
                    if (obj.Insurance == 'Covered') {
                        if (obj['Active Traffic Fine'] == 0) {
                            return true;
                        } else {
                            this.failureMessage('عذرا لا تستطيع اضافة هذه المركبة لوجود مخالفات عليها');
                            this.setState({ errors: true })
                            return false;
                        }
                    } else {
                        this.failureMessage('عذرا لا تستطيع اضافة هذه المركبة لعدم وجود تامين')
                        this.setState({ errors: true })
                        return false;
                    }
                } else {
                    this.failureMessage('عذرا لا تستطيع اضافة هذه المركبة لعدم وجودها داخل البيانات')
                    this.setState({ errors: true })
                    return false;
                }
                console.warn('eeee');
            })
            .catch((error) => {
                console.warn("Error getting documents: ", error);
            });
    }

    openImagePickerAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const result = await ImagePicker.launchImageLibraryAsync({
            aspect: 1,
            allowsEditing: true,
        });
        // console.warn(result)
        if (!result.cancelled) this.setState({ image: result.uri });
    };


    uploadFile = async (path) => {

        const response = await fetch(path);
        const blob = await response.blob();
        const filename = path.substring(path.lastIndexOf('/') + 1);
        const metadata = {
            contentType: 'image/jpeg',
        };
        const task = storage.ref(filename).put(blob, metadata)
        try {
            return await task;
        } catch (e) {
            console.error(e);
        }

    };


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


    handleSaveData = async () => {
        if (!this.state.coordinates) {
            this.failureMessage('لم يتم تحديد موقع الحالي يرجى المحاولة مرة اخرى');
            return;
        }
        this.setState({ loading: true })
        const { vehicleID = "" } = this.props.route?.params || {}
        if (this.state.edit) {

            if (this.state.image.indexOf('http') > -1) {
                console.log(this.state.docId, "=====")
                database.collection('Vehicle').doc(this.state.docId).update({
                    vehicleID: this.state.docId, //document reference
                    vehicleRegistration: CryptoES.AES.encrypt(this.state.carId, firebase.auth().currentUser.uid,).toString(),
                    vehicleDetails: {
                        features: this.state.selectedFeatures,
                        description: this.state.description,
                        image: this.state.image,
                        transmission: this.state.transmission,
                        year: this.state.year,
                        type: this.state.carType,
                        model: this.state.carModel
                    },
                    ownerID: auth.currentUser.uid,
                    availability: this.state.availabilities,
                    LicensePlateNumber: CryptoES.AES.encrypt(this.state.carNumber, firebase.auth().currentUser.uid).toString(),
                    pickUpOption: this.state.pickUpOption,
                    pickUpOptionCost: this.state.pickUpOption == "التوصيل لموقع المستأجر" ? this.state.pickUpOptionCost : 0,
                    address: {
                        city: this.state.state,
                        coordinates: this.state.coordinates
                    },
                    dailyRate: this.state.selectedValues[0],
                    InsurancePolicy: {
                        type: this.state.insuranceType,
                        company: this.state.InsuranceCompany
                    },

                }).then(success => {
                    this.successMessage('تم تعديل المركبة بنجاح');
                    this.setState({ loading: false })
                    this.props.navigation.pop()
                }).catch(e => {
                    this.failureMessage('حصل خطأ ما يرجى المحاولة لاحقا')
                    this.setState({ loading: false })
                    // console.warn('error', e);
                })
            } else {
                const response = await this.uploadFile(this.state.image);
                console.log(this.state.docId, "=====")

                if (response && response.ref) {
                    const downloadUrl = await response.ref.getDownloadURL();
                    database.collection('Vehicle').doc(this.state.docId).update({
                        vehicleID: vehicleID,//document reference
                        vehicleRegistration: CryptoES.AES.encrypt(this.state.carId, firebase.auth().currentUser.uid,).toString(),
                        vehicleDetails: {
                            features: this.state.selectedFeatures,
                            description: this.state.description,
                            image: downloadUrl,
                            transmission: this.state.transmission,
                            year: this.state.year,
                            type: this.state.carType,
                            model: this.state.carModel
                        },
                        ownerID: auth.currentUser.uid,
                        availability: this.state.availabilities,
                        LicensePlateNumber: CryptoES.AES.encrypt(this.state.carNumber, firebase.auth().currentUser.uid,).toString(),
                        pickUpOption: this.state.pickUpOption,
                        pickUpOptionCost: this.state.pickUpOption == "التوصيل لموقع المستأجر" ? this.state.pickUpOptionCost : 0,
                        address: {
                            city: this.state.state,
                            coordinates: this.state.coordinates
                        },
                        dailyRate: this.state.selectedValues[0],
                        InsurancePolicy: {
                            type: this.state.insuranceType,
                            company: this.state.InsuranceCompany
                        },

                    }).then(success => {
                        this.successMessage('تم تعديل المركبة بنجاح')
                        this.setState({ loading: false })
                        this.props.navigation.pop()
                    }).catch(e => {
                        this.failureMessage('حصل خطأ ما يرجى المحاولة لاحقا')
                        this.setState({ loading: false })
                        //console.warn('error', e);
                    })
                } else {
                    this.setState({ loading: false })
                    this.failureMessage('حصل خطأ ما يرجى المحاولة لاحقا')
                }

            }
        } else {
            const response = await this.uploadFile(this.state.image);


            if (response && response.ref) {
                const downloadUrl = await response.ref.getDownloadURL()

                var ref = database.collection('Vehicle').doc().id;
                this.setState({ docId: ref })
                database.collection('Vehicle').doc(ref).set({
                    vehicleID: ref, //document reference
                    vehicleRegistration: this.state.carId,
                    vehicleDetails: {
                        features: this.state.selectedFeatures,
                        description: this.state.description,
                        image: downloadUrl,
                        transmission: this.state.transmission,
                        year: this.state.year,
                        type: this.state.carType,
                        model: this.state.carModel
                    },
                    ownerID: auth.currentUser.uid,
                    availability: this.state.availabilities,
                    Rating: 0,
                    numberofRatings:0,
                    LicensePlateNumber: this.state.carNumber,
                    pickUpOption: this.state.pickUpOption,
                    pickUpOptionCost: this.state.pickUpOption == "التوصيل لموقع المستأجر" ? this.state.pickUpOptionCost : 0,
                    address: {
                        city: this.state.state,
                        coordinates: this.state.coordinates
                    },
                    dailyRate: this.state.selectedValues[0],
                    InsurancePolicy: {
                        type: 'شامل',
                        company: 'التعاونية'
                    },

                }).then(success => {
                    this.successMessage(this.props.route?.params?.vehicleID ? 'تم تعديل المركبة بنجاح' : 'تم إضافة المركبة بنجاح')
                    this.setState({ loading: false })
                    this.props.navigation.pop()
                }).catch(e => {
                    this.failureMessage('حصل خطأ ما يرجى المحاولة لاحقا')
                    this.setState({ loading: false })
                    console.warn('error', e);
                })
            } else {
                this.setState({ loading: false })
                this.failureMessage('حصل خطأ ما يرجى المحاولة لاحقا')
            }

        }


    }

    renderVehicleFeatures = () => {

        return (
            <View style={{ marginBottom: 16 }}>
                <Text style={styles.SectionLabel}>{'مميزات المركبة'}</Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {vehicleFeatures.map(feature => {
                        return (<TouchableOpacity
                            onPress={() => {
                                // if (this.state.selectedFeatures[feature.id]) {
                                // const featurs = { ...this.state.selectedFeatures };
                                // delete featurs[feature.id]
                                // this.setState({
                                // selectedFeatures: featurs
                                // })

                                // } else {
                                // this.setState({
                                // selectedFeatures: { ...this.state.selectedFeatures, [feature.id]: feature }
                                // })
                                // console.log(this.state.selectedFeatures);
                                // }
                                if (this.state.selectedFeatures == undefined) {
                                    console.log('undefined array')
                                    const features = []
                                    feature.push(feature)
                                    console.log(features)

                                    this.setState({
                                        selectedFeatures: features
                                    })
                                    console.log(this.state.selectedFeatures[0])
                                }
                                else if (this.state.selectedFeatures.indexOf(feature) >= 0) {
                                    { console.log('remove element') }
                                    const features = this.state.selectedFeatures;

                                    var index = features.indexOf((String(feature)))
                                    features.splice(index, 1)
                                    console.log(features)

                                    this.setState({
                                        selectedDates: features
                                    })
                                }
                                else {
                                    const features = this.state.selectedFeatures;
                                    features.push(feature);
                                    console.log(features)

                                    this.setState({
                                        selectedDates: features
                                    })
                                }
                            }}
                            style={{ borderColor: '#01b753', borderWidth: 1, borderRadius: 10, margin:3,padding: 15, backgroundColor: this.state.selectedFeatures.includes(feature) ? '#01b753' : '#fff' }}>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: "Tajawal_400Regular", color: this.state.selectedFeatures.includes(feature) ? '#fff' : '#01b753'
                            }}>{feature}</Text>
                        </TouchableOpacity>)
                    })}
                </View>
            </View>
        )
    }

    renderFirstStep = () => {
        return (

            <ScrollView contentContainerStyle={{
                padding: 24, direction: 'ltr',
                backgroundColor: '#fff'
            }}>


                <View
                    style={{
                        marginBottom: 20,
                        direction: 'rtl',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <Text style={styles.pictureAlignLabel}>إرفاق صورة المركبة</Text>
                    {/* <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 24,alignSelf:'flex-start', textAlign: 'center', color: 'grey' }}>إرفاق صورة المركبة</Text> */}


                    <TouchableOpacity onPress={this.openImagePickerAsync} style={{ alignSelf: 'center', justifyContent: 'center' }}>
                        <Image
                            style={{ width: 250, height: 120, borderRadius: 10, marginBottom: 20, backgroundColor: '#F0EEF0' }}
                            source={{
                                uri: this.state.image
                            }} />
                        <Entypo name="plus" color={this.state.image? 'white' : colors.Green} size={50} style={{ position: 'absolute', top: 30, left: 100, opacity: 0.8 }} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity
onPress={this.openImagePickerAsync}
style={{ width: 80, height: 80, borderRadius: 4, borderWidth: 1, borderColor: 'gray', alignSelf: 'center' }}>
{this.state.image ? <Image style={{ width: '100%', height: '100%', borderRadius: 4 }} source={{ uri: this.state.image }} /> : <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>

<Icon name={"download"} color={'gray'} size={32} />
</View>
}
</TouchableOpacity> */}
                </View>

                <Text style={styles.SectionLabel}>{'معلومات المركبة'}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <Picker
                        itemStyle={{
                            height: 50,
                            fontFamily: "Tajawal_400Regular"
                        }}
                        selectedValue={this.state.carType}
                        style={{
                            height: 50,
                            width: '50%',
                        }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ carType: itemValue })
                        }>
                        <Picker.Item label="نوع المركبة" value="نوع المركبة" />
                        {carTypes.map(item => <Picker.Item key={item.id} label={item.label} value={item.value}
                            color={item.value == this.state.carType ? colors.LightBlue : '#000'}
                        />)}
                    </Picker>
                    <Picker
                        itemStyle={{ height: 50, fontFamily: "Tajawal_400Regular" }}
                        selectedValue={this.state.year}
                        style={{ height: 50, width: '50%', }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ year: itemValue })
                        }>
                        <Picker.Item label="سنة الصنع" value="سنة الصنع" />
                        {this.state.years.map(item => <Picker.Item key={item.id} label={item.label} value={item.value}
                            color={item.value == this.state.year ? colors.LightBlue : '#000'}
                        />)}
                    </Picker>
                </View>


                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <Picker
                        itemStyle={{ height: 50, fontFamily: "Tajawal_400Regular" }}
                        selectedValue={this.state.state}
                        style={{ height: 50, width: '50%', }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ state: itemValue })
                        }>
                        <Picker.Item label="المنطقة" value="المنطقة" />
                        {regoins.map(item => <Picker.Item key={item.region_id} label={item.name_ar} value={item.name_ar}
                            color={item.name_ar == this.state.state ? colors.LightBlue : '#000'}
                        />)}
                    </Picker>
                    <Picker
                        itemStyle={{ height: 50, fontFamily: "Tajawal_400Regular" }}
                        selectedValue={this.state.transmission}
                        style={{ height: 50, width: '50%' }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ transmission: itemValue })
                        }>
                        <Picker.Item label="نوع الجير" value="نوع الجير" />
                        <Picker.Item label="عادي" value="عادي" color={"عادي" == this.state.transmission ? colors.LightBlue : '#000'} />
                        <Picker.Item label="اوتوماتك" value="اوتوماتك" color={"اوتوماتك" == this.state.transmission ? colors.LightBlue : '#000'} />
                    </Picker>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Input
                        value={this.state.carId}
                        onChangeText={(carId) => this.setState({ carId })}
                        placeholder="رقم الاستمارة"
                        style={{ width: '100%', backgroundColor: '#F0EEF0', borderBottomWidth: 0, height: 50, borderRadius: 10 }}
                        containerStyle={{ flex: 1, paddingRight: 16, }}
                    />
                    <Input
                        value={this.state.carModel}
                        onChangeText={(carModel) => this.setState({ carModel })}
                        placeholder="موديل المركبة"

                        style={{ width: '100%', backgroundColor: '#F0EEF0', borderBottomWidth: 0, height: 50, borderRadius: 10 }}
                        containerStyle={{ flex: 1, paddingRight: 16, }}
                    />
                </View>

                <Input
                    value={this.state.carNumber}
                    onChangeText={(carNumber) => this.setState({ carNumber })}
                    placeholder="اضافة لوحة المركبة : مثال ABC123"
                    style={{ width: '100%', backgroundColor: '#F0EEF0', borderBottomWidth: 0, height: 50, borderRadius: 10 }}
                    containerStyle={{ flex: 1, paddingRight: 16, }}
                />

                <Input
                    value={this.state.description}
                    onChangeText={(description) => this.setState({ description })}
                    placeholder="وصف المركبة"
                    style={{ width: '100%', backgroundColor: '#F0EEF0', borderBottomWidth: 0, height: 120, borderRadius: 10 }}
                    textProps={{
                        multiline: true,

                    }}
                    containerStyle={{ flex: 1, paddingRight: 16, }}
                />




                {this.renderVehicleFeatures()}

                {/* <TouchableOpacity
onPress={this.handleSaveData}
style={{ width: 200, height: 40, borderRadius: 20, backgroundColor: '#01b753', justifyContent: 'center', alignItems: 'center', marginVertical: 16, alignSelf: 'center' }}>
<Text style={{ fontSize: 14, color: '#fff' }}>حفظ</Text>
</TouchableOpacity> */}
            </ScrollView>

        )
    }

    onNextFirstStep = async () => {
        // we need to handle all the errors
        let valid = true;
        if (!this.state.image) {
            this.failureMessage('يرجى ارفاق صورة المركبة')
            this.setState({
                errors: true,
            });

            return;
        }
        if (this.state.year == "") {
            this.failureMessage('يرجى اختيار سنة صنع المركبة')
            this.setState({
                errors: true,
            });

            return;
        }
        if (this.state.transmission == "") {
            this.failureMessage('يرجى اختيار نوع الجير للمركبة')
            this.setState({
                errors: true,
            });

            return;
        }

        if (this.state.state == "") {
            this.failureMessage('يرجى اختيار منطقة المركبة')
            this.setState({
                errors: true,
            });

            return;
        }

        if (this.state.carType == "") {
            this.failureMessage('يرجى اختيار نوع المركبة')
            this.setState({
                errors: true,
            });

            return;
        }

        if (this.state.carModel == "") {
            this.failureMessage('يرجى اضافة موديل المركبة')
            this.setState({
                errors: true,
            });

            return;
        }

        if (this.state.carId == "") {
            this.failureMessage('يرجى اضافة رقم الاستمارة')
            this.setState({
                errors: true,
            });

            return;
        }

        if (this.state.carNumber == "") {
            this.failureMessage('يرجى اضافة لوحة المركبة')
            this.setState({
                errors: true,
            });

            return;
        }


        // if (this.state.year == "") {
        // this.failureMessage('يرجى اختيار السنة')
        // this.setState({
        // errors: true,
        // });
        // return;
        // }

        if (this.state.carNumber != "") {
            const check = await this.checkDataBase(this.state.carNumber);
            if (!check) {
                return;
            }
        }
        this.setState({
            errors: false,
        });

    };

    onNextsecondtStep = async () => {
        if (this.state.availabilities.length == 0) {
            this.failureMessage('يرجى اختيار الأوقات المتاحة للعرض')
            this.setState({
                errors: true,
            });

            return;
        }
        if (this.state.pickUpOption == "") {
            this.failureMessage('يرجى اختيار طريقة التسليم')
            this.setState({
                errors: true,
            });
            return;
        }
        this.setState({
            errors: false,
        });
    }
    renderPoking = () => {
        return (
            <ScrollView contentContainerStyle={{
                padding: 24, direction: 'ltr',
                backgroundColor: '#fff',
                alignItems: 'center'
            }}>

                <View
                    style={{
                        marginBottom: 20,
                        direction: 'rtl',
                    }}>
                    <View style={{ padding: 16, paddingTop: 0 }}>
                        <Text style={{
                            textAlign: 'left',
                            fontFamily: "Tajawal_400Regular",
                            fontSize: 16

                        }} >الأوقات المتاحة للعرض</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {this.state.availabilities.map(availability => {
                                return (<View style={{ padding: 8, borderColor: 'black', borderRadius: 2, borderWidth: 1 }} >
                                    <Text>{availability}</Text>
                                </View>)
                            })}
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <DatePicker
                            style={{ width: 200 }}
                            date={this.state.date}
                            mode="date"
                            placeholder="اختر التاريخ"
                            format="YYYY-MM-DD"
                            minDate={new Date()}
                            // maxDate="2016-06-01"
                            confirmBtnText="تاكيد"
                            cancelBtnText="الغاء"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                                // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(date) => { this.setState({ date: date }) }}

                        />
                        <TouchableOpacity
                            onPress={() => {
                                this.setState(prevState => ({
                                    availabilities: [...prevState.availabilities, this.state.date]
                                }))
                            }} style={{ marginLeft: 8, padding: 12, borderWidth: 1, borderRadius: 4, borderColor: '#01b753', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{
                                textAlign: 'left', color: '#01b753',
                                fontFamily: "Tajawal_400Regular"
                            }}>{'إضافة'}</Text>
                        </TouchableOpacity>
                    </View>

                </View>



                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <Picker
                        itemStyle={{
                            height: 50,
                            fontFamily: "Tajawal_400Regular"
                        }}
                        selectedValue={this.state.pickUpOption}
                        style={{ height: 50, width: '100%', }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ pickUpOption: itemValue })
                        }>
                        <Picker.Item label="طريقة التسليم" value="طريقة التسليم" />
                        <Picker.Item label="التوصيل لموقع المستأجر" value="التوصيل لموقع المستأجر" color={"التوصيل لموقع المستأجر" == this.state.pickUpOption ? colors.LightBlue : '#000'} />
                        <Picker.Item label="استلام من موقع المالك" value="استلام من موق المالك" color={"استلام من موق المالك" == this.state.pickUpOption ? colors.LightBlue : '#000'} />
                    </Picker>
                    {/* <Icon name={"car"} color={'#01b753'} size={25} style={{ marginLeft: 8 }} /> */}
                </View>
                {this.state.pickUpOption == "التوصيل لموقع المستأجر" ? <View style={{ direction: 'ltr' }}>
                    <Text style={{
                        fontSize: 17, fontWeight: 'bold', marginBottom: 24, textAlign: 'right', color: 'grey',
                        fontFamily: "Tajawal_400Regular"
                    }}>{'سعر التوصيل' + ` ${this.state.pickUpOptionCost[0]} ريال`}</Text>

                    <MultiSlider
                        values={this.state.pickUpOptionCost}
                        sliderLength={Dimensions.get('screen').width - 100}
                        onValuesChange={(val) => {
                            this.setState({
                                pickUpOptionCost: val
                            })
                            console.log(this.state.pickUpOptionCost[0])
                        }}
                        min={15}
                        max={50}
                        step={5}
                        // allowOverlap
                        // snapped
                        enableLabel={true}
                        customLabel={CustomLabel}
                        selectedStyle={{ backgroundColor: "#01b753" }}
                    // isRTL={true}
                    />
                </View>
                    : null}
                <View style={{ direction: 'ltr' }}>
                    <Text style={{
                        fontSize: 16,
                        fontFamily: "Tajawal_400Regular", fontWeight: 'bold', marginBottom: 24, textAlign: 'right', color: 'grey'
                    }}>{'السعر' + ` ${this.state.selectedValues[0]}يوم/ريال`}</Text>

                    <MultiSlider
                        values={this.state.selectedValues}
                        sliderLength={Dimensions.get('screen').width - 100}
                        onValuesChange={(val) => {
                            this.setState({
                                selectedValues: val
                            })
                            console.log(this.state.selectedValues[0])
                        }}
                        min={50}
                        max={800}
                        step={10}
                        // allowOverlap
                        // snapped
                        enableLabel={true}
                        customLabel={CustomLabel}
                        selectedStyle={{ backgroundColor: "#01b753" }}
                    // isRTL={true}
                    />
                </View>

            </ScrollView>
        )
    }

    handleCreateCar = () => {

    }
    render() {
        return (
            <View style={styles.container}>
                <DismissKeyboard>

                    <ProgressSteps
                        activeStepIconBorderColor={'#01b753'}
                        activeLabelColor={'#01b753'}

                        completedProgressBarColor={'#01b753'}
                        completedStepIconColor={'#01b753'}
                    >
                        <ProgressStep
                            label="معلومات المركبة"
                            nextBtnText="التالي"
                            nextBtnTextStyle={{
                                color: "white", fontSize: 20,
                                fontFamily: "Tajawal_400Regular"
                            }}
                            nextBtnStyle={{
                                fontFamily: "Tajawal_400Regular",
                                flexDirection: "row",
                                alignItems: "center",
                                alignSelf: "stretch",
                                justifyContent: "center",
                                marginTop: 5,
                                width: 100,
                                color: "#ccc",
                                borderRadius: 22.5,
                                borderWidth: 0.1,
                                borderColor: "#ccc",
                                backgroundColor: "#01b753",
                            }}
                            onNext={this.onNextFirstStep}
                            errors={this.state.errors}
                        >
                            {this.renderFirstStep()}
                        </ProgressStep>
                        <ProgressStep
                            label="معلومات الحجز"
                            previousBtnText="السابق"
                            nextBtnText="التالي"
                            onNext={this.onNextsecondtStep}
                            errors={this.state.errors}
                            nextBtnTextStyle={{
                                color: "white", fontSize: 20,
                                fontFamily: "Tajawal_400Regular"
                            }}
                            nextBtnStyle={{
                                flexDirection: "row",
                                alignItems: "center",
                                alignSelf: "stretch",
                                justifyContent: "center",
                                color: "#ccc",
                                borderRadius: 22.5,
                                borderWidth: 0.1,
                                borderColor: "#ccc",
                                backgroundColor: "#01b753",
                            }}
                            previousBtnTextStyle={{
                                color: "white", fontSize: 20,
                                fontFamily: "Tajawal_400Regular"
                            }}
                            previousBtnStyle={{
                                flexDirection: "row",
                                alignItems: "center",
                                alignSelf: "stretch",
                                justifyContent: "center",
                                color: "#ccc",
                                borderRadius: 22.5,
                                borderWidth: 0.1,
                                borderColor: "#ccc",
                                backgroundColor: "#01b753",
                            }}
                        >
                            {this.renderPoking()}
                        </ProgressStep>

                        <ProgressStep
                            label="الموقع"
                            previousBtnText="السابق"
                            finishBtnText="اضافة مركبة"
                            isComplete={true}
                            onSubmit={this.handleSaveData}
                            nextBtnTextStyle={{ color: "white", fontSize: 20, }}
                            nextBtnStyle={{

                                flexDirection: "row",
                                alignItems: "center",
                                alignSelf: "stretch",
                                justifyContent: "center",
                                color: "#ccc",
                                borderRadius: 22.5,
                                borderWidth: 0.1,
                                borderColor: "#ccc",
                                backgroundColor: "#01b753",
                            }}
                            previousBtnTextStyle={{ color: "white", fontSize: 20, }}
                            previousBtnStyle={{
                                flexDirection: "row",
                                alignItems: "center",
                                alignSelf: "stretch",
                                justifyContent: "center",
                                color: "#ccc",
                                borderRadius: 22.5,
                                borderWidth: 0.1,
                                borderColor: "#ccc",
                                backgroundColor: "#01b753",
                            }}
                        >

                            <SelectLocation
                                setCoordinates={(coordinates) => this.setState({ coordinates })}
                            />
                        </ProgressStep>
                    </ProgressSteps>
                </DismissKeyboard>
                <ModalComponent />
{/* 
                {this.state.loading ? <OverLay /> : null} */}
            </View>
        );
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
        direction: 'rtl'
        //alignItems: 'center',
        //justifyContent: 'center',
    },
    pictureAlignLabel: { textAlign: 'left', marginBottom: 12, color: colors.Subtitle, fontFamily: "Tajawal_400Regular" },
    SectionLabel: { fontSize: 20, fontWeight: 'bold', marginBottom: 24, textAlign: 'right', color: 'grey', fontFamily: 'Tajawal_700Bold' }

});
