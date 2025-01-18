import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from "react-native";
import Checkbox from "expo-checkbox";
import InputComponent from "../components/InputComponent"; 
import ButtonComponent from "../components/Button/ButtonComponent";
import ResponsiveContainer from "../components/ResponsiveContainer";
import { useNavigation, NavigationProp } from "@react-navigation/native";
// import AlertModal from '../components/AlertModal';
import SuccessModal from '../components/SuccessModal';
import { RegisterApi } from "../api/Auth";
import { saveID } from "../utils/handlingDataRegister"; 
import { saveToken } from "../utils/handlingDataLogin"; 
import AlertModal from "../components/Alerts/AlertModal";

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+62");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false); 
  const [alertMessage, setAlertMessage] = useState(''); 
  const [successVisible, setSuccessVisible] = useState(false);

  const handlePhoneNumberChange = (value: string) => {
    if (!value.startsWith("+62")) {
      setPhoneNumber("+62");
    } else {
      setPhoneNumber(value);
    }
  };

  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(email)) {
      setAlertMessage('Harap masukkan format email yang valid.');
      setAlertVisible(true);
      return;
    }
    if (phoneNumber.length < 13) {
      setAlertMessage('Harap masukkan nomor HP yang valid dengan format +62 dan lebih dari 12 digit.');
      setAlertVisible(true);
      return;
    }
    if (!username || !password || !confirmPassword) {
      setAlertMessage('Harap isi semua field.');
      setAlertVisible(true);
      return;
    }
    if (password !== confirmPassword) {
      setAlertMessage('Password dan Konfirmasi Password tidak cocok.');
      setAlertVisible(true);
      return;
    }
    if (!agree) {
      setAlertMessage('Anda harus menyetujui persyaratan penggunaan aplikasi.');
      setAlertVisible(true);
      return;
    }

    try {
      const registerData = {
        username,
        email,
        password,
        phone: phoneNumber,
      };
      const response = await RegisterApi(registerData);
      
      
      console.log("API Response:", response);
      
      const userId = response.user.id;
      const token = response.jwt; 
      
      await saveID(userId.toString()); 
      await saveToken(token); 
      
      setSuccessVisible(true);
      
      
      setTimeout(() => {
        setSuccessVisible(false);
        navigation.navigate("UserDetailScreen");
      }, 2000); 
    
    } catch (error) {
      setAlertMessage('Data Already Exist! Please input with different data!');
      setAlertVisible(true);
    }
  };                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         

  const openTerms = () => {
    Linking.openURL('https://example.com/syarat-ketentuan.pdf');
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://example.com/kebijakan-privasi.pdf');
  };

  return (
    <ResponsiveContainer>
      <View style={styles.innerContainer}>
        <Image
          source={require("../../assets/login-chara.png")}
          style={styles.image}
        />

        <Text style={styles.title}>Daftar</Text>
        <Text style={styles.subtitle}>Buat akun baru</Text>

        <InputComponent 
          placeholder="Email" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
        />
        
        <InputComponent 
          placeholder="Username" 
          value={username} 
          onChangeText={setUsername} 
        />
        
        <InputComponent 
          placeholder="Nomor HP (+62)" 
          value={phoneNumber} 
          onChangeText={handlePhoneNumberChange} 
          keyboardType="phone-pad" 
        />

        <InputComponent 
          placeholder="Password" 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />
        
        <InputComponent 
          placeholder="Konfirmasi Password" 
          secureTextEntry 
          value={confirmPassword} 
          onChangeText={setConfirmPassword} 
        />

        <View style={styles.agreementContainer}>
          <Checkbox value={agree} onValueChange={setAgree} />
          <Text style={styles.agreementText}>
          I agree with{' '}
            <TouchableOpacity onPress={openTerms}>
              <Text style={styles.linkText}>Terms & Condition</Text>
            </TouchableOpacity>{' '}
            and{' '}
            <TouchableOpacity onPress={openPrivacyPolicy}>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>
          </Text>
        </View>

        <ButtonComponent title="Register" onPress={handleRegister} />
        
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>
            Have an account?{" "}
            <Text style={styles.loginLink}>Login here!</Text>
          </Text>
        </TouchableOpacity>

        <AlertModal
          visible={alertVisible}
          message={alertMessage}
          onClose={() => setAlertVisible(false)} 
          type={"success"}        />

        <SuccessModal
          visible={successVisible}
          onClose={() => setSuccessVisible(false)}
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
  agreementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  agreementText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#777",
  },
  loginText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#777",
  },
  loginLink: {
    color: "#0FA18C",
    fontWeight: "bold",
  },
  linkText: {
    color: '#1E3A8A', 
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
