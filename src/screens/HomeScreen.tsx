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
import ProgramCard from "../components/ProgramCard";
import { getToken } from "../utils/handlingDataLogin";
import { calculateBMI, getNutritionalStatus } from "../helper/bmiHelper";
import { getUserDetails } from "../api/User";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState(false);
  const [isPretestCompleted, setIsPretestCompleted] = useState<string | null>(null);
  const [moduleCompletion, setModuleCompletion] = useState<number>(0);
  const [mentalCompletion, setMentalCompletion] = useState<number>(0);
  const [giziCompletion, setGiziCompletion] = useState<number>(0);
  const [isFinished, setIsFinished] = useState(false);

  // Add a state to manage the pull-to-refresh behavior
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user data
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
          gender: userDetails.gender,
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

  const checkTestCompletion = async () => {
    try {
      const pretestCompleted = await AsyncStorage.getItem('pretestCompleted');
      const posttestCompleted = await AsyncStorage.getItem('posttestCompleted');
  
      setIsPretestCompleted(pretestCompleted);
      setIsFinished(posttestCompleted === 'true');
    } catch (error) {
      console.error('Error checking test completion:', error);
    }
  };
  

  // Check pre-test completion
  const checkPretestCompletion = async () => {
    try {
      const pretestCompleted = await AsyncStorage.getItem('pretestCompleted');
      setIsPretestCompleted(pretestCompleted);
    } catch (error) {
      console.error('Error checking pretest status:', error);
    }
  };

  // Calculate module completion (number of modules completed)
  const calculateModuleCompletion = async () => {
    try {
      const completedModules = [];
      for (let i = 1; i <= 5; i++) {
        const completed = await AsyncStorage.getItem(`module_${i}_completed`);
        if (completed === 'true') {
          completedModules.push(i);
        }
      }
      setModuleCompletion(completedModules.length); // Show number of completed modules
    } catch (error) {
      console.error('Error calculating module completion:', error);
    }
  };

  // Fetch the completion data for mental and gizi learning
  const fetchCompletionData = async () => {
    try {
      const mentalCompletedCount = await AsyncStorage.getItem('mentalCompletedCount');
      const giziCompletedCount = await AsyncStorage.getItem('giziCompletedCount');

      const mentalCompleted = mentalCompletedCount ? parseInt(mentalCompletedCount) : 0;
      const giziCompleted = giziCompletedCount ? parseInt(giziCompletedCount) : 0;

      setMentalCompletion(mentalCompleted);
      setGiziCompletion(giziCompleted);

      console.log("Mental Completion:", mentalCompleted);
      console.log("Gizi Completion:", giziCompleted);
    } catch (error) {
      console.error("Error fetching completion data:", error);
    }
  };

  // Fetch data initially and on refresh (excluding Pretest/Posttest CTA)
useEffect(() => {
  fetchUserData();
  checkTestCompletion();
  checkPretestCompletion();
  calculateModuleCompletion();
  fetchCompletionData();

  const intervalId = setInterval(() => {
    console.log("Refreshing ProgramCard data...");
    calculateModuleCompletion();
    fetchCompletionData();
  }, 10000); // Refresh every 10 seconds

  // Clear interval when component unmounts
  return () => {
    clearInterval(intervalId);
    console.log("Interval cleared.");
  };
  
}, []);


  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    await calculateModuleCompletion();
    await fetchCompletionData();
    await checkPretestCompletion();
    await checkTestCompletion();
    setRefreshing(false);
  };

  useEffect(() => {
    if (isPretestCompleted === 'true' && 'true') {
      setIsFinished(true);
    } else {
      setIsFinished(false);
    }
  }, [isPretestCompleted]);

  // Navigation to different screens
  const navigateTo = (screen: string) => {
    navigation.navigate(screen);
  };

  // Wait for user data and status to be ready before rendering
  if (loading) {
    return <ActivityIndicator size="large" color="#00b4ac" />;
  }

  return (
    <ResponsiveContainer>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
            <Text style={styles.errorText}>Error fetching user data!</Text>
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
              Consult with healthcare professionals here!
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.programContainer}>
          <View style={styles.cardContainer}>
            <ProgramCard completed={mentalCompletion} title={"Mental Learning"} />
            <ProgramCard completed={giziCompletion} title={"Nutrition Learning"} />
          </View>
        </View>

        {userData && (
          <WeightBox
            initialWeight={userData.weight}
            height={userData.height}
            gender={userData.gender}
          />
        )}

        <TouchableOpacity
          onPress={() => {
            if (isPretestCompleted === 'true') {
              // Navigate to PosttestScreen
              navigation.navigate('Posttest');
            } else {
              // Navigate to PretestScreen
              navigation.navigate('Pretest');
            }
          }}
          style={styles.ctaButton}
          disabled={isFinished}  // Disable the button if finished
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
                ? 'Take Your Post-Test Now!'
                : 'Take Your Pre-Test Now!'}
            </Text>

            {/* Finished Overlay */}
            {isFinished && (
              <View style={styles.finishedOverlay}>
                <Text style={styles.finishedText}>Finished</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>


        <TouchableOpacity
  onPress={async () => {
    try {
      // Hapus data pretest dan posttest dari AsyncStorage
      await AsyncStorage.removeItem('pretestCompleted');
      await AsyncStorage.removeItem('posttestCompleted');
      
      // Reset state
      setIsPretestCompleted(null);
      setIsFinished(false);

      console.log('Pretest dan Posttest telah direset!');
      alert('Pretest dan Posttest telah direset!');
    } catch (error) {
      console.error('Error mereset pretest dan posttest:', error);
      alert('Terjadi kesalahan saat mereset status pretest dan posttest.');
    }
  }}
  style={[styles.ctaButton, { marginTop: 20 }]} // Menambahkan margin atas agar ada jarak dengan tombol sebelumnya
>
    <Text style={styles.resetButton}>Reset Pre-Test & Post-Test</Text>
    <Text style={styles.resetText}>Klik untuk mengatur ulang status pretest dan posttest</Text>
</TouchableOpacity>



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
  finishedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)", 
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15, 
    zIndex: 2,  
  },
  finishedText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textTransform: "uppercase",  // Makes text uppercase
    letterSpacing: 2,  // Adds space between letters
  },
  resetButton: {
    backgroundColor: '#3498DB',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  resetText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },


});

export default HomeScreen;
