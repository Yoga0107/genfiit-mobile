import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DebugScreen: React.FC = () => {
  const resetPretestStatus = async () => {
    try {
      await AsyncStorage.removeItem('pretestCompleted');
      console.log('Pretest status has been reset.');
    } catch (error) {
      console.error('Error resetting pretest status:', error);
    }
  };

  const checkPretestStatus = async () => {
    try {
      const pretestCompleted = await AsyncStorage.getItem('pretestCompleted');
      console.log('Pretest status:', pretestCompleted);
    } catch (error) {
      console.error('Error checking pretest status:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={resetPretestStatus} style={styles.button}>
        <Text style={styles.buttonText}>Reset Pretest Status</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={checkPretestStatus} style={styles.button}>
        <Text style={styles.buttonText}>Check Pretest Status</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4EAA9F',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DebugScreen;
