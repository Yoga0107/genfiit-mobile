import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from "react-native";
import Checkbox from "expo-checkbox";
import InputComponent from "../components/InputComponent"; // Updated InputComponent
import ButtonComponent from "../components/ButtonComponent";
import ResponsiveContainer from "../components/ResponsiveContainer";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import AlertModal from '../components/AlertModal'; // Import AlertModal
import SuccessModal from '../components/SuccessModal'; // Import SuccessModal

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false); // State for alert modal
  const [alertMessage, setAlertMessage] = useState(''); // State for alert message
  const [successVisible, setSuccessVisible] = useState(false); // State for success modal

  const handleRegister = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    if (!emailRegex.test(email)) {
      setAlertMessage('Harap masukkan format email yang valid.');
      setAlertVisible(true);
      return;
    }
    
    // Validate phone number format
    if (!phoneNumber.startsWith('+62') || phoneNumber.length < 13) {
      setAlertMessage('Harap masukkan nomor HP dengan format +62 dan lebih dari 12 digit.');
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

    // If registration is successful
    setSuccessVisible(true);

    // Automatically navigate after the modal closes
    setTimeout(() => {
      setSuccessVisible(false);
      navigation.navigate("Login");
    }, 2000); // Adjust the duration as needed
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
          keyboardType="email-address" // Set keyboard type to email
        />
        
        <InputComponent 
          placeholder="Username" 
          value={username} 
          onChangeText={setUsername} 
        />
<InputComponent 
  placeholder="+62 8129 9090 466" 
  value={phoneNumber} 
  onChangeText={setPhoneNumber} 
  keyboardType="phone-pad" // Set keyboard type to phone
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
            Saya setuju dengan{' '}
            <TouchableOpacity onPress={openTerms}>
              <Text style={styles.linkText}>Syarat dan Ketentuan</Text>
            </TouchableOpacity>{' '}
            dan{' '}
            <TouchableOpacity onPress={openPrivacyPolicy}>
              <Text style={styles.linkText}>Kebijakan Privasi</Text>
            </TouchableOpacity>
          </Text>
        </View>

        <ButtonComponent title="Register" onPress={handleRegister} />
        
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>
            Sudah punya akun?{" "}
            <Text style={styles.loginLink}>Masuk disini!</Text>
          </Text>
        </TouchableOpacity>

        {/* Alert modal for error messages */}
        <AlertModal
          visible={alertVisible}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />

        {/* Success modal for registration success */}
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
