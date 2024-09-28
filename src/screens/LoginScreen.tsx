import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import InputComponent from "../components/InputComponent";
import ButtonComponent from "../components/ButtonComponent";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type LoginScreenProps = {
  navigation: NavigationProp<any>;
  onLogin: () => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    onLogin();
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <InputComponent
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <InputComponent
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <ButtonComponent title="Login" onPress={handleLogin} />
      <Text onPress={() => navigation.navigate("Register")}>
        Don't have an account? Register
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default LoginScreen;
