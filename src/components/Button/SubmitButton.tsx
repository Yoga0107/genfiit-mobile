// components/SubmitButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type SubmitButtonProps = {
  onSubmit: () => void; // Fungsi untuk menangani aksi submit
};

const SubmitButton: React.FC<SubmitButtonProps> = ({ onSubmit }) => {
  return (
    <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
      <Text style={styles.submitButtonText}>Submit Answers</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SubmitButton;
