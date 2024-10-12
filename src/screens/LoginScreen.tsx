import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import InputComponent from "../components/InputComponent";
import ButtonComponent from "../components/ButtonComponent";
import ResponsiveContainer from "../components/ResponsiveContainer";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { LoadingContext } from "../context/LoadingContext"; 
import LoadingComponent from "../components/LoadingComponent"; 
import { LoginApi } from "../api/Auth";
import { saveToken } from "../utils/handlingDataLogin"; 

type LoginScreenProps = {
  onLogin: () => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const loadingContext = useContext(LoadingContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    loadingContext?.setLoading(true);
    try {
      const response = await LoginApi({ 
        identifier: email,
        password: password 
      });

      console.log('Response from login API:', response.data); // Log the entire response

      const token = response.data.jwt; // Adjusted to access the correct property
      if (!token) {
        throw new Error("Token tidak ditemukan dalam respons.");
      }

      await saveToken(token); // Save token after successful login
      onLogin(); // Call onLogin function if additional logic is needed after login
      navigation.navigate("MainTabs"); // Navigate to MainTabs
    } catch (error) {
      console.error("Login failed", error); // Log error details
      Alert.alert("Login Gagal", "Silakan periksa email dan password Anda."); // Alert for login failure
    } finally {
      loadingContext?.setLoading(false);
    }
  };

  return (
    <ResponsiveContainer>
      <View style={styles.innerContainer}>
        <Image
          source={require("../../assets/login-chara.png")}
          style={styles.image}
        />
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Masuk ke aplikasi</Text>
        <InputComponent
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <InputComponent
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <ButtonComponent title="Masuk" onPress={handleLogin} />
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>
            Belum punya akun?{" "}
            <Text style={styles.registerLink}>Daftar disini!</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {loadingContext?.isLoading && <LoadingComponent />}
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
  registerText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#777",
  },
  registerLink: {
    color: "#0FA18C",
    fontWeight: "bold",
  },
});

export default LoginScreen;
