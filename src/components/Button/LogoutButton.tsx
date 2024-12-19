import React from 'react';
import { Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteToken } from '../../utils/handlingDataLogin';
import { deleteID } from '../../utils/handlingDataRegister';

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
            try {
              // Log the current user ID before deletion
              const userId = await AsyncStorage.getItem('userId');
              console.log('User ID before logout:', userId);

              // Delete user ID
              await deleteID();

              // Ensure 'userId' is deleted
              const deletedUserId = await AsyncStorage.getItem('userId');
              console.log('User ID after deletion:', deletedUserId); // Should be null

              // Clear all AsyncStorage data
              await AsyncStorage.clear();

              // Optionally delete the token
              await deleteToken();

              // Trigger the onLogout prop to handle state update or navigation
              onLogout();
            } catch (error) {
              console.error('Error during logout process:', error);
            }
          }
        }
      ]
    );
  };

  return <Button title="Logout" onPress={handleLogout} />;
};

export default LogoutButton;
