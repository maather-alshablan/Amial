import {handleSignIn} from '../Screens/components/handleSignIn';
import { render, fireEvent } from '@testing-library/react-native';
import Login from '../Screens/Login';
import App from '../App'

test('sign in of valid user',()=>{
    var email = "mona@mail.com" 
    var password ="12345678"
    expect(handleSignIn(email, password)).toBeTruthy();
});

// test('sign in of invalid user',()=>{
//     var email = "mona@mail.com" 
//     var password ="12567"
//     expect(handleSignIn(email, password)).not.toBeTruthy();
// });


// test('sign in of user with missing email',()=>{
//     var email = "" 
//     var password ="12567"
//     expect(handleSignIn(email, password)).not.toBeTruthy();
// });

test('sign in of user with missing password',()=>{
    var email = "mona@mail.com"
    var password =""
    expect(handleSignIn(email, password)).not.toBeTruthy();
});

test('sign in form', async () => {
    var email = "mona@mail.com" 
    var password ="12345678"
    const mockFn = jest.fn();
  
    const component = (
        <App/>
      );

    
    
    const { getAllByPlaceholderText, getByText } = render(
      <Login/>
    );

    const emailInput = getAllByPlaceholderText('البريد الإلكتروني');
    const passwordInput = getAllByPlaceholderText('كلمة المرور');
  
    fireEvent.changeText(emailInput, email);
    fireEvent.changeText(passwordInput, password);
    fireEvent.press(getByText("تسجيل الدخول"));

    //const { getAllByPlaceholderText} = render(component);
 
  
    const searchBar =  getAllByPlaceholderText('ابحث عن مركبة..');
    expect(searchBar).toBeTruthy();

  });