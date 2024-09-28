// src/components/Header.tsx
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>GenFiit App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: '#1E3A8A',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },
});

export default Header;
