import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface GenderPickerComponentProps {
  value: string;
  onChange: (value: string) => void;
}

const GenderPickerComponent: React.FC<GenderPickerComponentProps> = ({ value, onChange }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Gender</Text>
      <TouchableOpacity
        style={styles.picker}
        onPress={() => onChange(value === 'Male' ? 'Female' : 'Male')}
      >
        <Text style={styles.pickerText}>{value || 'Select Gender'}</Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0FA18C',
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default GenderPickerComponent;
