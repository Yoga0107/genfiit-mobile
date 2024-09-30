import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import InputComponent from "../components/InputComponent";
import ButtonComponent from "../components/ButtonComponent";
import ResponsiveContainer from "../components/ResponsiveContainer";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { LoadingContext } from "../context/LoadingContext"; 
import LoadingComponent from "../components/LoadingComponent"; 

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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onLogin();
      navigation.navigate("MainTabs");
    } catch (error) {
      console.error("Login failed", error);
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
        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Lupa Kata Sandi?</Text>
        </TouchableOpacity>
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
  forgotPasswordContainer: {
    alignItems: "flex-end",
  },
  forgotPasswordText: {
    color: "#0FA18C",
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
