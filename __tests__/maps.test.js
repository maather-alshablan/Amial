import 'react-native';
import React from 'react';
import MAP from '../Screens/maps'
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react-native';


// jest.mock('react-native-maps', () => {
//     return class MockMapView extends React.Component {
//       static Marker = props => React.createElement('Marker', props, props.children);
//       static propTypes = { children: React.PropTypes.any };
  
// test ('can view maps',()=>{
//     renderer.create(<MAP />);

// })