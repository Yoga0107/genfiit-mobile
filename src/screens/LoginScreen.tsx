import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import InputComponent from '../components/InputComponent';
import ButtonComponent from '../components/ButtonComponent';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type LoginScreenProps = {
  navigation: NavigationProp<any>;
  onLogin: () => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    onLogin();
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/login-chara.png')}
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
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>
          Belum punya akun? <Text style={styles.registerLink}>Daftar disini!</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '100%', // Adjust size as needed
    height: 200, // Adjust size as needed
    marginBottom: 20, // Spacing below the image
    resizeMode: 'contain', // Keep the aspect ratio
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    color: '#0FA18C',
    marginBottom: 20,
  },
  registerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#777',
  },
  registerLink: {
    color: '#0FA18C',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
