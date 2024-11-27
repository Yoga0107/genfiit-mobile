import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { getToken } from '../utils/handlingDataLogin';
import { getMaterialById } from '../helper/materialHelper';

const segmentDataMap = {
  MENTAL: [
    { id: '1', title: 'Mental 1', materialSlug: 'mental1' },
    { id: '2', title: 'Mental 2', materialSlug: 'mental2' },
    { id: '3', title: 'Mental 3', materialSlug: 'mental3' },
    { id: '4', title: 'Mental 4', materialSlug: 'mental4' },
    { id: '5', title: 'Mental 5', materialSlug: 'mental5' },
    { id: '6', title: 'Mental 6', materialSlug: 'mental6' },
    { id: '7', title: 'Mental 7', materialSlug: 'mental7' },
    { id: '8', title: 'Mental 8', materialSlug: 'mental8' },
    { id: '9', title: 'Mental 9', materialSlug: 'mental9' },
    { id: '10', title: 'Mental 10', materialSlug: 'mental10' },
  ],
};

const StepByStepScreen = () => {
  const [segmentsData] = useState(segmentDataMap['MENTAL']);
  const [completedSegments, setCompletedSegments] = useState(Array(10).fill(false));
  const [loading, setLoading] = useState(false);
  const [materialContent, setMaterialContent] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [currentSegment, setCurrentSegment] = useState(null);
  const [isReadingCompleted, setIsReadingCompleted] = useState(false);

  const handleSegmentPress = async (index:any) => {
    if (index !== completedSegments.filter(Boolean).length) {
      Alert.alert('Kompletkan Modul Sebelumnya', 'Anda harus menyelesaikan modul sebelumnya terlebih dahulu.');
      return;
    }

    const materialSlug = segmentsData[index].materialSlug;
    setLoading(true);

    try {
      const token:any = await getToken();
      const material = await getMaterialById(materialSlug, token);

      if (!material || !material.content) {
        throw new Error('Material tidak ditemukan atau tidak memiliki konten.');
      }

      setMaterialContent(material.content);
      setQuestions(material.questions || null);
      setCurrentSegment(index);
      setIsReadingCompleted(false);
    } catch (error) {
      Alert.alert('Gagal Memuat', 'Terjadi masalah saat memuat modul.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReading = () => {
    setIsReadingCompleted(true);
  };

  const handleCompleteQuestions = () => {
    setCompletedSegments((prev) => {
      const updated = [...prev];
      if (currentSegment !== null) updated[currentSegment] = true;
      return updated;
    });
    setMaterialContent(null);
    setQuestions(null);
    setCurrentSegment(null);
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1abc9c" />
        </View>
      )}

      {!materialContent && (
        <>
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${(completedSegments.filter(Boolean).length / segmentsData.length) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {completedSegments.filter(Boolean).length} / {segmentsData.length} Modul Selesai
          </Text>
          {segmentsData.map((segment, index) => {
            const isActive = index === completedSegments.filter(Boolean).length;
            const isCompleted = completedSegments[index];
            return (
              <TouchableOpacity
                key={segment.id}
                style={[
                  styles.segment,
                  isCompleted ? styles.completed : isActive ? styles.active : styles.inactive,
                ]}
                onPress={() => handleSegmentPress(index)}
                disabled={!isActive || loading}
              >
                <Text style={styles.segmentText}>{segment.title}</Text>
              </TouchableOpacity>
            );
          })}
        </>
      )}

      {materialContent && (
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.materialText}>{materialContent}</Text>
          {!isReadingCompleted ? (
            <TouchableOpacity style={styles.completeButton} onPress={handleCompleteReading}>
              <Text style={styles.buttonText}>Saya Sudah Membaca</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.completeButton} onPress={handleCompleteQuestions}>
              <Text style={styles.buttonText}>Selesaikan Pilihan Ganda</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginVertical: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1abc9c',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  segment: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  active: {
    backgroundColor: '#1abc9c',
  },
  completed: {
    backgroundColor: '#4caf50',
  },
  inactive: {
    backgroundColor: '#ccc',
  },
  segmentText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  materialText: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  completeButton: {
    backgroundColor: '#1abc9c',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default StepByStepScreen;
