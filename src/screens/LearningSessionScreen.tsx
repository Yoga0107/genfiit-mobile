import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Dimensions, Image } from 'react-native';
import { getMaterialData } from '../api/materialApi';
import { getToken } from '../utils/handlingDataLogin';
import { getID } from '../utils/handlingDataRegister';
import HeaderComponent from '../components/Header';
import ButtonComponent from '../components/Button/ButtonComponent';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import ResponsiveContainer from '../components/ResponsiveContainer';

type RootStackParamList = {
  LearningSession: undefined;
  PilihKategoriModul: undefined;
};

type LearningSessionNavigationProp = NavigationProp<RootStackParamList, 'LearningSession'>;

const { width } = Dimensions.get('window');

const LearningSessionScreen: React.FC = () => {
  const navigation = useNavigation<LearningSessionNavigationProp>();
  const [selectedTopic, setSelectedTopic] = useState<'Mental' | 'Gizi' | null>(null);
  const [material, setMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);
  const [selectedSegment, setSelectedSegment] = useState(0);
  const [completedSegments, setCompletedSegments] = useState<boolean[]>([]);

  useEffect(() => {
    if (selectedTopic) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const token = await getToken();
          if (!token) return;
          const categorySlug = selectedTopic === 'Mental' ? 'mentalmodule' : 'gizimodule';
          const data = await getMaterialData(token, categorySlug);
          setMaterial(data);
          setCompletedSegments(new Array(data.data.length).fill(false));
          setLoading(false);
        } catch {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [selectedTopic]);

  const handleAnswerSelection = (questionId: string, answerId: string) => {
    setAnswers((prev) => {
      const updatedAnswers = [...prev];
      const existingIndex = updatedAnswers.findIndex((a) => a.questionId === questionId);
      if (existingIndex !== -1) {
        updatedAnswers[existingIndex] = { questionId, answerId, status: true };
      } else {
        updatedAnswers.push({ questionId, answerId, status: true });
      }

      const allAnswered = currentSegment.questions.every((q: any) =>
        updatedAnswers.some((a) => a.questionId === q.id && a.status)
      );
      setIsButtonActive(allAnswered);

      return updatedAnswers;
    });
  };

  const submitAnswers = async () => {
    try {
      const token = await getToken();
      const userID = await getID();
      const materialUUID = material?.data[selectedSegment]?.uuid;
      const materialSlug = material?.data[selectedSegment]?.slug;

      const formattedAnswers = answers.map((answer) => {
        const question = material?.data[selectedSegment]?.questions.find(
          (q: any) => q.id === answer.questionId
        );

        if (question && question.item) {
          const answerItem = question.item.find((item: any) => item.id === answer.answerId);
          if (answerItem) {
            return {
              id: answer.answerId,
              title: answerItem.title,
              status: answer.status,
            };
          }
        }

        return { id: answer.answerId, title: 'Unknown Answer', status: answer.status };
      });

      await fetch('https://api-genfiit.yanginibeda.web.id/api/reports', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            users_permissions_user: userID,
            material_uuid: materialUUID,
            material_slug: materialSlug,
            answer: formattedAnswers,
          },
        }),
      });

      const nextSegment = selectedSegment + 1;
      if (nextSegment < material?.data.length) {
        setSelectedSegment(nextSegment);
      } else {
        setSelectedTopic(null);
        setMaterial(null);
        setAnswers([]);
        setIsButtonActive(false);
        setCompletedSegments(new Array(material?.data.length).fill(false));
        alert('You have completed all content!');
        navigation.navigate('PilihKategoriModul');
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Failed to submit answers. Please try again.');
    }
  };

  const getDescriptionText = (description: any[]) =>
    description
      .map((p) => p.children.map((c: { text: string }) => c.text).join(' '))
      .join('\n\n');

  if (loading) return <Text>Loading...</Text>;

  if (!selectedTopic) {
    return (
      <ResponsiveContainer>
        <View style={styles.container}>
          <HeaderComponent title="Pilih Kategori Modul" />
          <ScrollView contentContainerStyle={styles.scrollView}>
            <TouchableOpacity style={styles.card} onPress={() => setSelectedTopic('Mental')}>
              <Image
                source={require('../../assets/mental-logo.png')}
                style={[styles.logo, { width: width * 0.6, height: width * 0.6 }]}
              />
              <Text style={styles.cardText}>Mental Health</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={() => setSelectedTopic('Gizi')}>
              <Image
                source={require('../../assets/gizi-logo.png')}
                style={[styles.logo, { width: width * 0.6, height: width * 0.6 }]}
              />
              <Text style={styles.cardText}>Nutrition</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ResponsiveContainer>
    );
  }

  if (!material || material.data.length === 0) return <Text>No material found for {selectedTopic}.</Text>;

  const currentSegment = material.data[selectedSegment];
  const segmentTitlePrefix = selectedTopic === 'Mental' ? 'Mental Health' : 'Nutrition';
  const segmentTitle = `${segmentTitlePrefix} - Konten ${selectedSegment + 1}`;

  return (
    <ResponsiveContainer>
      <View style={styles.container}>
        <HeaderComponent title={segmentTitle} />
        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* Conditionally render the image for Mental Health topic content */}
          {selectedTopic === 'Mental' && selectedSegment === 0 && (
            <Image
              source={require('../../assets/mental1.png')}
              style={styles.moduleImage}
            />
          )}
          {selectedTopic === 'Mental' && selectedSegment === 1 && (
            <Image
              source={require('../../assets/mental2.png')}
              style={styles.moduleImage}
            />
          )}

          {/* Conditionally render the image for Gizi topic content */}
          {selectedTopic === 'Gizi' && selectedSegment === 0 && (
            <Image
              source={require('../../assets/gizimodul1.png')}
              style={styles.moduleImage}
            />
          )}
          {selectedTopic === 'Gizi' && selectedSegment === 1 && (
            <Image
              source={require('../../assets/gizimodul2.png')}
              style={styles.moduleImage}
            />
          )}

          <View style={styles.card}>
            <Text style={[styles.header, styles.textLeft]}>{currentSegment.title || 'Title not available'}</Text>
            <Text style={[styles.descriptionText, styles.textLeft]}>
              {getDescriptionText(currentSegment.description) || 'Description not available'}
            </Text>

            <FlatList
              data={currentSegment.questions.slice(0, 2)}
              keyExtractor={(q) => q.id.toString()}
              renderItem={({ item: question }) => (
                <View style={styles.questionContainer}>
                  <Text style={[styles.questionTitle, styles.textLeft]}>{question.title}</Text>
                  {question.item.map((answer: any) => (
                    <TouchableOpacity
                      key={answer.id}
                      style={[
                        styles.answerButton,
                        answers.some((a) => a.questionId === question.id && a.answerId === answer.id) &&
                          styles.selectedAnswer,
                      ]}
                      onPress={() => handleAnswerSelection(question.id, answer.id)}>
                      <View style={styles.dotContainer}>
                        <View
                          style={[
                            styles.dot,
                            answers.some((a) => a.questionId === question.id && a.answerId === answer.id) &&
                              styles.filledDot,
                          ]}
                        />
                        <Text style={styles.answerText}>{answer.title}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />

            <ButtonComponent title="Submit Answer" onPress={submitAnswers} disabled={!isButtonActive} />
          </View>
        </ScrollView>
      </View>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  textLeft: {
    textAlign: 'left',
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    width: width - 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  logo: {
    marginBottom: 10,
    resizeMode: 'contain',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    paddingBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 10,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  answerButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f4f4f4',
    marginVertical: 8,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  selectedAnswer: {
    backgroundColor: '#18B2A0',
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  filledDot: {
    backgroundColor: '#18B2A0',
  },
  answerText: {
    fontSize: 16,
    color: '#333',
  },
  moduleImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 15,
  },
});

export default LearningSessionScreen;
