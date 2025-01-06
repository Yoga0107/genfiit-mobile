import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions, Linking } from 'react-native';

const { width, height } = Dimensions.get('window');

const PostTestScreen: React.FC = () => {
  // Correct Post-Test URL
  const jotformUrl = 'https://form.jotform.com/243615245421450';

  useEffect(() => {
    // Open the Post-Test URL directly when the screen is loaded
    Linking.openURL(jotformUrl).catch((err) => console.error('Failed to open URL:', err));
  }, []);

  const renderLoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#18B2A0" />
    </View>
  );

  return (
    <View style={styles.container}>
      {renderLoadingIndicator()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default PostTestScreen;
