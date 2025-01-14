import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import DetailedUserCard from '../components/DetailedUserCard';
import { deleteCompletionStatus, deleteToken } from '../utils/handlingDataLogin';
import { deleteID } from '../utils/handlingDataRegister';  // Import deleteCompletionStatus
import { calculateBMI, getNutritionalStatus } from '../helper/bmiHelper';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { getUserDetails } from '../api/User';
import ApplicationButton from '../components/Button/ApplicationButton';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  EditProfile: undefined;
  BMICalculator: undefined;
  Login: undefined;
  ChangePassword: undefined;
  Certificate: undefined;
};

type ApplicationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

type ApplicationScreenProps = {
  navigation: ApplicationScreenNavigationProp;
};

const ApplicationScreen: React.FC<ApplicationScreenProps> = ({ navigation }) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserDetails();
        const userDetails = data?.user_detail?.information;

        if (userDetails) {
          const bmi = calculateBMI(userDetails.weight, userDetails.height);
          const nutritionalStatus = getNutritionalStatus(bmi);

          setStatus(nutritionalStatus);

          setUserData({
            name: userDetails.full_name,
            height: userDetails.height,
            weight: userDetails.weight,
            dob: new Date(userDetails.dob),
            email: data.email,
            username: data.username,
            status: nutritionalStatus,
          });
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditPassword = () => navigation.navigate('ChangePassword');
  const handleBMICalculator = () => navigation.navigate('BMICalculator');
  const handleCertificate = () => navigation.navigate('Certificate');
  const handleEditProfile = () => navigation.navigate('EditProfile');

  const handleLogout = () => {
    // Show confirmation dialog before logging out
    Alert.alert(
      "Konfirmasi Logout",
      "Apakah Anda yakin ingin logout?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Ya",
          onPress: async () => {
            try {
              // Delete token, user ID, and completion status from AsyncStorage
              await deleteToken();
              await deleteID();
              await deleteCompletionStatus();  // Add deleteCompletionStatus here

              // Refresh the app state (you can use a reload or reset method)
              // Navigate the user to the Login screen after logout
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00b4ac" />;
  }

  return (
    <ResponsiveContainer>
      <ScrollView>
        <ImageBackground
          source={require('../../assets/header.png')}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        />
        <Image source={require('../../assets/logo1.png')} style={styles.logo1} />
        <Image source={require('../../assets/logo2.png')} style={styles.logo2} />

        <View style={styles.centerContainer}>
          {error ? (
            <Text style={styles.errorText}>Terjadi kesalahan saat memuat data</Text>
          ) : userData ? (
            <DetailedUserCard
              name={userData.name}
              email={userData.email}
              gender={userData.gender}
              username={userData.username}
              height={userData.height}
              weight={userData.weight}
              dob={userData.dob}
              nutritionalStatus={status}
            />
          ) : (
            <Text style={styles.errorText}>Data pengguna tidak tersedia</Text>
          )}

          <ApplicationButton
            title="BMI Calculator"
            description="Count Body Mass Index (BMI)"
            icon={require('../../assets/bmi-icon.png')}
            onPress={handleBMICalculator}
            color="#18B2A0"
          />
          <ApplicationButton
            title="Certificate"
            description="Look your certificate here"
            icon={require('../../assets/certificate-icon.png')}
            onPress={handleCertificate}
            color="#FFD700"
          />
          <ApplicationButton
            title="Change Password"
            description="Change your password"
            icon={require('../../assets/password-icon.png')}
            onPress={handleEditPassword}
            color="#000000"
          />
                    {/* <ApplicationButton
            title="Edit Profile"
            description="Edit Profile Anda!"
            icon={require('../../assets/password-icon.png')}
            onPress={handleEditProfile}
            color="#000000"
          /> */}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          

        </View>
      </ScrollView>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    marginHorizontal: 30,
    borderRadius: 15,
    marginTop: -150,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    fontSize: width * 0.045,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  imageBackground: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  logo1: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    position: 'absolute',
    top: 20,
    left: 20,
  },
  logo2: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    position: 'absolute',
    marginLeft: 75,
    top: -5,
  },
  logoutButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ApplicationScreen;
