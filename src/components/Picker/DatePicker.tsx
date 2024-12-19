import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface DatePickerComponentProps {
  value: number;
  onChange: (epochDate: number) => void;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ value, onChange }) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleDateConfirm = (date: Date) => {
    setDatePickerVisible(false);
    onChange(date.getTime());
  };

  const handleDateCancel = () => {
    setDatePickerVisible(false);
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Date of Birth</Text>
      <TouchableOpacity style={styles.picker} onPress={() => setDatePickerVisible(true)}>
        <Text style={styles.pickerText}>{value ? new Date(value).toLocaleDateString() : 'Select Date'}</Text>
        <MaterialIcons name="calendar-today" size={24} color="gray" />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
      />
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

export default DatePickerComponent;
