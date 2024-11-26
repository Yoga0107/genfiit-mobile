import React from 'react';
import { Button, Alert } from 'react-native';
import { deleteToken } from '../utils/handlingDataLogin'; 
import { deleteID } from '../utils/handlingDataRegister';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutButton: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const handleLogout = async () => {
    Alert.alert(
      "Konfirmasi",
      "Apakah Anda yakin ingin logout?",
      [
        {
          text: "Batal",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            // Clear all AsyncStorage data
            await AsyncStorage.clear();
            
            // Optionally call deleteToken and deleteID in case there are specific items to remove
            await deleteToken(); 
            await deleteID(); 

            onLogout(); // Call the onLogout prop to handle state update or navigation
          }
        }
      ]
    );
  };

  return <Button title="Logout" onPress={handleLogout} />;
};

export default LogoutButton;
