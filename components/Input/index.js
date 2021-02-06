
import React from 'react';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Input(props) {
  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        marginBottom: 20,
      }}>
      <Icon name={props.iconName} color={'#01b753'} size={25} />
      <TextInput
        style={{
          paddingHorizontal: 10,
          textAlign: 'right',
          color: 'black',
          height: 30,
          borderColor: 'gray',
          borderWidth: 1,
          width: 200,
          borderStartColor: 'white',
          borderEndColor: 'white',
          borderTopColor: 'white'
        }}
        placeholder={props.placeholder}
        secureTextEntry={props.secureTextEntry}
        onChangeText={props.onChangeText}
        value={props.value}

      />

    </View>
  )
}