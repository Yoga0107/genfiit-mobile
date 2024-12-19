import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Dimensions, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HeaderComponent from '../components/Header';  
import { getCompletionStatus } from '../utils/handlingDataLogin';  
import { getUserDetails } from '../api/User';  
import ResponsiveContainer from '../components/ResponsiveContainer';
import Canvas from 'react-native-canvas';  
import * as FileSystem from 'expo-file-system';  
import * as MediaLibrary from 'expo-media-library';  

const { width } = Dimensions.get('window');

const CertificateScreen: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [completionStatus, setCompletionStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const canvasRef = useRef<Canvas | null>(null);  

  
  const fetchCompletionStatus = async () => {
    const status = await getCompletionStatus();
    setCompletionStatus(status);  
  };

  
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const data = await getUserDetails();
      setUserData(data?.user_detail?.information);
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Gagal mengambil data pengguna");
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

  const generateCertificateImage = (name: string, module: string) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
  
      
      canvas.width = 900;
      canvas.height = 650;
  
      
      context.fillStyle = '#00b4ac';  
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      
      context.lineWidth = 10;
      context.strokeStyle = '#ffffff';  
      context.shadowColor = '#000000'; 
      context.shadowBlur = 20;
      context.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
      context.shadowBlur = 0;  
  
      
      context.font = 'bold 55px "Arial"';
      context.fillStyle = '#ffffff'; 
      context.textAlign = 'center';
      context.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 100);
  
      
      context.font = 'italic 35px "Arial"';
      context.fillStyle = '#ffffff'; 
      context.fillText(`Presented to: ${name}`, canvas.width / 2, 220);
  
      
      context.font = 'bold 30px "Arial"';
      context.fillStyle = '#ffffff'; 
      context.fillText(`For Completing the Module:`, canvas.width / 2, 300);
      context.font = 'bold 32px "Arial"';
      context.fillText(module, canvas.width / 2, 350);
  
      
      const date = new Date();
      context.font = 'italic 22px "Arial"';
      context.fillStyle = '#ffffff';
      context.fillText(`Date: ${date.toLocaleDateString()}`, canvas.width / 2, 420);
  
      
      context.beginPath();
      context.arc(canvas.width / 2, canvas.height - 150, 60, 0, Math.PI * 2); 
      context.fillStyle = '#ffd700';  
      context.fill(); 
      context.closePath();
  
      context.fillStyle = '#ffffff';  
      context.font = 'bold 30px Arial';
      context.fillText('🏆', canvas.width / 2 - 15, canvas.height - 145);  
  
      
      canvas.toDataURL().then(async (dataUrl) => {
        try {
          const path = FileSystem.documentDirectory + `sertifikat_${name}_${module}.png`;
  
          
          await FileSystem.writeAsStringAsync(path, dataUrl.replace('data:image/png;base64,', ''), {
            encoding: FileSystem.EncodingType.Base64,
          });
  
          Alert.alert("Certificate Saved", `Your certificate has been saved to ${path}`);
  
          
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status === 'granted') {
            const asset = await MediaLibrary.createAssetAsync(path);
            await MediaLibrary.createAlbumAsync('Certifications', asset, false); 
            Alert.alert("Saved to Gallery", "Certificate has been saved to your gallery.");
          } else {
            Alert.alert("Permission Denied", "Unable to save to gallery.");
          }
        } catch (error) {
          console.error("Error saving certificate:", error);
          Alert.alert("Error", "Failed to save certificate.");
        }
      });
    }
  };

  const handleGenerateCertificate = (module: string) => {
    if (userData) {
      generateCertificateImage(userData?.full_name, module);
    } else {
      Alert.alert("Error", "Data pengguna tidak ditemukan");
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
        {/* Header */}
        <HeaderComponent title="Sertifikat" />

        <View style={styles.contentContainer}>
          {completionStatus === false ? (
            <Text style={styles.noCertificates}>Anda belum memiliki sertifikat.</Text>
          ) : (
            <>
              <Text style={styles.certificatesTitle}>Sertifikat Anda:</Text>

              {/* Sertifikat 1 */}
              <TouchableOpacity
                style={[styles.certificateCard, styles.nutritionCard]}
                onPress={() => handleGenerateCertificate("Nutrition Learning")}
              >
                <View style={styles.certificateContent}>
                  <MaterialCommunityIcons name="food-apple" size={100} color="#ff7043" />
                  <Text style={styles.certTitleText}>Nutrition Learning</Text>
                  <Text style={styles.certNameText}>{userData?.full_name}</Text>
                </View>
              </TouchableOpacity>

              {/* Sertifikat 2 */}
              <TouchableOpacity
                style={[styles.certificateCard, styles.mentalHealthCard]}
                onPress={() => handleGenerateCertificate("Mental Health Learning")}
              >
                <View style={styles.certificateContent}>
                  <MaterialCommunityIcons name="heart-pulse" size={100} color="#00b4ac" />
                  <Text style={styles.certTitleText}>Mental Health Learning</Text>
                  <Text style={styles.certNameText}>{userData?.full_name}</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>


        <Canvas ref={canvasRef} style={{ display: 'none' }} />
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  certificateCard: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  nutritionCard: {
    backgroundColor: '#ffe0b2',
  },
  mentalHealthCard: {
    backgroundColor: '#b2ebf2',
  },
  certificateContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  certTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  certNameText: {
    fontSize: 16,
    color: '#333',
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
