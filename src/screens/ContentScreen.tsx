import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useNavigation, NavigationProp, RouteProp, useRoute, useFocusEffect } from '@react-navigation/native';
import HeaderComponent from '../components/Header';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ContentBox from '../components/BoxComponents/ContentBox';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { getToken } from '../utils/handlingDataLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveMentalCompletion, saveGiziCompletion } from '../utils/handlingCompletation';

type RootStackParamList = {
  ContentScreen: { category: string };
  ContentDetail: { id: string };
};

type ContentScreenNavigationProp = NavigationProp<RootStackParamList, 'ContentScreen'>;
type ContentScreenRouteProp = RouteProp<RootStackParamList, 'ContentScreen'>;

const ContentScreen: React.FC = () => {
  const navigation = useNavigation<ContentScreenNavigationProp>();
  const route = useRoute<ContentScreenRouteProp>();
  const { category } = route.params;

  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [completedContent, setCompletedContent] = useState<Set<string>>(new Set());
  const [mentalCompleted, setMentalCompleted] = useState<number>(0);
  const [giziCompleted, setGiziCompleted] = useState<number>(0);

  const getIconForCategory = (category: string) => {
    if (category === 'mentalmodule') {
      return <FontAwesome5 name="brain" size={64} color="#8E44AD" />;
    }
    if (category === 'gizimodule') {
      return <MaterialIcons name="restaurant" size={64} color="#FF7043" />;
    }
    return <MaterialIcons name="help-outline" size={64} color="gray" />;
  };

  const fetchMaterial = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (token) {
        const url = `https://api-genfiit.yanginibeda.web.id/api/materials?populate=category&populate=questions.item&filters[category][slug][$eq]=${category}`;
        const response = await fetch(url, {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data && data.data) {
          setContent(data.data);
        } else {
          setContent([]);
        }
      }
    } catch (error) {
      console.error('Error fetching material:', error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  const loadCompletedContent = useCallback(async () => {
    const completed = new Set<string>();
    let mentalCompletedCount = 0;
    let giziCompletedCount = 0;

    for (const item of content) {
      const isCompleted = await AsyncStorage.getItem(`contentCompleted_${item.uuid}`);
      if (isCompleted === 'true') {
        completed.add(item.uuid);

        if (category === 'mentalmodule' && item.category?.slug === 'mentalmodule') {
          mentalCompletedCount += 1;
        }

        if (category === 'gizimodule' && item.category?.slug === 'gizimodule') {
          giziCompletedCount += 1;
        }
      }
    }

    setCompletedContent(completed);
    setMentalCompleted(mentalCompletedCount);
    setGiziCompleted(giziCompletedCount);

    if (category === 'mentalmodule') {
      await saveMentalCompletion(mentalCompletedCount);
    }

    if (category === 'gizimodule') {
      await saveGiziCompletion(giziCompletedCount);
    }

    console.log(`Mental completed: ${mentalCompletedCount}`);
    console.log(`Gizi completed: ${giziCompletedCount}`);
  }, [content, category]);

  useFocusEffect(
    useCallback(() => {
      fetchMaterial();
    }, [fetchMaterial])
  );

  useEffect(() => {
    loadCompletedContent();
  }, [content, loadCompletedContent]);

  const navigateToContentDetail = (contentId: string) => {
    navigation.navigate('ContentDetail', { id: contentId });
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <ResponsiveContainer>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <HeaderComponent title="Content List" />
          <View style={styles.boxContainer}>
            {content.map((item) => (
              <View key={item.id} style={styles.contentBoxContainer}>
                <ContentBox
                  title={item.title}
                  icon={getIconForCategory(category)}
                  onPress={() => navigateToContentDetail(item.id)}
                  completed={completedContent.has(item.uuid)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  boxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  contentBoxContainer: {
    position: 'relative',
    marginBottom: 20,
  },
});

export default ContentScreen;
