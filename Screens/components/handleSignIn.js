import { firebase , auth } from '../../Configuration/firebase'
import { showMessage } from "react-native-flash-message";

export  function handleSignIn (email, password) {

    if (email === null || password == '' || email === ''|| password === null) {

      showMessage({
        message: 'يجب تحديد البريد الإلكتروني و كلمة المرور',
        type: 'danger',
      });
      return false

    }
    var signedIn = false;


    //test account: test@email.com password:123456
     firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log('user signed in')

        console.log('hi')
        signedIn= true;
        return true;
      })
      .catch((error) => {
        
        showMessage({
          message: 'كلمة المرور او البريد الإلكتروني غير صحيح',
          type: 'danger'
        });
        return false
      })
      return true;
      

   
  }