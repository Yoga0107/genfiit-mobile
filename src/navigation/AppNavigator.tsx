import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BMICalculatorScreen from '../screens/BMICalculatorScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Simulate loading and login check (e.g., checking token)
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate 2-second loading
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {!loggedIn ? (
        <Stack.Navigator>
          {/* Pass navigation and props */}
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {props => <LoginScreen {...props} onLogin={() => setLoggedIn(true)} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="BMI Calculator" component={BMICalculatorScreen} />

        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;