import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ForumScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forum Screen</Text>
      <Text style={styles.message}>This content is in development. Stay tuned!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default ForumScreen;
