import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import HTMLView from 'react-native-htmlview';
import { useRoute } from '@react-navigation/native';
import { getMaterialById } from '../utils/materialHelper';
import { parseQuestions, Question } from '../utils/questionHelper'; 

const GiziMaterialScreen = () => {
  const route = useRoute();
  const { id } = route.params as { id: string };

  const [material, setMaterial] = useState<any | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      setLoading(true);
      setError(null);

      try {
        const materialData = await getMaterialById(id);
        if (materialData) {
          setMaterial(materialData);
          const parsedQuestions = parseQuestions(materialData); 
          setQuestions(parsedQuestions);
        } else {
          console.error('No material data found');
        }
      } catch (error) {
        console.error('Error fetching material:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{material?.title}</Text>
      <HTMLView
        value={material?.description.replace(/<!--strapi-plugin-rich-text-output-->/g, '')}
        stylesheet={styles}
      />
      <Text style={styles.source}>Sumber: {material?.source || 'Unknown'}</Text>

      <Text style={styles.quizTitle}>Pertanyaan:</Text>
      {questions.length > 0 ? (
        questions.map((question) => (
          <View key={question.id} style={styles.questionContainer}>
            <Text style={styles.questionTitle}>{question.title}</Text>
            {question.options.map((option) => (
              <View key={option.id} style={styles.optionContainer}>
                <Text style={styles.optionText}>{option.title}</Text>
              </View>
            ))}
          </View>
        ))
      ) : (
        <Text>Tidak ada pertanyaan yang tersedia.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 10,
  },
  source: {
    fontStyle: 'italic',
    color: '#888',
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
  },
  quizTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
  },
  questionContainer: {
    marginVertical: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  questionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  optionContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  optionText: {
    fontSize: 16,
  },
});

export default GiziMaterialScreen;
