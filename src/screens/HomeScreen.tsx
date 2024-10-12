import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import ProgramCard from '../components/ProgramCard';
import UserCard from '../components/UserCard';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { getToken } from '../utils/handlingDataLogin';
import ApiManager from '../api/ApiManager';
import { calculateBMI, getNutritionalStatus } from '../utils/bmiHelper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen: React.FC = () => {
  const [hasPreTest, setHasPreTest] = useState(false);
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
        setUserData(response.data);

        const bmi = calculateBMI(userDetails.weight, userDetails.height);
        const nutritionalStatus = getNutritionalStatus(bmi);
        setStatus(nutritionalStatus);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleTelehealthPress = () => {
    console.log('Telehealth button pressed');
  };

  const handlePreTestPress = () => {
    console.log('Pre-Test button pressed');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00b4ac" />;
  }

  return (
    <ResponsiveContainer>
      <View style={styles.centerContainer}>
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

        {!hasPreTest && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Anda belum melakukan pre-test</Text>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={handlePreTestPress} style={styles.ctaButton}>
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
    position: 'relative',
    width: '100%',
    marginTop: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderRadius: 10,
  },
  overlayText: {
    fontSize: 18,
    color: '#009688',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  ctaButton: {
    marginTop: 30,
    alignSelf: 'center',
    width: '100%',
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
