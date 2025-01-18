import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import InputComponent from "../components/InputComponent";
import ButtonComponent from "../components/Button/ButtonComponent";
import ResponsiveContainer from "../components/ResponsiveContainer";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { LoadingContext } from "../context/LoadingContext";
import LoadingComponent from "../components/LoadingComponent";
import { LoginApi } from "../api/Auth";
import { saveToken, saveCompletionStatus } from "../utils/handlingDataLogin";  // Import saveCompletionStatus
import { saveIDuserdetail } from "../utils/handlingDataLogin";  // Import saveIDuserdetail

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
      const loginResponse = await LoginApi({
        identifier: email,
        password: password,
      });
  
      console.log("Response from login API:", loginResponse?.data);
  
      const token = loginResponse?.data?.jwt;
  
      if (!token) {
        throw new Error("Token is missing in response.");
      }
  
      // Save the token
      await saveToken(token);
  
      // Use the saved token to fetch user details
      const userDetailsResponse = await fetch(
        "https://api-genfiit.yanginibeda.web.id/api/users/me",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!userDetailsResponse.ok) {
        throw new Error("Failed to fetch user details.");
      }
  
      const userDetails = await userDetailsResponse.json();
      const userId = userDetails?.id; // Assuming the response contains an `id` field
  
      if (!userId) {
        throw new Error("User ID is missing in response.");
      }
  
      // Save the user ID
      await saveIDuserdetail(userId);
  
      // Save completion status as true (assuming login means the user is complete)
      await saveCompletionStatus(true);
  
      onLogin();
      navigation.navigate("MainTabs");
      console.log("User ID saved:", userId);
    } catch (error) {
      console.error("Login failed", error);
      Alert.alert("Login Gagal", "Silakan periksa email dan password Anda.");
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
        <Text style={styles.subtitle}>Continue to app</Text>
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
            Haven't account yet?{" "}
            <Text style={styles.registerLink}>Register Here!</Text>
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
