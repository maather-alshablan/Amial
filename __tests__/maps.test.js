import 'react-native';
import React from 'react';
import MAP from '../Screens/maps'
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react-native';


test ('can view maps',()=>{
    renderer.create(<MAP />);

})
