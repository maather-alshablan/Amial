import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native'
import colors from '../Constants/colors';


const styles = StyleSheet.create({
  ButtonText: {
    color: 'white',
    fontFamily: 'Tajawal_400Regular',
    fontSize: 20,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  EmptyaddVehicleButton: {
    backgroundColor: '#1894E5', // #1BB754
    flexDirection: "row-reverse",
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: {
      height: 3,
      width: 0
    },
    justifyContent: 'center',
    alignSelf: 'center',
    height: 40,
    borderRadius: 10,
    color: 'white',
    paddingHorizontal: 24,
    minWidth: 160
  },

});

export default function CustomButton(props) {
  return (<TouchableOpacity
    {...props}
    style={[styles.EmptyaddVehicleButton, props.style]}
    onPress={props.onPress}
  >
    {/* {<Ionicons name={'add'} color={'white'} size={28} style={{ top: 3 }} />} */}
    <Text style={styles.ButtonText}>{props.title}</Text>

  </TouchableOpacity>)
}