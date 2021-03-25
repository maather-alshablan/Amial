import {handleSignIn} from '../Screens/components/handleSignIn';

test('sign in of valid user',()=>{
    var email = "mona@mail.com" 
    var password ="12345678"
    expect(handleSignIn(email, password)).toBeTruthy();
});

test('sign in of invalid user',()=>{
    var email = "mona@mail.com" 
    var password ="12567"
    expect(handleSignIn(email, password)).not.toBeTruthy();
});


test('sign in of user with missing email',()=>{
    var email = "" 
    var password ="12567"
    expect(handleSignIn(email, password)).not.toBeTruthy();
});

test('sign in of user with missing password',()=>{
    var email = "mona@mail.com"
    var password =""
    expect(handleSignIn(email, password)).not.toBeTruthy();
});