import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ButtonComponent from '../components/ButtonComponent';
import { fetchMedicalProfessionals } from '../api/MedicalProfessional';

type MedicalProfessionalSelectionScreenProps = {
  selectedProgram: string;
};

const MedicalProfessionalSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<{ params: MedicalProfessionalSelectionScreenProps }, 'params'>>();
  const { selectedProgram } = route.params;

  const [professionals, setProfessionals] = useState<any[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch medical professionals data
  useEffect(() => {
    const loadProfessionals = async () => {
      setLoading(true);
      try {
        const data = await fetchMedicalProfessionals();
        setProfessionals(data.map((item: any) => ({
          name: item.attributes.name,
          job: item.attributes.job_title,
          schedule: item.attributes.schedule,
          str: item.attributes.str_number,
        })));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError('Failed to fetch professionals. Please try again.');
      }
    };

    loadProfessionals();
  }, []);

  const handleSelectProfessional = (professional: string) => {
    setSelectedProfessional(professional);
  };

  const handleLanjutPress = () => {
    if (selectedProfessional) {
      console.log(`Navigating to consultation with: ${selectedProfessional}`);
      // Navigate to the consultation screen or the next step here
    } else {
      alert('Please select a professional before continuing.');
    }
  };

  if (loading) {
    return (
      <ResponsiveContainer>
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#0FA18C" />
          <Text style={styles.loadingText}>Loading professionals...</Text>
        </View>
      </ResponsiveContainer>
    );
  }

  if (error) {
    return (
      <ResponsiveContainer>
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Pilih Konsultan</Text>
        <Text style={styles.subtitle}>Pilih tenaga kesehatan yang kamu ingin hubungi</Text>

        {professionals.length === 0 ? (
          <Text style={styles.noDataText}>No professionals available at the moment.</Text>
        ) : (
          professionals.map((professional) => (
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
          ))
        )}

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
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#E74C3C',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#0FA18C',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MedicalProfessionalSelectionScreen;
