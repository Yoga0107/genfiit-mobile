import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface UserCardProps {
  name: string;
  height: number;
  weight: number;
  status: string;
}

const UserCard: React.FC<UserCardProps> = ({ name, height, weight, status }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.greeting}>Halo,</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.details}>Tinggi (Cm): {height}</Text>
      <Text style={styles.details}>Berat (Kg): {weight}</Text>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#444',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#009688', 
  },
  details: {
    fontSize: 16,
    color: '#444',
    marginVertical: 4,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50', 
    marginTop: 10,
  },
});

export default UserCard;
