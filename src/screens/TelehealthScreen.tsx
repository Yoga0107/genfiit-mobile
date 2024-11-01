import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import InputComponent from '../components/InputComponent';
import ButtonComponent from '../components/ButtonComponent';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import ResponsiveContainer from '../components/ResponsiveContainer'; 
import HeaderComponent from '../components/Header';

type RootStackParamList = {
  MedicalProfessionalSelectionScreen: { selectedProgram: string; age: string; };
};

const TelehealthScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [fullName, setFullName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleLanjutPress = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (selectedProgram) {
        const age = calculateAge(dateOfBirth);
        navigation.navigate('MedicalProfessionalSelectionScreen', { selectedProgram, age });
      }
    }
  };

  const calculateAge = (dob: Date) => {
    const today = new Date();
    let ageInYears = today.getFullYear() - dob.getFullYear();
    let ageInMonths = today.getMonth() - dob.getMonth();

    if (ageInMonths < 0) {
      ageInYears--;
      ageInMonths += 12;
    }

    return `${ageInYears} Tahun ${ageInMonths} Bulan`;
  };

  const isButtonDisabled = () => {
    if (step === 1) {
      return !fullName || !weight || !height || !gender || !dateOfBirth;
    } else if (step === 2) {
      return !selectedProgram;
    }
    return false;
  };

  return (
    <ResponsiveContainer>
      <HeaderComponent />

      <ScrollView contentContainerStyle={styles.container}>
        {step === 1 && (
          <>
            <Text style={styles.title}>Telehealth</Text>
            <Text style={styles.subtitle}>Konsultasi dengan Profesional</Text>
            <Text style={styles.description}>
              Sebelum bisa konsultasi langsung dengan tenaga kesehatan, mari isi data diri kamu disini!
            </Text>

            <InputComponent
              placeholder="Nama Lengkap"
              value={fullName}
              onChangeText={setFullName}
            />
            <InputComponent
              placeholder="Berat (Kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
            <InputComponent
              placeholder="Tinggi (Cm)"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />

            <TouchableOpacity onPress={openDatePicker} style={styles.datePicker}>
              <Text style={styles.datePickerText}>
                {dateOfBirth ? dateOfBirth.toLocaleDateString() : 'Tanggal Lahir'}
              </Text>
              <MaterialIcons name="calendar-today" size={24} color="#0FA18C" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Gender" value="" />
                <Picker.Item label="Laki-laki" value="male" />
                <Picker.Item label="Perempuan" value="female" />
              </Picker>
            </View>

            <ButtonComponent 
              title="Lanjut" 
              onPress={handleLanjutPress} 
              disabled={isButtonDisabled()} 
            />
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>Pilih Program</Text>
            <TouchableOpacity
              style={[
                styles.programButton,
                selectedProgram === 'Mental Health' && styles.selectedButton,
              ]}
              onPress={() => setSelectedProgram('Mental Health')}
            >
              <Text style={styles.programTitle}>Mental Health</Text>
              <Text style={styles.programDescription}>
                Bagi yang ingin konsultasi terkait kesehatan mental, curhat, atau bagi yang memiliki masalah dalam mengatur emosi.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.programButton,
                selectedProgram === 'Nutrition' && styles.selectedButton,
              ]}
              onPress={() => setSelectedProgram('Nutrition')}
            >
              <Text style={styles.programTitle}>Gizi</Text>
              <Text style={styles.programDescription}>
                Bagi yang memiliki masalah terkait berat badan atau gizinya.
              </Text>
            </TouchableOpacity>

            <ButtonComponent 
              title="Lanjut" 
              onPress={handleLanjutPress} 
              disabled={isButtonDisabled()} 
            />
          </>
        )}
      </ScrollView>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0FA18C',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0FA18C',
    borderRadius: 50,
    padding: 15,
    marginBottom: 20,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#0FA18C',
    borderRadius: 50,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  picker: {
    width: '100%',
    color: '#333',
  },
  programButton: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#FFF',
  },
  selectedButton: {
    borderColor: '#0FA18C',
    borderWidth: 2,
  },
  programTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#0FA18C',
  },
  programDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default TelehealthScreen;
