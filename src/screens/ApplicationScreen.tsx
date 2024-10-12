import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import UserCard from '../components/UserCard';
import { getToken } from '../utils/handlingDataLogin';
import ApiManager from '../api/ApiManager';
import { calculateBMI, getNutritionalStatus } from '../utils/bmiHelper';
import LogoutButton from '../components/LogoutButton';

type RootStackParamList = {
  EditProfile: undefined;
  BMICalculatorScreen: undefined;
  Login: undefined;
};

type ApplicationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

type ApplicationScreenProps = {
  navigation: ApplicationScreenNavigationProp;
};

const ApplicationScreen: React.FC<ApplicationScreenProps> = ({ navigation }) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          alert('Token not found');
          return;
        }

        const response = await ApiManager.get('/users/me', {
          params: { populate: 'user_information' },
          headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
          },
        });

        const userDetails = response.data.user_information;
        const bmi = calculateBMI(userDetails.weight, userDetails.height);
        const nutritionalStatus = getNutritionalStatus(bmi);
        setStatus(nutritionalStatus);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleBMICalculator = () => {
    navigation.navigate('BMICalculatorScreen');
  };

  const handleLogout = () => {
    navigation.navigate('Login'); 
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00b4ac" />;
  }

  return (
    <View style={styles.container}>
      {userData && userData.user_information ? (
        <UserCard
          name={userData.user_information.full_name}
          height={userData.user_information.height}
          weight={userData.user_information.weight}
          status={status}
        />
      ) : (
        <Text>No user data available</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleBMICalculator}>
        <Text style={styles.buttonText}>BMI Calculator</Text>
      </TouchableOpacity>

      <LogoutButton onLogout={handleLogout} />
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
