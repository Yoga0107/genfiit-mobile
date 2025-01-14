import React from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

type NavigationProps = StackNavigationProp<RootStackParamList, 'Posttest'>;

const PosttestScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const jotformUrl = 'https://form.jotform.com/243615245421450';

  const handleWebViewNavigationStateChange = async (navState: WebViewNavigation) => {
    const { url } = navState;

    if (url.includes('thank-you') || url.includes('submit.jotform.com')) {
      try {
        await AsyncStorage.setItem('PosttestCompleted', 'true');
        console.log('Posttest completed status saved.');
        Alert.alert(
          'Form Completed',
          'Thank you for completing the form!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home'),
            },
          ]
        );
      } catch (error) {
        console.error('Error saving Posttest status:', error);
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
        source={{ uri: jotformUrl }}
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

export default PosttestScreen;
