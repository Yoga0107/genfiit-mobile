import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface HeaderComponentProps {
  title: string;
}

type RootStackParamList = {
  HomeScreen: undefined;
  [key: string]: undefined; // Allow for other routes
};

const HeaderComponent: React.FC<HeaderComponentProps> = ({ title }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleBack = () => {
    navigation.navigate('Home'); // Explicitly navigate to HomeScreen
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    backgroundColor: '#009688',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    elevation: 4,
    zIndex: 1,
    width: '100%',
    margin: 0,
  },
  backButton: {
    marginLeft: 10,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    flex: 1,
  },
});

export default HeaderComponent;
