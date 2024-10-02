// SuccessModal.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Animated } from 'react-native';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, onClose }) => {
  const scaleValue = new Animated.Value(0);
  const checkmarkScale = new Animated.Value(0);
  const checkmarkOpacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      // Animate modal scaling in
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();

      // Animate checkmark drawing effect
      Animated.sequence([
        Animated.timing(checkmarkOpacity, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(checkmarkScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(500), // Wait for a moment after checkmark animation
      ]).start(() => {
        // Automatically close the modal after the animations
        setTimeout(onClose, 500);
      });
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleValue }] }]}>
          <Text style={styles.message}>Data telah terdaftar!</Text>
          <Animated.View
            style={{
              opacity: checkmarkOpacity,
              transform: [
                { scale: checkmarkScale },
                {
                  translateY: checkmarkScale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            }}
          >
            <Text style={styles.checkmark}>✔️</Text>
          </Animated.View>
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
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  checkmark: {
    fontSize: 80, // Increased checkmark size
  },
});

export default SuccessModal;
