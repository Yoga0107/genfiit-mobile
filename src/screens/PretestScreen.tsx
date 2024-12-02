import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { getMaterialData } from '../api/materialApi'; // Ensure correct import
import { getToken } from '../utils/handlingDataLogin';
import { getID } from '../utils/handlingDataRegister';
import HeaderComponent from '../components/Header';
import ButtonComponent from '../components/Button/ButtonComponent';
import { NavigationProp, useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  Pretest: undefined;
};

type PretestNavigationProp = NavigationProp<RootStackParamList, 'Pretest'>;

const PretestScreen: React.FC = () => {
  const navigation = useNavigation<PretestNavigationProp>();
  const [material, setMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          setLoading(false);
          return;
        }
  
        const data = await getMaterialData(token, 'pretest');
        console.log('Fetched pretest data:', data); // Inspect the structure here
        setMaterial(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching pretest data:', error);
      }
    };
    fetchData();
  }, []);
  

  const handleAnswerSelection = (questionId: string, answerId: string) => {
    setAnswers((prev) => {
      const updatedAnswers = [...prev];
      const existingIndex = updatedAnswers.findIndex((a) => a.questionId === questionId);
      if (existingIndex !== -1) {
        updatedAnswers[existingIndex] = { questionId, answerId, status: true };
      } else {
        updatedAnswers.push({ questionId, answerId, status: true });
      }
      const allAnswered = updatedAnswers.length === (material?.data?.length || 0);
      setIsButtonActive(allAnswered);
      return updatedAnswers;
    });
  };

  const submitAnswers = async () => {
    try {
      const token = await getToken();
      const userID = await getID();

      const formattedAnswers = answers.map((answer) => ({
        id: answer.answerId,
        title: material?.data?.find((q: any) => q.id === answer.questionId)?.item.find(
          (item: any) => item.id === answer.answerId
        ).title,
        status: answer.status,
      }));

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
            material_uuid: material?.data?.uuid,
            material_slug: 'pretest', 
            answer: formattedAnswers,
          },
        }),
      });

      alert('Your answers have been submitted!');
      console.log(); 
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Failed to submit answers. Please try again.');
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (!material || !Array.isArray(material.data) || material.data.length === 0) {
    return <Text>No pretest data available.</Text>;
  }

  return (
    <View style={styles.container}>
      <HeaderComponent title="Pretest" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.header}>Pretest Questions</Text>
          <FlatList
            data={material.data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: question }) => (
              <View style={styles.questionContainer}>
                <Text style={styles.questionTitle}>{question.title}</Text>
                {question.item && Array.isArray(question.item) && question.item.map((answer: any) => (
                  <TouchableOpacity
                    key={answer.id}
                    style={[
                      styles.answerButton,
                      answers.some((a) => a.questionId === question.id && a.answerId === answer.id) && styles.selectedAnswer,
                    ]}
                    onPress={() => handleAnswerSelection(question.id, answer.id)}>
                    <Text style={styles.answerText}>{answer.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
          <ButtonComponent title="Submit Answers" onPress={submitAnswers} disabled={!isButtonActive} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  scrollView: {
    paddingTop: 60,
    width: '100%',
  },
  card: {
    backgroundColor: '#f4f4f4',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questionContainer: {
    marginBottom: 15,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  answerButton: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  selectedAnswer: {
    backgroundColor: '#18B2A0',
  },
  answerText: {
    fontSize: 14,
  },
});

export default PretestScreen;
