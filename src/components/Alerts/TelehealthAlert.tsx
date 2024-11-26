import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface TelehealthAlertProps {
  message: string;
  onClose: () => void;
}

const TelehealthAlert: React.FC<TelehealthAlertProps> = ({ message, onClose }) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.alertContainer}>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    width: width * 0.8,
    padding: '5%',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  message: {
    fontSize: width * 0.045,
    textAlign: 'center',
    marginBottom: '5%',
    color: '#333',
  },
  button: {
    backgroundColor: '#0FA18C',
    paddingVertical: '3%',
    paddingHorizontal: '10%',
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.04,
  },
});

export default TelehealthAlert;
