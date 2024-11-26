import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HeaderComponent from '../components/Header';

const CertificateScreen = () => {
  return (
    <View style={styles.container}>
      <HeaderComponent title="My Certificates" />

      <View style={styles.contentContainer}>
        {/* Simulating no certificates for design purposes */}
        <View style={styles.noCertificatesContainer}>
          <MaterialCommunityIcons name="certificate" size={50} color="#888" />
          <Text style={styles.noCertificatesText}>No Certificates Yet</Text>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    marginTop: 50,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  noCertificatesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noCertificatesText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  ctaButton: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#4EAA9F',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CertificateScreen;
