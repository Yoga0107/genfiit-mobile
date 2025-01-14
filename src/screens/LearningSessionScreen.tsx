import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Dimensions, Image } from 'react-native';
import { getMaterialData } from '../api/materialApi';
import { getToken } from '../utils/handlingDataLogin';
import { getID } from '../utils/handlingDataRegister';
import HeaderComponent from '../components/Header';
import ButtonComponent from '../components/Button/ButtonComponent';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import ResponsiveContainer from '../components/ResponsiveContainer';

type RootStackParamList = {
  LearningSession: undefined;
  PilihKategoriModul: undefined;
  ContentScreen: { category: string };
};

type LearningSessionNavigationProp = NavigationProp<RootStackParamList, 'LearningSession'>;

const { width } = Dimensions.get('window');

const LearningSessionScreen: React.FC = () => {
  const navigation = useNavigation<LearningSessionNavigationProp>();
  const [selectedTopic, setSelectedTopic] = useState<'Mental' | 'Gizi' | null>(null);

  const navigateToContentScreen = (topic: 'Mental' | 'Gizi') => {
    navigation.navigate('ContentScreen', { category: topic === 'Mental' ? 'mentalmodule' : 'gizimodule' });
  };

  if (!selectedTopic) {
    return (
      <ResponsiveContainer>
        <View style={styles.container}>
          <HeaderComponent title="Choose Module Category" />
          <ScrollView contentContainerStyle={styles.scrollView}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigateToContentScreen('Mental')}
            >
              <Image
                source={require('../../assets/mental-logo.png')}
                style={[styles.logo, { width: width * 0.6, height: width * 0.6 }]}
              />
              <Text style={styles.cardText}>Mental Health</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigateToContentScreen('Gizi')}
            >
              <Image
                source={require('../../assets/gizi-logo.png')}
                style={[styles.logo, { width: width * 0.6, height: width * 0.6 }]}
              />
              <Text style={styles.cardText}>Nutrition</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ResponsiveContainer>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    width: width - 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  logo: {
    marginBottom: 10,
    resizeMode: 'contain',
  },
  scrollView: {
    paddingBottom: 20,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LearningSessionScreen;