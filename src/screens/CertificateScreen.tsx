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
import * as Print from 'expo-print';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';

const { width } = Dimensions.get('window');



const CertificateScreen: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [completionStatus, setCompletionStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const certificateRef = React.useRef(null);

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
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
    fetchCompletionStatus();
    fetchUserData();
  }, []);

  const generateCertificateImage = async (name: string, module: string) => {
    try {
      const templateUrl =
        'https://api-genfiit.yanginibeda.web.id/uploads/Certificate_Genfiit_png_71b5eaffa3.png';

      const html = `
        <html>
          <body style="display: flex; justify-content: center; align-items: center; height: 100%; margin: 0;">
            <div style="position: relative; text-align: center; font-family: Arial;">
              <img src="${templateUrl}" style="width: 100%; max-width: 600px; height: auto;"/>
              <p style="position: absolute; top: 45%; left: 50%; transform: translateX(-50%); color: #000; font-size: 24px;"><strong>${name}</strong></p>
              <p style="position: absolute; top: 57%; left: 50%; transform: translateX(-50%); color: #000; font-size: 12px; text-align: center; width: 80%; line-height: 1.5;">
  Successfully completed the <strong>* "${module}" *</strong> Module.<br />
  Your commitment to learning and professional growth reflects a deep<br />
  passion for improving lives and promoting holistic health.
</p>
            </div>
          </body>
        </html>
      `;
      // <p style="position: absolute; top: 47%; left: 50%; transform: translateX(-50%); color: #000; font-size: 18px;">Completing the module: <strong>${module}</strong></p>
      // <p style="position: absolute; top: 60%; left: 50%; transform: translateX(-50%); color: #000; font-size: 11px;">Date: ${new Date().toLocaleDateString()}</p>

      const { uri } = await Print.printToFileAsync({ html });
      const fileUri = FileSystem.documentDirectory + `certificate_${name}_${module}.pdf`;

      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri);
        Alert.alert('Certificate Shared', 'The certificate is ready. You can share it now.');
      } else {
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
                  source={{
                    uri: 'https://api-genfiit.yanginibeda.web.id/uploads/Certificate_Genfiit_png_71b5eaffa3.png',
                  }}
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
                  source={{
                    uri: 'https://api-genfiit.yanginibeda.web.id/uploads/Certificate_Genfiit_png_71b5eaffa3.png',
                  }}
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
