import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to save mental completion data
export const saveMentalCompletion = async (mentalCompleted: number) => {
  await AsyncStorage.setItem('mentalCompletedCount', mentalCompleted.toString());
};

// Function to save gizi completion data
export const saveGiziCompletion = async (giziCompleted: number) => {
  await AsyncStorage.setItem('giziCompletedCount', giziCompleted.toString());
};

// Function to get completion data for both categories
export const getCompletionData = async () => {
  const mentalCompleted = await AsyncStorage.getItem('mentalCompletedCount');
  const giziCompleted = await AsyncStorage.getItem('giziCompletedCount');
  return {
    mentalCompleted: mentalCompleted ? parseInt(mentalCompleted) : 0,
    giziCompleted: giziCompleted ? parseInt(giziCompleted) : 0,
  };
};
