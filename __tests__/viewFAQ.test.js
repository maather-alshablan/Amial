import 'react-native';
import React from 'react';
import FAQ from '../Screens/profileScreens/FAQ';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react-native';
test ('can view FAQ',()=>{
    renderer.create(<FAQ />);

})


test ('can communicate with customer support', ()=>{
    const {getByText} = render(<FAQ/>);
    const contactButton = getByText('تواصل معنا');
    fireEvent.press(contactButton);
    
    expect(contactButton).toBeTruthy();

})
