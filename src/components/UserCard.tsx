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
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '98%', 
    maxWidth: 450, 
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 8,
    borderRadius: 30,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20,
    alignSelf: 'center', 
  },
  greetingContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start', 
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#1b1b1b',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#18b2a0',
  },
  exclamation: {
    fontSize: 32,
    color: '#1b1b1b',
    marginLeft: 5, 
  },
  infoContainer: {
    width: '100%',
    paddingVertical: 3,
    borderTopWidth: 1,
    borderTopColor: '#00b4ac',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginRight: 30, // Menambahkan jarak antara label dan value
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00b4ac',
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  statusLabel: {
    fontSize: 16,
    color: '#1b1b1b',
    textAlign: 'center', 
  },
  statusValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#18b2a0',
    textAlign: 'center', 
  },
});

export default UserCard;
