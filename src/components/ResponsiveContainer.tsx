import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ResponsiveContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 0,
  },
});

export default ResponsiveContainer;
