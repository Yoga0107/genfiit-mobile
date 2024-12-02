import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

interface ButtonComponentProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean; 
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ title, onPress, disabled }) => (
  <TouchableOpacity
    style={[styles.button, disabled && styles.disabledButton]} 
    onPress={disabled ? undefined : onPress} 
    disabled={disabled} 
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
    backgroundColor: '#D3D3D3', 
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  disabledText: {
    color: '#A9A9A9', 
  },
});

export default ButtonComponent;
