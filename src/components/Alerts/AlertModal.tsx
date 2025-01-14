import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  type: "success" | "error";
  message: string;
}

const AlertModal: React.FC<AlertModalProps> = ({ visible, onClose, type, message }) => {
  const backgroundColor = type === "success" ? "#d4edda" : "#f8d7da";
  const textColor = type === "success" ? "#155724" : "#721c24";

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor }]}>
          <Text style={[styles.message, { color: textColor }]}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#18B2A0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AlertModal;
