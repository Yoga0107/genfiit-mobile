import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import UserCard from '../components/UserCard';

type RootStackParamList = {
  EditProfile: undefined;
  BMICalculatorScreen: undefined;
  Login: undefined;
};

type ApplicationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditProfile'
>;

type ApplicationScreenProps = {
  navigation: ApplicationScreenNavigationProp;
};

const ApplicationScreen: React.FC<ApplicationScreenProps> = ({ navigation }) => {
  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleBMICalculator = () => {
    navigation.navigate('BMICalculatorScreen');
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <UserCard name="John Doe" height={180} weight={75} status="Active" />
      
      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleBMICalculator}>
        <Text style={styles.buttonText}>BMI Calculator</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#009688',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
  },
});

export default ApplicationScreen;
