import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputComponent from '../components/InputComponent';
import ButtonComponent from '../components/ButtonComponent';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <InputComponent placeholder="Email" value={email} onChangeText={setEmail} />
      <InputComponent placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <ButtonComponent title="Register" onPress={handleRegister} />
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
  },
});

export default RegisterScreen;
