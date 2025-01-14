import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Dimensions,
  RefreshControl,
  Image,
} from 'react-native';
import HeaderComponent from '../components/Header';
import { getCompletionStatus } from '../utils/handlingDataLogin';
import { getUserDetails } from '../api/User';
import ResponsiveContainer from '../components/ResponsiveContainer';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';



const { width } = Dimensions.get('window');

const CertificateScreen: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [completionStatus, setCompletionStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  const fetchCompletionStatus = async () => {
    const token = await getToken();
    if (!token) {
      console.log('Token not found');
      return;
    }
    try {
      const response = await fetch('https://api-genfiit.yanginibeda.web.id/api/users/me', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data?.is_complete) {
        setCompletionStatus(true);
      } else {
        setCompletionStatus(false);
      }
    } catch (error) {
      console.error('Error fetching completion status:', error);
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const data = await getUserDetails();
      setUserData(data?.user_detail?.information);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Gagal mengambil data pengguna');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCompletionStatus();
    await fetchUserData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    console.log('Fetching completion status...');
    fetchCompletionStatus();
    fetchUserData();
  }, []);

  const generateCertificateImage = async (name: string, module: string) => {
    try {
      // Load the local asset using Expo Asset
      const asset = Asset.fromModule(require('../../assets/genfiit-certif.png'));
      await asset.downloadAsync();  // Ensure the asset is fully loaded
  
      // Get the local file URI for the image
      const imageUri = asset.uri;
  
      // Generate HTML content with the image URL
      const html = `
        <html>
          <body style="display: flex; justify-content: center; align-items: center; height: 100%; margin: 0;">
            <div style="position: relative; text-align: center; font-family: Arial;">
              <!-- Background Image -->
              <img src="${imageUri}" style="width: 100%; max-width: 600px; height: auto;"/>
  
              <!-- Text over the image -->
              <p style="position: absolute; top: 35%; left: 50%; transform: translateX(-50%); color: #000; font-size: 24px;"><strong>${name}</strong></p>
              <p style="position: absolute; top: 47%; left: 50%; transform: translateX(-50%); color: #000; font-size: 18px;">Completing the module: <strong>${module}</strong></p>
              <p style="position: absolute; top: 60%; left: 50%; transform: translateX(-50%); color: #000; font-size: 11px;">Date: ${new Date().toLocaleDateString()}</p>
            </div>
          </body>
        </html>
      `;
  
      // Generate the PDF file and get its URI
      const { uri } = await Print.printToFileAsync({ html });
      console.log('Generated PDF URI:', uri);
  
      // Set the destination path for the PDF file in the document directory
      const fileUri = FileSystem.documentDirectory + `certificate_${name}_${module}.pdf`;
  
      // Move the generated file to the document directory
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });
  
      console.log('Moved file to:', fileUri);
  
      // Check if sharing is available
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        // If sharing is available, share the certificate file
        await Sharing.shareAsync(fileUri);
        Alert.alert('Certificate Shared', 'The certificate is ready. You can share it now.');
      } else {
        // If sharing is not available, alert user that the certificate is saved
        Alert.alert('Certificate Saved', 'The certificate is saved. You can open it from your documents folder.');
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      Alert.alert('Error', 'Failed to generate certificate.');
    }
  };
  


  const handleGenerateCertificate = (module: string) => {
    if (userData) {
      generateCertificateImage(userData.full_name, module);
    } else {
      Alert.alert('Error', 'Data pengguna tidak ditemukan');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00b4ac" />;
  }

  return (
    <ResponsiveContainer>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#00b4ac']}
          />
        }
      >
        <HeaderComponent title="Sertifikat" />

        <View style={styles.contentContainer}>
          {completionStatus === false ? (
            <Text style={styles.noCertificates}>No Certificate! Finish your module!</Text>
          ) : (
            <>
              <Text style={styles.certificatesTitle}>My Certificate</Text>

              <TouchableOpacity
                style={[styles.certificateCard, styles.nutritionCard]}
                onPress={() => handleGenerateCertificate('Nutrition Learning')}
              >
                <Image 
                  source={require('../../assets/genfiit-certif.png')} 
                  style={styles.certImage}
                />
                <View style={styles.certificateContent}>
                  <Text style={styles.certTitleText}>Nutrition Learning</Text>
                  <Text style={styles.certNameText}>{userData?.full_name}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.certificateCard, styles.mentalHealthCard]}
                onPress={() => handleGenerateCertificate('Mental Health Learning')}
              >
                <Image 
                  source={require('../../assets/genfiit-certif.png')} 
                  style={styles.certImage}
                />
                <View style={styles.certificateContent}>
                  <Text style={styles.certTitleText}>Mental Health Learning</Text>
                  <Text style={styles.certNameText}>{userData?.full_name}</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  certificatesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  certificateCard: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  nutritionCard: {
    backgroundColor: '#ffe0b2',
  },
  mentalHealthCard: {
    backgroundColor: '#b2ebf2',
  },
  certImage: {
    width: width - 32,
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  certificateContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  certTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  certNameText: {
    fontSize: 18,
    color: '#555',
    marginTop: 5,
  },
  noCertificates: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default CertificateScreen;
