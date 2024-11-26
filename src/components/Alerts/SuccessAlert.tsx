import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SuccessAlertProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({ visible, message, onClose }) => {
  if (!visible) return null; // Don't render if not visible

  return (
    <View style={styles.container}>
      <View style={styles.alertBox}>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent dark overlay
  },
  alertBox: {
    backgroundColor: '#18B2A0', // Green background (success color)
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    marginTop: 15,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SuccessAlert;
