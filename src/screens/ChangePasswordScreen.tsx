import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import axios from 'axios';
import InputComponent from "../components/InputComponent"; 
import ButtonComponent from "../components/ButtonComponent";
import ResponsiveContainer from "../components/ResponsiveContainer";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import SuccessAlert from "../components/Alerts/SuccessAlert"; // Importing the SuccessAlert
import { getToken } from "../utils/handlingDataLogin";

const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [alertVisible, setAlertVisible] = useState(false); 
  const [alertMessage, setAlertMessage] = useState('');
  const [successVisible, setSuccessVisible] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setAlertMessage('Harap isi semua field.');
      setAlertVisible(true);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setAlertMessage('Password baru dan Konfirmasi Password tidak cocok.');
      setAlertVisible(true);
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        setAlertMessage('Token tidak ditemukan. Silakan login terlebih dahulu.');
        setAlertVisible(true);
        return;
      }

      const response = await axios.post(
        'https://api-genfiit.yanginibeda.web.id/api/auth/change-password',
        {
          password: newPassword,
          currentPassword: oldPassword,
          passwordConfirmation: confirmNewPassword,
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      console.log("API Response:", response.data);
      setAlertMessage('Password telah berhasil diubah!');
      setAlertVisible(true);

      setTimeout(() => {
        setAlertVisible(false);
        navigation.goBack();
      }, 2000);
    } catch (error) {
      const errMessage = (error as Error).message;
      setAlertMessage('Gagal mengganti password: ' + errMessage);
      setAlertVisible(true);
    }
  };

  return (
    <ResponsiveContainer>
      <View style={styles.innerContainer}>
        <Image
          source={require("../../assets/login-chara.png")}
          style={styles.image}
        />

        <Text style={styles.title}>Ganti Password</Text>
        <Text style={styles.subtitle}>Silakan masukkan password lama dan baru</Text>

        <InputComponent 
          placeholder="Password Lama" 
          secureTextEntry 
          value={oldPassword} 
          onChangeText={setOldPassword} 
        />

        <InputComponent 
          placeholder="Password Baru" 
          secureTextEntry 
          value={newPassword} 
          onChangeText={setNewPassword} 
        />

        <InputComponent 
          placeholder="Konfirmasi Password Baru" 
          secureTextEntry 
          value={confirmNewPassword} 
          onChangeText={setConfirmNewPassword} 
        />

        <ButtonComponent title="Ganti Password" onPress={handleChangePassword} />

        <SuccessAlert
          visible={alertVisible}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      </View>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    resizeMode: "contain", 
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
  },
});

export default ChangePasswordScreen;
