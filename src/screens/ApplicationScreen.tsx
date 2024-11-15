import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, Image, ImageBackground } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import DetailedUserCard from '../components/DetailedUserCard';
import { deleteToken, getToken } from '../utils/handlingDataLogin';
import ApiManager from '../api/ApiManager';
import { calculateBMI, getNutritionalIndex, getNutritionalStatus } from '../helper/bmiHelper';
import CustomButton from '../components/CustomButton';
import { getUserDetails } from '../api/User';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { ScrollView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

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
            status: nutritionalStatus,
          });
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(true);
      } finally {
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

  const handleLogout = async () => {
    try {
      await deleteToken();
      navigation.navigate('Login');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00b4ac" />;
  }

  return (
    <ResponsiveContainer>
      <ScrollView>
        <ImageBackground
          source={require("../../assets/header.png")}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        />
        <Image source={require("../../assets/logo1.png")} style={styles.logo1} />
        <Image source={require("../../assets/logo2.png")} style={styles.logo2} />

        <View style={styles.centerContainer}>
          {error ? (
            <Text style={styles.errorText}>ERR!</Text>
          ) : userData ? (
            <DetailedUserCard
                name={userData.name}
                height={userData.height}
                weight={userData.weight}
                dob={userData.dob}
                nutritionalStatus={status}/>
          ) : (
            <Text>No user data available</Text>
          )}

          <CustomButton title="Edit Profile" onPress={handleEditProfile} />
          <CustomButton title="BMI Calculator" onPress={handleBMICalculator} />
          <CustomButton title="Logout" onPress={handleLogout} />
        </View>
      </ScrollView>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 15,
    marginTop: -150,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    fontSize: width * 0.05,
    color: 'red',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#009688',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: height * 0.015,
    width: '80%',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  imageBackground: {
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
  },
  imageStyle: {
    resizeMode: "cover", 
  },
  logo1: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    position: "absolute",
    top: 20,
    left: 20,
  },
  logo2: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    position: "absolute",
    marginLeft: 75,
    top: -5,
  },
});

export default ApplicationScreen;
