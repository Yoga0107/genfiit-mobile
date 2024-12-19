import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveID = async (userId: string | number) => {
  try {
    await AsyncStorage.setItem('userId', String(userId)); 
    console.log('User ID saved successfully:', userId);
  } catch (error) {
    console.error('Error saving user ID:', error);
  }
};



export const getID = async (): Promise<number | null> => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (userId !== null) {
      const numericID = Number(userId); 
      if (!isNaN(numericID)) {
        console.log('Retrieved user ID (as number):', numericID);
        return numericID; 
      } else {
        console.log('User ID is not a valid number:', userId);
        return null;
      }
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
    await AsyncStorage.removeItem('userID');
  } catch (error) {
    console.error('Failed to delete user ID:', error);
  }
};