import React from 'react';
import CreditCard from '../Screens/profileScreens/creditCard';
import { render, fireEvent } from '@testing-library/react-native';
import { exp } from 'react-native-reanimated';



test('adding billing account',async ()=>{
const mockFn = jest.fn();

const { getByPlaceholderText, getByTestId , getByText} = render(<CreditCard amount={null} />);

const cardNumber = getByPlaceholderText('**** **** **** ****');
const expiry = getByPlaceholderText('الشهر/ السنة');
const cvc = getByPlaceholderText('الرمز');
const saveButton = getByTestId('Payment-Save-Process-Button');

fireEvent.changeText(cardNumber, '4111111111111111');
fireEvent.changeText(expiry,'12/23');
fireEvent.changeText(cvc,'123');
fireEvent.press(saveButton);

const successfulMessage = getByText('تم الحفظ بنجاح');

expect(successfulMessage).toBeTruthy();

});


// placeholders: 
//     name: "الاسم",
//           number: "**** **** **** ****",
//           expiry: "الشهر/ السنة",
//           cvc: "الرمز",
//   