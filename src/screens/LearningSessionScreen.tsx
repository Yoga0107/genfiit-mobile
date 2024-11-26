import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getMaterialById } from '../helper/materialHelper'; // Make sure the helper is correctly imported
import HeaderComponent from '../components/Header';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { getToken } from '../utils/handlingDataLogin';

const { width, height } = Dimensions.get('window');

type LearningSessionScreenProps = {
  route: RouteProp<RootStackParamList, 'LearningSession'>;
  navigation: StackNavigationProp<RootStackParamList, 'LearningSession'>;
};

const segmentDataMap: Record<string, { id: string; title: string; materialId: string }[]> = {
  GIZI: [
    { id: '3', title: 'Pengenalan Pedoman', materialId: '1' },
    { id: '4', title: 'Module 2', materialId: '2' },
    { id: '5', title: 'Module 3', materialId: '3' },
  ],
  'MENTAL HEALTH': [
    { id: '3', title: 'Module 1', materialId: '1' },
    { id: '4', title: 'Module 2', materialId: '2' },
    { id: '5', title: 'Module 3', materialId: '3' },
  ],
};

const LearningSessionScreen: React.FC<LearningSessionScreenProps> = ({ route, navigation }) => {
  const { topic } = route.params;
  const segmentsData = segmentDataMap[topic];
  const [completedSegments, setCompletedSegments] = useState<boolean[]>(new Array(segmentsData.length).fill(false));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [materialContent, setMaterialContent] = useState<any>(null); // Store material content
  const [questions, setQuestions] = useState<any[]>([]); // Store multiple-choice questions
  
  const handleSegmentPress = async (index: number) => {
    if (index === completedSegments.filter(Boolean).length) {
      const materialSlug = topic === 'GIZI' ? 'gizimodule' : 'mentalhealthmodule';
      
      // Ensure materialSlug is always a string (fallback to an empty string or a default string)
      if (!materialSlug) {
        console.error('Material slug is invalid!');
        return;
      }
  
      console.log(`Fetching material for slug: ${materialSlug}`);
      setLoading(true);
  
      try {
        const token:any = await getToken();
        const material = await getMaterialById(materialSlug, token);
  
        if (material && material.title) {
          setCompletedSegments((prev) => {
            const newCompletedSegments = [...prev];
            newCompletedSegments[index] = true;
            return newCompletedSegments;
          });
          setMaterialContent(material); // Save material content
          
          if (material.questions) {
            setQuestions(material.questions); // Save questions if available
          }
        } else {
          throw new Error('Material not found or no title');
        }
      } catch (error) {
        setError(true);
        console.error('Error fetching material:', error);
        Alert.alert('Error', 'Failed to load material');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Complete the previous module first!');
    }
  };
  
  
  const renderSegment = ({ item, index }: { item: { id: string; title: string; materialId: string }; index: number }) => {
    const isActive = index === completedSegments.filter(Boolean).length;
    const isCompleted = completedSegments[index];

    return (
      <TouchableOpacity
        style={[styles.segment, isCompleted ? styles.completed : (isActive ? styles.active : styles.inactive)]}
        onPress={() => isActive && handleSegmentPress(index)}
        disabled={!isActive || loading}
        accessibilityLabel={`Segment ${item.title}`}
        accessibilityHint="Tap to start this module"
      >
        <Text style={styles.segmentText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  const handleRetry = () => {
    setError(false);
    setCompletedSegments(new Array(segmentsData.length).fill(false));
    setMaterialContent(null); // Reset material content
    setQuestions([]); // Reset questions
  };

  return (
    <ResponsiveContainer>
      <View style={styles.container}>
        <HeaderComponent title={`Learning Segments - ${topic}`} />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load material. Please try again.</Text>
            <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : materialContent ? (
          <View style={styles.materialContainer}>
            <Text style={styles.materialTitle}>{materialContent.title}</Text>
            <Text style={styles.materialText}>{materialContent.content}</Text>

            {/* Display multiple-choice questions */}
            {questions.length > 0 && (
              <View style={styles.questionsContainer}>
                <Text style={styles.questionsTitle}>Questions</Text>
                {questions.map((question, index) => (
                  <View key={index} style={styles.questionContainer}>
                    <Text style={styles.questionText}>{question.text}</Text>
                    {question.options.map((option: string, idx: number) => (
                      <TouchableOpacity key={idx} style={styles.optionButton}>
                        <Text style={styles.optionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : (
          <FlatList
            data={segmentsData}
            renderItem={renderSegment}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        )}

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${(completedSegments.filter(Boolean).length / segmentsData.length) * 100}%`}]} />
        </View>

        {/* Displaying progress */}
        <Text style={styles.progressText}>
          {completedSegments.filter(Boolean).length} / {segmentsData.length} Modules Completed
        </Text>

        {/* Motivation on Completion */}
        {completedSegments.filter(Boolean).length === segmentsData.length && (
          <Text style={styles.motivationText}>Great job! You've completed all the modules!</Text>
        )}
      </View>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    flexGrow: 0,
    marginBottom: height * 0.05,
    paddingHorizontal: 20,
  },
  segment: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.02,
    marginVertical: height * 0.02,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  active: {
    backgroundColor: '#1abc9c',
    borderColor: '#00b4ac',
    borderWidth: 1,
  },
  completed: {
    backgroundColor: '#4caf50',
    borderColor: '#00b4ac',
    borderWidth: 1,
  },
  inactive: {
    backgroundColor: '#ccc',
    borderColor: '#00b4ac',
    borderWidth: 1,
  },
  segmentText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },
  materialContainer: {
    marginTop: height * 0.05,
    padding: width * 0.04,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  materialTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
  },
  materialText: {
    fontSize: width * 0.04,
    color: '#555',
    marginTop: height * 0.02,
  },
  questionsContainer: {
    marginTop: height * 0.05,
  },
  questionsTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.02,
  },
  questionContainer: {
    marginBottom: height * 0.02,
  },
  questionText: {
    fontSize: width * 0.04,
    color: '#333',
    marginBottom: height * 0.01,
  },
  optionButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    backgroundColor: '#3498db',
    borderRadius: 8,
    marginBottom: height * 0.01,
  },
  optionText: {
    color: '#fff',
    fontSize: width * 0.035,
  },
  progressContainer: {
    width: '100%',
    height: height * 0.01,
    backgroundColor: '#ccc',
    borderRadius: 8,
    marginVertical: height * 0.02,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1abc9c',
    borderRadius: 8,
  },
  progressText: {
    textAlign: 'center',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
  },
  motivationText: {
    textAlign: 'center',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: height * 0.03,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.1,
  },
  errorText: {
    fontSize: width * 0.04,
    color: '#e74c3c',
    marginBottom: height * 0.02,
  },
  retryButton: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    backgroundColor: '#1abc9c',
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: width * 0.04,
    color: '#fff',
  },
});

export default LearningSessionScreen;
