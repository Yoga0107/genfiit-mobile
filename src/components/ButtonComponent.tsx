import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface ButtonComponentProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void; 
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#18B2A0',
    paddingVertical: 15, // Adjust vertical padding
    paddingHorizontal: 25, // Adjust horizontal padding
    borderRadius: 25, // More rounded
    marginVertical: 10,
    alignSelf: 'center', // Center the button
    minWidth: '60%', // Set a minimum width
    maxWidth: '80%', // Set a maximum width
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16, // Adjust font size for better readability
  },
});

export default ButtonComponent;
