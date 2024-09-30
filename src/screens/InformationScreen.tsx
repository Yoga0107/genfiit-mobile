import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import ButtonComponent from '../components/ButtonComponent';
import ResponsiveContainer from '../components/ResponsiveContainer'; 

const InformationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const slide = {
    title: 'Welcome to GenFiit',
    description: 'GenFiit helps you track your fitness journey with ease.',
    image: require('../../assets/slide1.png'), 
  };

  const handleContinue = () => {
    navigation.replace('Login'); 
  };

  return (
    <ResponsiveContainer>
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Image source={slide.image} style={{ width: '100%', height: 300, marginBottom: 20, borderRadius: 10 }} />
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>{slide.title}</Text>
        <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 20 }}>{slide.description}</Text>
        <ButtonComponent title="Continue to App" onPress={handleContinue} />
      </View>
    </ResponsiveContainer>
  );
};

export default InformationScreen;
