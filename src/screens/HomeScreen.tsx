import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import ProgramCard from '../components/ProgramCard';
import UserCard from '../components/UserCard';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { getToken } from '../utils/handlingDataLogin';
import { getID } from '../utils/handlingDataRegister';  
import ApiManager from '../api/ApiManager';
import { calculateBMI, getNutritionalStatus } from '../utils/bmiHelper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import axios from 'axios';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await getToken();
        const userId = await getID();
        console.log("Token:", token);
        console.log("User ID:", userId);
        
        if (!token || !userId) {
          alert('Token or user ID not found');
          return;
        }
    
        const url = `https://api-genfiit.yanginibeda.web.id/api/user-details/${userId}?populate=*`;
        console.log("Fetching user data from:", url);
    
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
          },
        });
    
        if (response.data && response.data.data) {
          const userDetails = response.data.data.attributes.information;
          setUserData(userDetails);
    
          const bmi = calculateBMI(userDetails.weight, userDetails.height);
          const nutritionalStatus = getNutritionalStatus(bmi);
          setStatus(nutritionalStatus);
        } else {
          throw new Error('User data not found');
        }
    
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching user data:', error.response?.data || error.message);
        } else {
          console.error('Unexpected error:', error);
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    
    fetchUserData();
  }, []);

  const handleTelehealthPress = () => {
    navigation.navigate('Telehealth'); 
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00b4ac" />;
  }

  return (
    <ResponsiveContainer>
      <View style={styles.centerContainer}>
        {error ? (
          <Text style={styles.errorText}>Error fetching user data!</Text>
        ) : userData ? (
          <UserCard
            name={userData.full_name}
            height={userData.height}
            weight={userData.weight}
            status={status}
          />
        ) : (
          <Text>No user data available</Text>
        )}
      </View>

      <TouchableOpacity style={styles.telehealthContainer} onPress={handleTelehealthPress}>
        <View style={styles.iconTextContainer}>
          <MaterialCommunityIcons name="stethoscope" size={24} color="#FDCB58" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.telehealthTitle}>Telehealth</Text>
            <Text style={styles.telehealthDescription}>Konsultasi dengan tenaga kesehatan disini!</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.programContainer}>
        <View style={styles.cardContainer}>
          <ProgramCard completed={0} total={10} />
          <ProgramCard completed={5} total={10} />
          <ProgramCard completed={3} total={10} />
          <ProgramCard completed={8} total={10} />
        </View>
      </View>

      <TouchableOpacity style={styles.ctaButton}>
        <LinearGradient
          colors={['#44D3B6', '#2980B9']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.gradient}
        >
          <Text style={styles.ctaTitle}>Pre-Test</Text>
          <Text style={styles.ctaSubtitle}>Lorem ipsum dolor sit amet!</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold',
  },
  telehealthContainer: {
    borderColor: '#00b4ac',
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#ffffff',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  telehealthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00b4ac',
    textAlign: 'left',
  },
  telehealthDescription: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'left',
  },
  programContainer: {
    width: '100%',
    marginTop: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  ctaButton: {
    marginTop: 30,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  gradient: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  ctaSubtitle: {
    fontSize: 21,
    color: '#fff',
    marginTop: 5,
  },
});

export default HomeScreen;
