import React from "react";
import { View, Text } from "react-native";
export default function CustomHeader(props) {
  return (
    <View style={{ paddingVertical: 15, alignSelf: 'center' }}>
      {props.title ? <Text style={{ fontSize: 40, color: '#5dbcd2', fontFamily: 'Tajawal_400Regular', alignSelf: 'center', marginBottom: 12 }}>{props.title}</Text> : null}
      {props.subTitle ? <Text style={{ fontSize: 25, color: 'grey', fontFamily: 'Tajawal_400Regular', alignSelf: 'center' }}>{props.subTitle}</Text> : null}
    </View>
  )
}