import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getMaterialById, getMaterialsBySegment, handlingDataMaterial } from '../helper/materialHelper';
import { fetchMaterials } from '../api/Material';



type LearningSessionScreenProps = {
  route: RouteProp<RootStackParamList, 'LearningSession'>;
  navigation: StackNavigationProp<RootStackParamList, 'LearningSession'>;
};

const segmentDataMap: Record<string, { id: string; title: string; materialId: string }[]> = {
  GIZI: [
    { id: '1', title: 'Segment 1', materialId: '1' },
    { id: '2', title: 'Segment 2', materialId: '2' },
  ],
  'MENTAL HEALTH': [
    { id: '1', title: 'Segment 1', materialId: '1' },
    { id: '2', title: 'Segment 2', materialId: '2' },
  ],
};

const LearningSessionScreen: React.FC<LearningSessionScreenProps> = ({ route, navigation }) => {
  const { topic } = route.params;
  const segmentsData = segmentDataMap[topic];
  const [completedSegments, setCompletedSegments] = useState<boolean[]>(new Array(segmentsData.length).fill(false));
  const [loading, setLoading] = useState(false);

  const handleSegmentPress = async (index: number) => {
    if (index === completedSegments.filter(Boolean).length) {
      const materialId = segmentsData[index].materialId;
      setLoading(true);

      try {
        const material = await getMaterialById(materialId);

        if (material) {
          setCompletedSegments((prev) => {
            const newCompletedSegments = [...prev];
            newCompletedSegments[index] = true;
            return newCompletedSegments;
          });

          if (topic === 'GIZI') {
            navigation.navigate('GiziMaterial', { id: materialId, material });
          } else if (topic === 'MENTAL HEALTH') {
            navigation.navigate('MentalHealthMaterial', { id: materialId, material });
          }
        } else {
          Alert.alert('Error', 'Material not found');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load material');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Complete the previous segment first!');
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
      >
        <Text style={styles.segmentText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Learning Segments - {topic}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={segmentsData}
          renderItem={renderSegment}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    flexGrow: 0,
  },
  segment: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#2196F3',
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
});

export default LearningSessionScreen;
