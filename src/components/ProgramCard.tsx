import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgramCardProps {
  title: string;
  completed: number;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ completed, title }) => {
  return (
    <LinearGradient
      colors={['#4CAF50', '#2196F3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.programText}>{title}</Text>
      <Text style={styles.completed}>{completed}</Text>
      <Text style={styles.programText}>Finished Program</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    padding: 20,
    width: '45%',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  completed: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF', // White for contrast on gradient
    marginVertical: 8,
  },
  programText: {
    fontSize: 16,
    color: '#FFFFFF', // White for readability
    textAlign: 'center',
  },
});

export default ProgramCard;
