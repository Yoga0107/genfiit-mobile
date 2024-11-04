import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to save the user ID to AsyncStorage
export const saveID = async (userId: string) => {
  try {
    await AsyncStorage.setItem('userId', userId);
    console.log('User ID saved successfully.');
  } catch (error) {
    console.error('Error saving user ID:', error);
  }
};

// Function to retrieve the user ID from AsyncStorage
export const getID = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (userId !== null) {
      console.log('Retrieved user ID:', userId);
      return userId; // Return the user ID if found
    } else {
      console.log('No user ID found.');
      return null; // Return null if no user ID is found
    }
  } catch (error) {
    console.error('Error retrieving user ID:', error);
    return null; // Return null in case of an error
  }
};
