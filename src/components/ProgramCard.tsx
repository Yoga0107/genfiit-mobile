import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProgramCardProps {
  title: string;
  completed: number;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ completed, title}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.programText}>{title}</Text>
      <Text style={styles.completed}>{completed}</Text>
      <Text style={styles.programText}>Program Selesai</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
    width: '45%', 
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  completed: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#009688',
  },
  programText: {
    fontSize: 16,
    color: '#666',
  },
  total: {
    fontSize: 14,
    color: '#444',
  },
});

export default ProgramCard;
