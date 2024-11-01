import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getMaterialById } from '../api/Material';
import { handlingDataMaterial } from '../utils/materialHelper';

const MentalMaterialScreen = () => {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const [materials, setMaterials] = useState<{ id: string; title: string; content: string; }[]>([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const materialData = await getMaterialById(id);
        const formattedMaterial = handlingDataMaterial(materialData);
        setMaterials(formattedMaterial);
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

    fetchMaterials();
  }, [id]);

  const renderMaterial = ({ item }: { item: { id: string; title: string; content: string; }; }) => (
    <View style={styles.materialContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <FlatList
      data={materials}
      renderItem={renderMaterial}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  materialContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default MentalMaterialScreen;
