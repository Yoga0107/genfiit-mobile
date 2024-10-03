import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ProgramCard from '../components/ProgramCard';
import UserCard from '../components/UserCard';
import ResponsiveContainer from '../components/ResponsiveContainer';

const HomeScreen: React.FC = () => {
  const [hasPreTest, setHasPreTest] = useState(false); 

  const handleTelehealthPress = () => {
    console.log("Telehealth button pressed");
  };

  return (
    <ResponsiveContainer>
      <View style={styles.centerContainer}>
        <UserCard 
          name="Abdul123" 
          height={171} 
          weight={64} 
          status="Ideal" 
        />
      </View>

      <TouchableOpacity style={styles.telehealthContainer} onPress={handleTelehealthPress}>
        <Text style={styles.telehealthTitle}>Telehealth</Text>
        <Text style={styles.telehealthDescription}>Konsultasi dengan tenaga kesehatan disini!</Text>
      </TouchableOpacity>

      <View style={styles.programContainer}>
        <View style={styles.cardContainer}>
          <ProgramCard completed={0} total={10} />
          <ProgramCard completed={5} total={10} />
          <ProgramCard completed={3} total={10} />
          <ProgramCard completed={8} total={10} />
        </View>

        {!hasPreTest && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Anda belum melakukan pre-test</Text>
          </View>
        )}
      </View>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    alignItems: 'center', 
    marginBottom: 20, 
  },
  telehealthContainer: {
    backgroundColor: '#e0f7fa',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  telehealthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#009688',
    marginBottom: 5,
  },
  telehealthDescription: {
    fontSize: 16,
    color: '#444',
  },
  programContainer: {
    position: 'relative',
    width: '100%',
    marginTop: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderRadius: 10,
  },
  overlayText: {
    fontSize: 18,
    color: '#009688',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
