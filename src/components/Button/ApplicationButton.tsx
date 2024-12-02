import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

type CustomApplicationButtonProps = {
  title: string;
  description: string;
  icon: any;
  onPress: () => void;
  color: string; 
};

const ApplicationButton: React.FC<CustomApplicationButtonProps> = ({ title, description, icon, onPress, color }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color }]}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#18B2A0',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#6A6A71',
  },
});

export default ApplicationButton;
