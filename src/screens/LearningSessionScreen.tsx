import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

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

  const handleSegmentPress = (index: number) => {
    if (index === completedSegments.filter(Boolean).length) {
      setCompletedSegments((prev) => {
        const newCompletedSegments = [...prev];
        newCompletedSegments[index] = true;
        return newCompletedSegments;
      });

      const materialId = segmentsData[index].materialId;

      if (topic === 'GIZI') {
        navigation.navigate('GiziMaterial', { id: materialId });
      } else if (topic === 'MENTAL HEALTH') {
        navigation.navigate('MentalHealthMaterial', { id: materialId });
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
        disabled={!isActive}
      >
        <Text style={styles.segmentText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Learning Segments - {topic}</Text>
      <FlatList
        data={segmentsData}
        renderItem={renderSegment}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
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
