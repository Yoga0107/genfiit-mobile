import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
};

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#009688',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomButton;
