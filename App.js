import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import React, { useRef } from 'react';

import TicketAnimation from './TicketAnimation.js';

const { width } = Dimensions.get('window');
const COLOR_BUTTON_PRIMARY = 'gray';

export default function App() {
  let generateRef = useRef();
  const generate = () => generateRef.current();

  return (
    <View style={styles.container}>
      <TicketAnimation generateRef={generateRef}/>
      <TouchableOpacity onPress={generate} style={styles.button}>
        <Text style={styles.buttonText}>Run</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 80,
    width: width * 0.7,
    height: 60,
    backgroundColor: COLOR_BUTTON_PRIMARY,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 25,
    color: 'white',
    letterSpacing: 2.0,
  },
});