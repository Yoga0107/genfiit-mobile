import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import ButtonComponent from '../components/ButtonComponent';

const InformationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Welcome to GenFiit',
      description: 'GenFiit helps you track your fitness journey with ease.',
      image: require('../../assets/slide1.png'), // Replace with your image path
    },
    {
      title: 'Track Your Progress',
      description: 'Monitor your weight, BMI, and fitness goals effectively.',
      image: require('../../assets/slide2.png'), // Replace with your image path
    },
    {
      title: 'Join Our Community',
      description: 'Connect with others on similar fitness journeys.',
      image: require('../../assets/slide3.png'), // Replace with your image path
    },
  ];

  const handleContinue = () => {
    navigation.replace('Login'); // Navigate to the login screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={slides[currentSlide].image} style={styles.image} />
      <Text style={styles.title}>{slides[currentSlide].title}</Text>
      <Text style={styles.description}>{slides[currentSlide].description}</Text>
      <ButtonComponent title="Continue to App" onPress={handleContinue} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10, // Optional: for rounded corners
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default InformationScreen;
