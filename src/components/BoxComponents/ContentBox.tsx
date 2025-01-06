import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions, ViewStyle, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const BOX_SIZE = width * 0.4;

type ContentBoxProps = {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  completed: boolean;
};

const ContentBox: React.FC<ContentBoxProps> = ({ title, icon, onPress, style, completed }) => (
  <TouchableOpacity style={[styles.box, style]} onPress={onPress} disabled={completed}>
    {icon}
    <Text style={styles.boxText}>{title}</Text>
    {completed && (
      <View style={styles.finishedOverlay}>
        <Text style={styles.finishedText}>Completed</Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#f9f9f9',
    width: BOX_SIZE,
    height: BOX_SIZE + 60,
    margin: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: 'relative',
  },
  boxText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  finishedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    zIndex: 10,
  },
  finishedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ContentBox;
