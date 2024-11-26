import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveID = async (userId: string | number) => {
  try {
    await AsyncStorage.setItem('userId', String(userId)); 
    console.log('User ID saved successfully.', userId);
  } catch (error) {
    console.error('Error saving user ID:', error);
  }
};


export const getID = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (userId !== null) {
      console.log('Retrieved user ID:', userId);
      return userId;
    } else {
      console.log('No user ID found.');
      return null; 
    }
  } catch (error) {
    console.error('Error retrieving user ID:', error);
    return null; 
  }
};

export const deleteID = async () => {
  try {
    await AsyncStorage.removeItem('userId'); 
    console.log("User ID has been deleted");
  } catch (e) {
    console.error(`Remove data failed: ${e}`);
  }
};