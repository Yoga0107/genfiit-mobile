import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import AsyncStorage from "@react-native-async-storage/async-storage";
import ResponsiveContainer from "../components/ResponsiveContainer";
import UserCard from "../components/UserCard";
import WeightBox from "../components/BoxComponents/WeightBox";

import { getToken } from "../utils/handlingDataLogin";
import { calculateBMI, getNutritionalStatus } from "../helper/bmiHelper";
import { getUserDetails } from "../api/User";
import ProgramCard from "../components/ProgramCard";
import DebugScreen from "../components/ResetButton";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState(false);
  const [isPretestCompleted, setIsPretestCompleted] = useState<string | null>(null);

  // Add a state to manage the pull-to-refresh behavior
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch user data
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
          gender: userDetails.gender, // Assuming gender is available here
          bmi,
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

  // Function to check if pretest is completed
  const checkPretestCompletion = async () => {
    try {
      const pretestCompleted = await AsyncStorage.getItem('pretestCompleted');
      console.log('Fetched Pretest Status:', pretestCompleted); // Debugging log
      setIsPretestCompleted(pretestCompleted);
    } catch (error) {
      console.error('Error checking pretest status:', error);
    }
  };

  // Call functions on initial render
  useEffect(() => {
    fetchUserData();
    checkPretestCompletion();
  }, []);

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);

    // Re-fetch the user data and pretest completion status
    await fetchUserData();
    await checkPretestCompletion();

    setRefreshing(false);
  };

  const navigateTo = (screen: string) => {
    navigation.navigate(screen);
  };

  // Ensure we are waiting for `isPretestCompleted` to be loaded before rendering
  if (loading) {
    return <ActivityIndicator size="large" color="#00b4ac" />;
  }

  return (
    <ResponsiveContainer>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ImageBackground
          source={require("../../assets/header.png")}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        />
        <Image source={require("../../assets/logo1.png")} style={styles.logo1} />
        <Image source={require("../../assets/logo2.png")} style={styles.logo2} />

        <TouchableOpacity
          onPress={() => navigateTo("NotificationScreen")}
          style={styles.notificationButton}
        >
          <MaterialCommunityIcons name="bell" size={24} color="#FFC30E" />
        </TouchableOpacity>

        <View style={styles.centerContainer}>
          {error ? (
            <Text style={styles.errorText}>ERR!</Text>
          ) : userData ? (
            <UserCard
              name={userData.name}
              height={userData.height}
              weight={userData.weight}
              status={status}
            />
          ) : (
            <Text>No user data available</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.telehealthContainer}
          onPress={() => navigateTo("Telehealth")}
        >
          <View style={styles.iconTextContainer}>
            <MaterialCommunityIcons
              name="stethoscope"
              size={40}
              color="#D2DC02"
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              <Text style={styles.telehealthTitle}>Telehealth</Text>
              <Text style={styles.telehealthDescription}>
                Konsultasi dengan tenaga kesehatan disini!
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.programContainer}>
          <View style={styles.cardContainer}>
            {/* <ProgramCard /> */}
          </View>
        </View>

        {userData && (
          <WeightBox
            initialWeight={userData.weight}
            height={userData.height}
            gender={userData.gender} // Now passing gender here
          />
        )}

      <TouchableOpacity
  onPress={() => {
    // Log the screen that is about to open based on pretest status
    console.log("Navigating to screen:", isPretestCompleted === 'true' ? 'Posttest' : 'Pretest');
    
    // Check if pretest has been completed, then navigate accordingly
    if (isPretestCompleted === 'true') {
      navigation.navigate('Posttest');  // Navigate to PostTestScreen if pretest is completed
    } else {
      navigation.navigate('Pretest');  // Navigate to PretestScreen if pretest is not completed
    }
  }}
  style={styles.ctaButton}
>
  <LinearGradient
    colors={['#4EAA9F', '#CAA638']}
    start={[0, 0]}
    end={[1, 1]}
    style={styles.gradient}
  >
    <Text style={styles.ctaTitle}>
      {isPretestCompleted === 'true' ? 'Post-Test' : 'Pre-Test'}
    </Text>
    <Text style={styles.ctaSubtitle}>
      {isPretestCompleted === 'true'
        ? 'Ambil Post-Test mu Sekarang!'
        : 'Ambil Pre-Test mu Sekarang!'}
    </Text>
  </LinearGradient>
</TouchableOpacity>
        
        {/* <DebugScreen /> */}
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
  notificationButton: {
    position: "absolute",
    top: 25,
    right: 20,
    padding: 10,
    borderRadius: 20,
  },
  telehealthContainer: {
    borderColor: "#00b4ac",
    borderWidth: 2,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#ffffff",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginLeft: 30,
    marginRight: 30,
    overflow: "hidden",
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -10,
  },
  textContainer: {
    marginLeft: 10,
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  telehealthTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00b4ac",
    textAlign: "left",
  },
  telehealthDescription: {
    fontSize: 16,
    color: "#000000",
    textAlign: "left",
    width: "80%",
  },
  ctaButton: {
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 16,
  },
  gradient: {
    borderRadius: 15,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  ctaSubtitle: {
    fontSize: 21,
    color: "#fff",
    marginTop: 5,
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
  errorText: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  programContainer: {
    width: "100%",
    marginTop: 20,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingHorizontal: 16,
  },
});

export default HomeScreen;
