import React, { Component } from 'react';
import { StyleSheet, Text, View, Linking, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { auth, database, firebase } from '../../Configuration/firebase'
import Person from '../profileScreens/person'
import { SimpleLineIcons, MaterialCommunityIcons, FontAwesome, Entypo, FontAwesome5 } from '../../Constants/icons'
export default class Profile extends Component {

    state = {
        total: 0
    }
    handleSignOut = () => {
        firebase.auth().signOut();
    }
    componentDidMount() {

        // this.retrieveConfirmedTrips()
    }


    retrieveConfirmedTrips = () => {

        // user is a vehicle owner
        database.collection('users').doc(auth.currentUser.uid).collection('Requests')
            .where("ownerID", '==', auth.currentUser.uid)
            .where('status', 'in', ['confirmed', 'active', 'checkedIn', 'unlocked', 'locked',])
            .onSnapshot((querySnapshot) => {
                let requests = []
                if (!querySnapshot.empty) {
                    let total = 0;
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        //requests.push(doc.id, " => ", doc.data());
                        console.log(doc.data(), "=====")
                        requests.push(doc.data());
                        total = total + doc.data().totalAmount
                        //requests[doc.id] = doc.data();
                    });
                    this.setState({ total: total });
                    console.log('array > ', this.state.request)
                } else {
                    console.log('No Pending requests found')
                }
            })
    }



    render() {


        return (
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                >

                    <View style={{ flex: 1, marginBottom: 15 }}>
                        <Person />
                    </View>

                    <View style={[styles.list, { marginVertical: 40, alignSelf: 'center' }]}>

                        <TouchableOpacity
                            style={styles.listItem}
                            onPress={() => this.props.navigation.navigate('EditProfile')}>
                            <Entypo name='chevron-right' size={20} style={{ margin: 5 }} />
                            <Text style={styles.title}>
                                تعديل بيانات الحساب
</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.listItem}
                            onPress={() => this.props.navigation.navigate('creditCard')}>
                            <Entypo name='chevron-right' size={20} style={{ margin: 5 }} />
                            <Text style={styles.title}>
                                بيانات البطاقة البنكية
</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.listItem}
                            onPress={() => this.props.navigation.navigate('changePassword')}>
                            <Entypo name='chevron-right' size={20} style={{ margin: 5 }} />
                            <Text style={styles.title}>
                                تغيير كلمة المرور
</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.listItem}
                            onPress={() => this.props.navigation.navigate('FAQ')}>
                            <Entypo name='chevron-right' size={20} style={{ margin: 5 }} />
                            <Text style={styles.title}>
                                الأسئلة الشائعة
</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.listItem}
                            onPress={() => {
                                const phone = "0505220440"; //admin's phone
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
                        >
                            <Entypo name='chevron-right' size={20} style={{ margin: 5 }} />
                            <Text style={styles.title}>
                                تواصل معنا
</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.listItem}
                            onPress={() => this.handleSignOut()}>
                            <Entypo name='chevron-right' size={20} style={{ margin: 5 }} />
                            <Text style={styles.title}>
                                تسجيل الخروج
</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    listItem: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        margin: 10,
        width: 300,
        height: 34,
        borderColor: 'grey',
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
    },
    list: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginLeft: 40,
        marginBottom: 140,
        marginTop: 20

    },
    title: {

        marginBottom: 3,
        padding: 10,

        color: 'black',
        fontSize: 20,
        fontFamily: 'Tajawal_400Regular'
    }


});

