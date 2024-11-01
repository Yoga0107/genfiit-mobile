import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface ButtonComponentProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean; // Add disabled prop
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ title, onPress, disabled }) => (
  <TouchableOpacity
    style={[styles.button, disabled && styles.disabledButton]} // Change button style if disabled
    onPress={disabled ? undefined : onPress} // Prevent onPress if disabled
    disabled={disabled} // Disable the button
  >
    <Text style={[styles.buttonText, disabled && styles.disabledText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#18B2A0',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginVertical: 10,
    alignSelf: 'center',
    minWidth: '60%',
    maxWidth: '80%',
  },
  disabledButton: {
    backgroundColor: '#D3D3D3', // Grey background for disabled button
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  disabledText: {
    color: '#A9A9A9', // Lighter grey for disabled text
  },
});

export default ButtonComponent;
