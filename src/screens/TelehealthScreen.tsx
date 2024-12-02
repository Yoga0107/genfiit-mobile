import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import InputComponent from '../components/InputComponent';
import ButtonComponent from '../components/Button/ButtonComponent';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import ResponsiveContainer from '../components/ResponsiveContainer'; 
import HeaderComponent from '../components/Header';
import { postTelehealthData } from '../api/Telehealth';

const { width } = Dimensions.get('window'); 

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

  const handleLanjutPress = async () => {
    if (step === 1) {
      if (!fullName || !weight || !height || !gender || !dateOfBirth) {
        Alert.alert(
          "Data Tidak Lengkap",
          "Harap isi semua data pada langkah pertama sebelum melanjutkan.",
          [{ text: "OK" }]
        );
        return;
      }
      setStep(2);
    } else if (step === 2 && selectedProgram) {
      const age = calculateAge(dateOfBirth);
  
      let category = '';
      let programme = '';
  
      if (selectedProgram === 'Mental Health') {
        category = 'mental_health'; // category for Mental Health
        programme = 'Mental Health'; 
      } else if (selectedProgram === 'Nutrition') {
        category = 'gizi'; // category for Nutrition
        programme = 'Nutrition'; 
      } else {
        Alert.alert(
          "Kesalahan Program",
          "Program yang dipilih tidak valid. Harap coba lagi.",
          [{ text: "OK" }]
        );
        return;
      }
  
      const data = {
        category: category, // This is now dynamically set based on the selected program
        programme: programme, 
        user: {
          name: fullName,
          weight: parseInt(weight),
          height: parseInt(height),
          dob: Math.floor(dateOfBirth.getTime() / 1000),
          gender: gender,
        },
      };
  
      try {
        await postTelehealthData(data, selectedProgram); // Post the data to the API
        navigation.navigate('MedicalProfessionalSelectionScreen', { selectedProgram, age });
      } catch (error: unknown) {
        if (error instanceof Error) {
          Alert.alert(
            "Gagal Mengirim Data",
            "Ada masalah saat mengirimkan data, coba lagi.",
            [{ text: "OK" }]
          );
          console.error("Failed to submit telehealth data:", error.message);
        } else {
          Alert.alert(
            "Kesalahan Tidak Terduga",
            "Terjadi kesalahan yang tidak terduga, silakan coba lagi.",
            [{ text: "OK" }]
          );
          console.error("Unexpected error:", error);
        }
      }
    } else if (step === 2 && !selectedProgram) {
      Alert.alert(
        "Program Belum Dipilih",
        "Harap pilih salah satu program sebelum melanjutkan ke langkah berikutnya.",
        [{ text: "OK" }]
      );
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
      <HeaderComponent title='Konsultasi'/>

      <ScrollView contentContainerStyle={styles.container}>
        {step === 1 && (
          <>
            <Text style={styles.title}>Telehealth</Text>
            <Text style={styles.subtitle}>Konsultasi dengan Profesional</Text>
            <Text style={styles.description}>
              Sebelum bisa konsultasi langsung dengan tenaga kesehatan, mari isi data diri kamu disini!
            </Text>

            <InputComponent placeholder="Nama Lengkap" value={fullName} onChangeText={setFullName} />
            <InputComponent placeholder="Berat (Kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" />
            <InputComponent placeholder="Tinggi (Cm)" value={height} onChangeText={setHeight} keyboardType="numeric" />

            <TouchableOpacity onPress={openDatePicker} style={styles.datePicker}>
              <Text style={styles.datePickerText}>
                {dateOfBirth ? dateOfBirth.toLocaleDateString() : 'Tanggal Lahir'}
              </Text>
              <MaterialIcons name="calendar-today" size={24} color="#0FA18C" />
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker value={dateOfBirth} mode="date" display="default" onChange={onDateChange} />}

            <View style={styles.pickerContainer}>
              <Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)} style={styles.picker}>
                <Picker.Item label="Gender" value="" />
                <Picker.Item label="Laki-laki" value="male" />
                <Picker.Item label="Perempuan" value="female" />
              </Picker>
            </View>

            <ButtonComponent title="Lanjut" onPress={handleLanjutPress} disabled={isButtonDisabled()} />
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>Pilih Program</Text>
            <Text style={styles.titleDescription}>Pilih program konsultasi yang kamu butuhkan!</Text>
            
            <TouchableOpacity
              style={[styles.programButton, selectedProgram === 'Mental Health' && styles.selectedButton]}
              onPress={() => setSelectedProgram('Mental Health')}
            >
              <Image source={require('../../assets/mental-notif.png')} style={styles.programLogo} />
              <View style={styles.programTextContainer}>
                <Text style={styles.programTitle}>Mental Health</Text>
                <Text style={styles.programDescription}>
                  Bagi yang ingin konsultasi terkait kesehatan mental, curhat, atau bagi yang memiliki masalah dalam mengatur emosi.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.programButton, selectedProgram === 'Nutrition' && styles.selectedButton]}
              onPress={() => setSelectedProgram('Nutrition')}
            >
              <Image source={require('../../assets/gizi-notif.png')} style={styles.programLogo} />
              <View style={styles.programTextContainer}>
                <Text style={styles.programTitle}>Gizi</Text>
                <Text style={styles.programDescription}>
                  Bagi yang memiliki masalah terkait berat badan atau gizinya.
                </Text>
              </View>
            </TouchableOpacity>

            <ButtonComponent title="Lanjut" onPress={handleLanjutPress} disabled={isButtonDisabled()} />
          </>
        )}
      </ScrollView>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: '5%',
    flexGrow: 1,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#0FA18C',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginTop: '2%',
    marginBottom: '2%',
    textAlign: 'center',
  },
  description: {
    fontSize: width * 0.04,
    textAlign: 'center',
    marginBottom: '5%',
    color: '#666',
  },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0FA18C',
    borderRadius: 50,
    paddingVertical: '3%',
    paddingHorizontal: '5%',
    marginBottom: '5%',
  },
  datePickerText: {
    fontSize: width * 0.04,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#0FA18C',
    borderRadius: 10,
    marginBottom: '5%',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  programButton: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 10,
    paddingVertical: '4%',
    paddingHorizontal: '5%',
    marginBottom: '5%',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedButton: {
    borderColor: '#0FA18C',
  },
  programLogo: {
    height: width * 0.15,
    width: width * 0.15,
    resizeMode: 'contain',
    marginRight: '5%',
  },
  programTextContainer: {
    flex: 1,
  },
  programTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: '2%',
    color: '#333',
  },
  programDescription: {
    fontSize: width * 0.035,
    color: '#666',
  },
  titleDescription: {
    fontSize: width * 0.04,
    textAlign: 'center',
    color: '#666',
    marginBottom: '5%',
  },
});

export default TelehealthScreen;
