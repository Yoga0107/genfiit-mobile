import React from 'react';
import { View, TouchableOpacity, StyleSheet, ImageBackground, Alert, Dimensions } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import ResponsiveContainer from '../components/ResponsiveContainer'; 
import HeaderComponent from '../components/Header';

const ModuleScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const handleSelection = (selection: string) => {
    if (selection === 'GIZI' || selection === 'MENTAL HEALTH') {
      navigation.navigate('LearningSession', { topic: selection });
    } else {
      Alert.alert(`You selected: ${selection}`);
    }
  };

  return (
    <ResponsiveContainer>
      <HeaderComponent title='Learning Module'/>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => handleSelection('MENTAL HEALTH')}
        >
          <ImageBackground 
            source={require('../../assets/mental-logo.png')} 
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.card}
          onPress={() => handleSelection('GIZI')}
        >
          <ImageBackground 
            source={require('../../assets/gizi-logo.png')} 
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
          />
        </TouchableOpacity>
      </View>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  card: {
    width: '90%',
    height: Dimensions.get('window').height / 3.2, 
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    resizeMode: 'contain',
    width: '100%', 
    height: '100%', 
  },
});

export default ModuleScreen;
