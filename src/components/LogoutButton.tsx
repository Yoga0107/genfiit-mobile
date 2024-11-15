import React from 'react';
import { Button, Alert } from 'react-native';
import { deleteToken } from '../utils/handlingDataLogin'; 

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
            await deleteToken(); 
            onLogout(); 
          }
        }
      ]
    );
  };

  return (
    <Button title="Logout" onPress={handleLogout} />
  );
};

export default LogoutButton;
