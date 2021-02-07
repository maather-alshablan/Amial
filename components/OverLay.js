import React from 'react';
import { View, Dimensions, ActivityIndicator, Image, TouchableOpacity } from 'react-native';

const { width, height, scale } = Dimensions.get("window");

export const OverLay = (props) => (
    <View style={[{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0, backgroundColor: 'rgba(0,0,0,0.2)',
        zIndex: 999,
        justifyContent: 'center',

    }]}>
        <ActivityIndicator size='large' color={"#01b753"} />
    </View>
)