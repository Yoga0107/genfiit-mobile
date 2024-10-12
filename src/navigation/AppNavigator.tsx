import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import ApplicationScreen from "../screens/ApplicationScreen"; 
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import BMICalculatorScreen from "../screens/BMICalculatorScreen";
import SplashScreen from "../screens/SplashScreen";
import InformationScreen from "../screens/InformationScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import { getToken } from '../utils/handlingDataLogin'; // Import getToken

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Tab.Screen name="BMI Calculator" component={BMICalculatorScreen} />
    <Tab.Screen name="Profile" component={ApplicationScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<string>('Splash'); // Set rute awal sebagai Splash

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      setInitialRoute(token ? 'MainTabs' : 'Login'); // Atur rute awal berdasarkan token
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
            <LoginScreen
              onLogin={() => navigation.navigate('MainTabs')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="MainTabs"
          component={BottomTabNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="BMI Calculator" component={BMICalculatorScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
