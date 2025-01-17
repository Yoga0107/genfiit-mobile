import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import ButtonComponent from '../components/Button/ButtonComponent';
import ResponsiveContainer from '../components/ResponsiveContainer'; 
import { getToken } from '../utils/handlingDataLogin'; // Import getToken
import { useNavigation, CommonActions } from '@react-navigation/native';

const InformationScreen: React.FC = () => {
  const navigation = useNavigation();

  const slide = {
    title: 'Welcome to GenFiit',
    description: 'GenFiit helps you track your fitness journey with ease.',
    image: require('../../assets/slide1.png'), 
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      if (token) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }], // Navigasi ke MainTabs jika token ada
          })
        );
      }
    };

    checkToken();
  }, [navigation]);

  const handleContinue = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }], // Navigasi ke Login jika tidak ada token
      })
    );
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
