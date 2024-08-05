import React from 'react';
import { View, Text } from 'react-native';

function RightDrawerContent() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', opacity: 0}}>
      <Text>This is the right drawer</Text>
    </View>
  );
}

export default RightDrawerContent;
