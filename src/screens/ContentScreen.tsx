import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useNavigation, NavigationProp, RouteProp, useRoute } from '@react-navigation/native';
import HeaderComponent from '../components/Header';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ContentBox from '../components/BoxComponents/ContentBox';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { getToken } from '../utils/handlingDataLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveMentalCompletion, saveGiziCompletion } from '../utils/handlingCompletation'; // Import the separate save functions

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

  useEffect(() => {
    const fetchMaterial = async () => {
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
    };

    fetchMaterial();
  }, [category]);

  useEffect(() => {
    const loadCompletedContent = async () => {
      const completed = new Set<string>();
      let mentalCompletedCount = 0;
      let giziCompletedCount = 0;

      // Loop through the content and check the completion status based on the selected category
      for (const item of content) {
        const isCompleted = await AsyncStorage.getItem(`contentCompleted_${item.uuid}`);
        if (isCompleted === 'true') {
          completed.add(item.uuid);

          // If the selected category is mentalmodule, only increment the mental count
          if (category === 'mentalmodule' && item.category?.slug === 'mentalmodule') {
            mentalCompletedCount += 1;
          }

          // If the selected category is gizimodule, only increment the gizi count
          if (category === 'gizimodule' && item.category?.slug === 'gizimodule') {
            giziCompletedCount += 1;
          }
        }
      }

      setCompletedContent(completed);
      
      // Set the state for mental and gizi completions
      setMentalCompleted(mentalCompletedCount);
      setGiziCompleted(giziCompletedCount);

      // Save the mental and gizi completion data using separate functions
      if (category === 'mentalmodule') {
        await saveMentalCompletion(mentalCompletedCount); 
      }

      if (category === 'gizimodule') {
        await saveGiziCompletion(giziCompletedCount);
      }

      // Log the number of completed items for the selected category
      console.log(`Mental completed: ${mentalCompletedCount}`);
      console.log(`Gizi completed: ${giziCompletedCount}`);
    };

    loadCompletedContent();
  }, [content, category]);

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
