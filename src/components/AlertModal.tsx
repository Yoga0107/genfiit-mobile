import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';

interface AlertModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ visible, message, onClose }) => {
  const translateY = useRef(new Animated.Value(-100)).current; // Start off-screen

  useEffect(() => {
    if (visible) {
      // Slide down the modal when it becomes visible
      Animated.timing(translateY, {
        toValue: 0, // Move to original position
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-close after a few seconds
      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100, // Move back up
          duration: 300,
          useNativeDriver: true,
        }).start(onClose);
      }, 3000); // Change duration as needed

      return () => clearTimeout(timer); // Clean up the timer on unmount
    }
  }, [visible, translateY, onClose]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Tutup</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1E3A8A',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AlertModal;
