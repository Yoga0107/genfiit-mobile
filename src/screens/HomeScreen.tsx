import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import ProgramCard from '../components/ProgramCard';
import UserCard from '../components/UserCard';
import ResponsiveContainer from '../components/ResponsiveContainer'; 

const HomeScreen: React.FC = () => {
  const handleTelehealthPress = () => {

    console.log("Telehealth button pressed");
  };

  return (
    <ResponsiveContainer>
      <UserCard 
        name="Abdul123" 
        height={171} 
        weight={64} 
        status="Ideal" 
      />

      {/* Telehealth CTA */}
      <TouchableOpacity style={styles.telehealthContainer} onPress={handleTelehealthPress}>
        <Text style={styles.telehealthTitle}>Telehealth</Text>
        <Text style={styles.telehealthDescription}>Konsultasi dengan tenaga kesehatan disini!</Text>
      </TouchableOpacity>

      <View style={styles.programContainer}>
        <ProgramCard completed={0} total={10} />
        <ProgramCard completed={5} total={10} />
        <ProgramCard completed={3} total={10} />
        <ProgramCard completed={8} total={10} />
      </View>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  vectorImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    resizeMode: 'cover',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
    marginTop: 20,
  },
});

export default HomeScreen;