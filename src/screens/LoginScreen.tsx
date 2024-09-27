// src/screens/LoginScreen.tsx
import React, { FC } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface LoginScreenProps {
  onLogin: () => void;
  navigation: any;
}

const LoginScreen: FC<LoginScreenProps> = ({ onLogin, navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Username" style={styles.input} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry />
      <Button title="Login" onPress={onLogin} />
      <Text
        style={styles.registerText}
        onPress={() => navigation.navigate('Register')}
      >
        Don't have an account? Register now.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  registerText: {
    color: '#1E3A8A',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;
