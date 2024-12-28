import React from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

type NavigationProps = StackNavigationProp<RootStackParamList, 'Posttest'>;

const PostTestScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  // Correct Post-Test URL
  const jotformUrl = 'https://form.jotform.com/243615245421450';

  const handleWebViewNavigationStateChange = async (navState: WebViewNavigation) => {
    const { url } = navState;

    console.log("Navigated URL: ", url); // Log to see the URL being loaded

    // Check if the URL includes the thank-you page or submit page, indicating that the form is submitted
    if (url.includes('thank-you') || url.includes('submit.jotform.com')) {
      try {
        await AsyncStorage.setItem('posttestCompleted', 'true');
        console.log('Posttest completed status saved.');
        Alert.alert(
          'Form Completed',
          'Thank you for completing the post-test!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home'),
            },
          ]
        );
      } catch (error) {
        console.error('Error saving posttest status:', error);
      }
    }
  };

  const renderLoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#18B2A0" />
    </View>
  );

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: jotformUrl }} // Use the correct Post-Test URL here
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={renderLoadingIndicator}
        onNavigationStateChange={handleWebViewNavigationStateChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
    width,
    height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default PostTestScreen;
