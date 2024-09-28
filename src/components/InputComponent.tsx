import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface InputComponentProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean; 
}

const InputComponent: React.FC<InputComponentProps> = ({ placeholder, value, onChangeText, secureTextEntry }) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry} // Pass it down
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default InputComponent;
