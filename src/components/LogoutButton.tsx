import React from 'react';
import { Button, Alert } from 'react-native';
import { deleteToken } from '../utils/handlingDataLogin'; // Pastikan jalur ini sesuai dengan struktur proyek Anda

const LogoutButton: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const handleLogout = async () => {
    // Tampilkan konfirmasi sebelum logout
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
            await deleteToken(); // Menghapus token
            onLogout(); // Memanggil fungsi onLogout untuk melakukan navigasi atau aksi lain setelah logout
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
