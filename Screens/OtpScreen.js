import * as React from 'react';
import {
    Text,
    View,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ImageBackground,
} from 'react-native';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import * as firebase from 'firebase';
import CustomHeader from '../components/CustomHeader';
import CustomButton from '../components/CustomButton';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Initialize Firebase JS SDK
// https://firebase.google.com/docs/web/setup
/*try {
  firebase.initializeApp({
    ...
  });
} catch (err) {
  // ignore app already initialized error in snack
}*/

export default function OtpScreen(props) {
    const recaptchaVerifier = React.useRef(null);
    const [verificationId, setVerificationId] = React.useState();
    const [verificationCode, setVerificationCode] = React.useState();
    const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
    const [message, showMessage] = React.useState(
        !firebaseConfig || Platform.OS === 'web'
            ? {
                text:
                    'To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device.',
            }
            : undefined
    );
    const attemptInvisibleVerification = false;
    const { name = "", phoneNumber = "", email = "", password = "", completeRegister } = props.route?.params || {}

    React.useEffect(() => {
        setTimeout(async () => {
            try {
                const phoneProvider = new firebase.auth.PhoneAuthProvider();
                const verificationId = await phoneProvider.verifyPhoneNumber(
                    phoneNumber,
                    recaptchaVerifier.current
                );

                setVerificationId(verificationId);
                showMessage({
                    text: 'تم ارسال رمز التحقق الى جوالك',
                });
            } catch (err) {
                showMessage({ text: `خطأ: ${err.message}`, color: 'red' });
            }
        }, 200);

    }, [])

    return (
        <ImageBackground
            source={require('../images/b2.png')}
            style={{ width: '100%', height: '100%' }}
        >
            <View style={{
                flex: 1,
                alignItems: 'center',
                paddingTop: 60,
            }}>

                <TouchableOpacity onPress={() => props.navigation.pop()} style={{ alignSelf: 'flex-start', padding: 32 }} >
                    <FontAwesome5 name={"arrow-left"} color="#000" size="20" />

                </TouchableOpacity>


                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                    attemptInvisibleVerification={attemptInvisibleVerification}
                />
                <CustomHeader
                    title={`مرحبا ${name}`}
                    subTitle={'الرجاء ادخال رمز التحقق المرسل إلى رقم الجوال المسجل في  ابشر'}
                    marg={true}
                />


                <Text style={{ marginTop: 40, fontSize: 25, color: 'grey', fontFamily: 'Tajawal_400Regular', }}>ادخل رمز التحقق </Text>
                <TextInput
                    style={{ fontSize: 18, marginVertical: 10, }}
                    editable={!!verificationId}
                    placeholder="123456"
                    onChangeText={setVerificationCode}
                />
                <CustomButton
                    disabled={!verificationId}
                    onPress={async () => {
                        try {
                            const credential = firebase.auth.PhoneAuthProvider.credential(
                                verificationId,
                                verificationCode
                            );
                            console.log({ credential })
                            firebase.auth().signInWithCredential(credential)
                                .then(async (response) => {
                                    console.log({ response })

                                    if (response && response.user) {

                                        const ss = await response.user.updateEmail(email);
                                        const ss2 = await response.user.updatePassword(password);

                                        completeRegister?.()
                                    } else {
                                        showMessage({ text: `حصل خطأ ما يرجى المحاولة لاحقا`, color: 'red' });
                                    }


                                    // await response.user.reauthenticateWithCredential(credential).then(result => {

                                    //   response.user.updatePhoneNumber(credential);
                                    //   props.completeRegister?.()
                                    // }).catch(e => {
                                    //   showMessage({ text: `خطأ: ${e.message}`, color: 'red' });
                                    // });
                                    // response.user.updatePhoneNumber(credential)
                                    // this.successfulRegistration()
                                })
                                .catch(
                                    (e) => {
                                        showMessage({ text: `خطأ: ${e.message}`, color: 'red' });
                                        // console.log('successfulRegistration[error]', e)
                                        //this.failureMessage(e?.message ? e?.message : 'يرجى التأكد من ادخال البيانات بالشكل الصحيح')
                                    })

                        } catch (err) {
                            showMessage({ text: `خطأ: ${err.message}`, color: 'red' });
                        }
                    }}
                    title='تحقق'
                    style={{ marginTop: 32, marginBottom: 16 }}
                />

                {message ? (
                    <TouchableOpacity
                        style={[
                            StyleSheet.absoluteFill,
                            { backgroundColor: 0xffffffee, justifyContent: 'center' },
                        ]}
                        onPress={() => showMessage(undefined)}>
                        <Text
                            style={{
                                color: message.color || 'blue',
                                fontSize: 17,
                                textAlign: 'center',
                                margin: 20,
                            }}>
                            {message.text}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    undefined
                )}
                {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
            </View>
        </ImageBackground>
    );
}