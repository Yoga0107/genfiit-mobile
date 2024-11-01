import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ButtonComponent from '../components/ButtonComponent';

type MedicalProfessionalSelectionScreenProps = {
  selectedProgram: string;
};

const MedicalProfessionalSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<{ params: MedicalProfessionalSelectionScreenProps }, 'params'>>();
  const { selectedProgram } = route.params;

  const professionals = [
    { name: 'Andre Eko', job: 'Dietisien', schedule: '09.00 - 17.00', str: 'II' },
    { name: 'Intan Permata', job: 'Nutrisionis', schedule: '15.00 - 23.00', str: 'III' },
    { name: 'Reza Aulia', job: 'Nutrisionis', schedule: '09.00 - 17.00', str: 'I' },
    { name: 'Elizabeth', job: 'Dietisien', schedule: '09.00 - 17.00', str: 'I' },
    { name: 'Yogya Karta', job: 'Dietisien', schedule: '09.00 - 17.00', str: 'I' },
  ];

  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);

  const handleSelectProfessional = (professional: string) => {
    setSelectedProfessional(professional);
  };

  const handleLanjutPress = () => {
    if (selectedProfessional) {
      console.log(`Navigating to consultation with: ${selectedProfessional}`);
      // Navigate to the consultation screen or the next step here
    } else {
      alert("Please select a professional before continuing.");
    }
  };

  return (
    <ResponsiveContainer>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Pilih Konsultan</Text>
        <Text style={styles.subtitle}>Pilih tenaga kesehatan yang kamu ingin hubungi</Text>

        {professionals.map((professional) => (
          <TouchableOpacity 
            key={professional.name} 
            style={[styles.professionalCard, selectedProfessional === professional.name && styles.selectedCard]} 
            onPress={() => handleSelectProfessional(professional.name)}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="person" size={24} color="#0FA18C" />
            </View>
            <View style={styles.professionalInfo}>
              <Text style={styles.professionalName}>{professional.name}</Text>
              <View style={styles.professionalDetails}>
                <Text style={styles.label}>Pekerjaan</Text>
                <Text style={styles.value}>{professional.job}</Text>
              </View>
              <View style={styles.professionalDetails}>
                <Text style={styles.label}>Jadwal</Text>
                <Text style={styles.value}>{professional.schedule}</Text>
              </View>
              <View style={styles.professionalDetails}>
                <Text style={styles.label}>Nomor STR</Text>
                <Text style={styles.value}>{professional.str}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <ButtonComponent 
          title="Lanjut" 
          onPress={handleLanjutPress} 
          disabled={!selectedProfessional} 
        />
      </ScrollView>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0FA18C',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  professionalCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#0FA18C',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  selectedCard: {
    backgroundColor: '#E0F8F5', // Highlight selected card
  },
  iconContainer: {
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  professionalInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0FA18C',
    marginBottom: 5,
  },
  professionalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default MedicalProfessionalSelectionScreen;
