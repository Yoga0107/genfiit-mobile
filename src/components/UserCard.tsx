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
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>Halo,</Text>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.exclamation}>!</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Tinggi</Text>
          <Text style={styles.value}>{height} Cm</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Berat</Text>
          <Text style={styles.value}>{weight} Kg</Text>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status Gizi</Text>
        <Text style={styles.statusValue}>{status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '98%', 
    maxWidth: 450, 
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20,
    alignSelf: 'center', 
    borderWidth: 2,
    borderColor: '#18b2a0',
  },
  greetingContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start', 
    marginBottom: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18, 
    color: '#1b1b1b',
    fontWeight: '400',
  },
  name: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#18b2a0',
  },
  exclamation: {
    fontSize: 36,
    color: '#1b1b1b',
    marginLeft: 5, 
  },
  infoContainer: {
    width: '100%',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#00b4ac',
    marginBottom: 10,
    flexDirection: 'row', // Ensures both sections are in a row
    justifyContent: 'space-between', // Adds space between the two sections
  },
  infoRow: {
    flexDirection: 'row', // Puts label and value side by side
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: '#000',
    marginRight: 5, // Smaller gap between label and value
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#18b2a0',
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  statusLabel: {
    fontSize: 18,
    color: '#1b1b1b',
    textAlign: 'center', 
  },
  statusValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#18b2a0',
    textAlign: 'center', 
  },
});

export default UserCard;
