import AsyncStorage from "@react-native-async-storage/async-storage";

const saveToken = async (value: string) => {
  if (!value) {
    throw new Error("Tidak dapat menyimpan token: nilai tidak valid.");
  }
  try {
    await AsyncStorage.setItem('token', value);
    console.log("Token saved:", value); 
  } catch (e) {
    alert(`Saving data failed: ${e}`);
  }
};

const deleteToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.error('Failed to delete token:', error);
  }
};

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log("Token retrieved:", token); 
    return token;
  } catch (e) {
    alert(`Getting data failed: ${e}`);
  }
};

export const saveCompletionStatus = async (status: boolean) => {
  try {
    await AsyncStorage.setItem('@completion_status', JSON.stringify(status));
  } catch (error) {
    console.error('Error saving completion status', error);
  }
};

// Fungsi untuk mendapatkan completion status
export const getCompletionStatus = async () => {
  try {
    const status = await AsyncStorage.getItem('@completion_status');
    return status ? JSON.parse(status) : false; // Mengembalikan false jika tidak ada status
  } catch (error) {
    console.error('Error getting completion status', error);
    return false; // Mengembalikan false jika terjadi error
  }
};

// Delete Completion Status (is_complete)
export const deleteCompletionStatus = async () => {
  try {
    await AsyncStorage.removeItem('@completion_status');  // Ganti dengan kunci yang digunakan untuk menyimpan status completion
  } catch (error) {
    console.error('Failed to delete completion status:', error);
  }
};

// Save user ID
export const saveIDuserdetail = async (userID: number) => {
  try {
    await AsyncStorage.setItem('@user_id', JSON.stringify(userID));
    console.log("User ID saved:", userID);
  } catch (error) {
    console.error('Error saving user ID:', error);
  }
};

// Get saved user ID
export const getIDuserdetail = async () => {
  try {
    const userID = await AsyncStorage.getItem('@user_id');
    console.log("User ID retrieved:", userID);
    return userID ? JSON.parse(userID) : null; // Mengembalikan null jika tidak ada user ID
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null; // Mengembalikan null jika terjadi error
  }
};

export {
  saveToken,
  deleteToken,
  getToken,
};
