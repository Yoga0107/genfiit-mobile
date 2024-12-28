import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import ApplicationScreen from '../screens/ApplicationScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BMICalculatorScreen from '../screens/BMICalculatorScreen';
import SplashScreen from '../screens/SplashScreen';
import InformationScreen from '../screens/InformationScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ForumScreen from '../screens/ForumScreen';
import LearningSessionScreen from '../screens/LearningSessionScreen';
import { getToken } from '../utils/handlingDataLogin';
import TelehealthScreen from '../screens/TelehealthScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import CertificateScreen from '../screens/CertificateScreen';
import QuestionSessionScreen from '../screens/QuestionSessionScreen';
import PretestScreen from '../screens/PretestScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

export type RootStackParamList = {
  Splash: undefined;
  Information: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined; // Untuk BottomTabNavigation
  UserDetailScreen: undefined;
  LearningSession: { topic: 'Mental' | 'Gizi' };
  QuestionSession: { topic: string };
  MentalHealthMaterial: { id: string; material: any };
  BMICalculator: undefined;
  EditProfile: undefined;
  Telehealth: undefined;
  MedicalProfessionalSelectionScreen: undefined;
  NotificationScreen: undefined;
  ChangePassword: undefined;
  Certificate: undefined;
  Pretest: undefined;
  Home: undefined;
  Posttest: undefined;
};

const BottomTabNavigation = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: '#18B2A0',
        height: 60,
      },
      tabBarActiveTintColor: '#FFFFFF',
      tabBarInactiveTintColor: '#B0B0B0',
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name="home" size={focused ? 36 : 24} color={color} />
        ),
      }}
    />

    <Tab.Screen
      name="Module"
      component={LearningSessionScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, focused }) => (
          <MaterialIcons name="library-books" size={focused ? 36 : 24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Forum"
      component={ForumScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name="chatbubbles" size={focused ? 36 : 24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Application"
      component={ApplicationScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, focused }) => (
          <MaterialIcons name="apps" size={focused ? 36 : 24} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const AppNavigator: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Splash');

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      setInitialRoute(token ? 'MainTabs' : 'Login');
    };

    checkToken();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Information" component={InformationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {({ navigation }) => (
            <LoginScreen onLogin={() => navigation.navigate('MainTabs')} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserDetailScreen" component={UserDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="MainTabs"
          component={BottomTabNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LearningSession"
          component={LearningSessionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QuestionSession"
          component={QuestionSessionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BMICalculator"
          component={BMICalculatorScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Pretest"
          component={PretestScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Posttest"
          component={PretestScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Telehealth"
          component={TelehealthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Certificate" component={CertificateScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
