import React from 'react';
import { View, Image } from 'react-native';

export default function Logo() {
  return (
    <View style={{ alignItems: 'center', margin: 20 }}>
      <Image source={require('./logo.jpg')} style={{ width: 150, height: 150 }} />
    </View>
  );
}
