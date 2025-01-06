import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { getToken } from '../utils/handlingDataLogin';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { getID } from '../utils/handlingDataRegister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    ContentDetail: { id: string };
    LearningSession: undefined;
};

type ContentDetailRouteProp = RouteProp<RootStackParamList, 'ContentDetail'>;

interface ReportPayload {
    data: {
        users_permissions_user: string;
        material_uuid: string;
        material_slug: string;
        answer: Array<{ id: string; title: string; status: boolean }>;
        category: string;
        is_complete: boolean;
    };
}

const ContentDetailScreen: React.FC = () => {
    const route = useRoute<ContentDetailRouteProp>();
    const { id } = route.params;
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [content, setContent] = useState<any | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchContentDetails = async () => {
            try {
                const token = await getToken();
                if (token) {
                    const response = await fetch(`https://api-genfiit.yanginibeda.web.id/api/materials/${id}?populate=questions.item,media`, {
                        headers: {
                            'accept': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    setContent(data.data);
                }
            } catch (error) {
                console.error('Error fetching content details:', error);
            }
        };

        fetchContentDetails();
    }, [id]);

    const handleSelectAnswer = (questionId: number, itemId: number) => {
        setSelectedAnswers((prevState) => ({
            ...prevState,
            [questionId]: itemId,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const userId = await getID();

            if (!token || !userId) {
                console.log('User is not authenticated.');
                setLoading(false);
                return;
            }

            const userIdString = userId.toString();

            const answers = Object.keys(selectedAnswers).map((questionId) => {
                const selectedItemId = selectedAnswers[questionId];
                const question = content?.questions?.find((q: any) => q.id.toString() === questionId);

                if (!question) {
                    console.error(`Question with id ${questionId} not found`);
                    return null;
                }

                const selectedItem = question?.item?.find((item: any) => item.id === selectedItemId);

                if (selectedItem && selectedItem.title) {
                    return {
                        id: questionId,
                        title: selectedItem.title,
                        status: true,
                    };
                } else {
                    console.error(`Item with id ${selectedItemId} not found for question ${questionId}`);
                    return null;
                }
            }).filter((answer): answer is { id: string; title: string; status: boolean } => answer !== null);

            if (answers.length === 0) {
                console.log('No valid answers selected.');
                setLoading(false);
                return;
            }

            const materialUuid = content?.uuid || '';
            const materialSlug = content?.slug || '';

            const reportPayload: ReportPayload = {
                data: {
                    users_permissions_user: userIdString,
                    material_uuid: materialUuid,
                    material_slug: materialSlug,
                    answer: answers,
                    category: "7",
                    is_complete: true,
                },
            };

            const createResponse = await fetch('https://api-genfiit.yanginibeda.web.id/api/reports', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reportPayload),
            });

            if (!createResponse.ok) {
                console.error('HTTP error', createResponse.status);
                const errorText = await createResponse.text();
                console.error('Error body:', errorText);
            } else {
                const createResult = await createResponse.json();
                console.log('API Response:', createResult);

                if (createResult.data) {
                    console.log('Report created successfully!');
                    await AsyncStorage.setItem(`contentCompleted_${materialUuid}`, 'true');
                    navigation.navigate('LearningSession');
                } else {
                    console.error('Error creating report:', createResult.error.message || 'Unknown error');
                }
            }
        } catch (error) {
            console.error('Error in submit:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!content) return <Text>Loading content...</Text>;

    const renderParagraph = (paragraph: any, index: number) => (
        <View key={index} style={styles.paragraphContainer}>
            {paragraph.children.map((child: any, idx: number) => (
                <Text key={idx} style={styles.paragraphText}>
                    {child.text}
                </Text>
            ))}
        </View>
    );

    const renderQuestion = (question: any) => {
        return (
            <View key={question.id} style={styles.questionContainer}>
                <Text style={styles.questionTitle}>{question.title}</Text>
                {question.item && (
                    <View style={styles.itemsContainer}>
                        {question.item.map((item: any) => {
                            const isSelected = selectedAnswers[question.id] === item.id;
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.itemButton,
                                        isSelected && styles.selectedItemButton,
                                    ]}
                                    onPress={() => handleSelectAnswer(question.id, item.id)}
                                >
                                    <View style={styles.dotContainer}>
                                        <View style={[styles.dot, isSelected && styles.filledDot]} />
                                    </View>
                                    <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
                                        {item.title}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </View>
        );
    };

    const imageUrl = content?.media?.url
        ? `https://api-genfiit.yanginibeda.web.id${content.media.url}`
        : null;

    return (
        <ResponsiveContainer>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContent}>
                {imageUrl && (
                    <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
                )}
                <Text style={styles.title}>{content.title}</Text>
                <View style={styles.descriptionContainer}>
                    {content.description.map((paragraph: any, index: number) => renderParagraph(paragraph, index))}
                </View>
                <View style={styles.questionsContainer}>
                    {content.questions.map((question: any) => renderQuestion(question))}
                </View>
            </ScrollView>

            <View style={styles.submitButtonContainer}>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.submitButtonText}>
                        {loading ? 'Submitting...' : 'Submit Answers'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ResponsiveContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    scrollViewContent: {
        paddingBottom: 80,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#4A90E2',
    },
    descriptionContainer: {
        marginBottom: 20,
    },
    paragraphContainer: {
        marginBottom: 15,
    },
    paragraphText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        marginBottom: 10,
    },
    questionsContainer: {
        marginTop: 20,
    },
    questionContainer: {
        marginBottom: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    questionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 10,
    },
    itemsContainer: {
        marginTop: 10,
    },
    itemButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingLeft: 20,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedItemButton: {
        backgroundColor: '#E0F7FA',
    },
    dotContainer: {
        marginRight: 10,
    },
    dot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#4A90E2',
    },
    filledDot: {
        backgroundColor: '#4A90E2',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    selectedItemText: {
        fontWeight: 'bold',
        color: '#4A90E2',
    },
    submitButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        zIndex: 1,
    },
    submitButton: {
        backgroundColor: '#4A90E2',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    }
});

export default ContentDetailScreen;
