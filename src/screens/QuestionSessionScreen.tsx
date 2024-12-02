import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type QuestionSessionScreenProps = {
  route: RouteProp<RootStackParamList, 'QuestionSession'>;
};

const QuestionSessionScreen: React.FC<QuestionSessionScreenProps> = ({ route }) => {
  const { topic } = route.params;

  const sessions = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    name: `Session ${index + 1}`,
  }));

  const renderItem = ({ item }: { item: { id: number; name: string } }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{`Topic: ${topic}`}</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  card: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
});

export default QuestionSessionScreen;
