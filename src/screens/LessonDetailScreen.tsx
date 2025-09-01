import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';

interface Lesson {
  id: string;
  title: string;
  uyghurText: string;
  englishText: string;
  pronunciation: string;
  explanation?: string;
}

const LessonDetailScreen = ({ route, navigation }: any) => {
  const { unitId } = route.params;
  const { isDark } = useTheme();
  const { getFontSizeValue } = useFontSize();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    // Mock data - in real app, this would come from your data source
    const mockLessons: Lesson[] = [
      {
        id: '1',
        title: 'Basic Greetings',
        uyghurText: 'ياخشى',
        englishText: 'Good',
        pronunciation: 'yakhshi',
        explanation: 'A common greeting word in Uyghur, used to say "good" or "well".',
      },
      {
        id: '2',
        title: 'Thank You',
        uyghurText: 'رەھمەت',
        englishText: 'Thank you',
        pronunciation: 'rehmet',
        explanation: 'The standard way to say "thank you" in Uyghur.',
      },
      {
        id: '3',
        title: 'Hello',
        uyghurText: 'سەلەم',
        englishText: 'Hello',
        pronunciation: 'selam',
        explanation: 'A friendly greeting used when meeting someone.',
      },
    ];

    setLessons(mockLessons);
  }, [unitId]);

  const currentLesson = lessons[currentLessonIndex];

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setShowAnswer(false);
    } else {
      Alert.alert(
        'Lesson Complete!',
        'Congratulations! You have completed this lesson.',
        [
          {
            text: 'Take Quiz',
            onPress: () => navigation.navigate('Quiz', { unitId }),
          },
          {
            text: 'Back to Lessons',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setShowAnswer(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
    },
    title: {
      fontSize: getFontSizeValue() + 8,
      fontWeight: 'bold',
      color: isDark ? '#f9fafb' : '#111827',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: getFontSizeValue() + 2,
      color: isDark ? '#9ca3af' : '#6b7280',
      lineHeight: 24,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    progressText: {
      fontSize: getFontSizeValue(),
      color: isDark ? '#9ca3af' : '#6b7280',
      marginRight: 10,
    },
    progressBar: {
      flex: 1,
      height: 6,
      backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#3b82f6',
      borderRadius: 3,
      width: `${((currentLessonIndex + 1) / lessons.length) * 100}%`,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    lessonCard: {
      backgroundColor: isDark ? '#374151' : '#ffffff',
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      borderWidth: 1,
      borderColor: isDark ? '#4b5563' : '#e5e7eb',
    },
    lessonTitle: {
      fontSize: getFontSizeValue() + 4,
      fontWeight: '600',
      color: isDark ? '#f9fafb' : '#111827',
      marginBottom: 20,
      textAlign: 'center',
    },
    uyghurText: {
      fontSize: getFontSizeValue() + 8,
      fontWeight: '600',
      color: isDark ? '#f9fafb' : '#111827',
      textAlign: 'center',
      marginBottom: 15,
    },
    pronunciationText: {
      fontSize: getFontSizeValue() + 2,
      color: isDark ? '#9ca3af' : '#6b7280',
      textAlign: 'center',
      fontStyle: 'italic',
      marginBottom: 20,
    },
    revealButton: {
      backgroundColor: '#3b82f6',
      paddingVertical: 15,
      borderRadius: 8,
      marginBottom: 20,
    },
    revealButtonText: {
      color: '#ffffff',
      textAlign: 'center',
      fontSize: getFontSizeValue() + 2,
      fontWeight: '600',
    },
    answerContainer: {
      backgroundColor: isDark ? '#1f2937' : '#f9fafb',
      borderRadius: 8,
      padding: 15,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: isDark ? '#4b5563' : '#e5e7eb',
    },
    answerLabel: {
      fontSize: getFontSizeValue(),
      color: isDark ? '#9ca3af' : '#6b7280',
      marginBottom: 8,
      fontWeight: '500',
    },
    englishText: {
      fontSize: getFontSizeValue() + 2,
      color: isDark ? '#f9fafb' : '#111827',
      marginBottom: 10,
      fontWeight: '500',
    },
    explanationText: {
      fontSize: getFontSizeValue(),
      color: isDark ? '#9ca3af' : '#6b7280',
      lineHeight: 20,
      fontStyle: 'italic',
    },
    navigationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    navButton: {
      backgroundColor: '#6b7280',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 8,
      minWidth: 100,
    },
    navButtonText: {
      color: '#ffffff',
      textAlign: 'center',
      fontSize: getFontSizeValue() + 2,
      fontWeight: '600',
    },
    nextButton: {
      backgroundColor: '#10b981',
    },
  });

  if (!currentLesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Lesson {currentLessonIndex + 1} of {lessons.length}</Text>
          <Text style={styles.subtitle}>
            Learn the Uyghur language step by step. Take your time to understand each word.
          </Text>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Progress</Text>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.lessonCard}>
            <Text style={styles.lessonTitle}>{currentLesson.title}</Text>
            
            <Text style={styles.uyghurText}>{currentLesson.uyghurText}</Text>
            <Text style={styles.pronunciationText}>[{currentLesson.pronunciation}]</Text>
            
            {!showAnswer ? (
              <TouchableOpacity
                style={styles.revealButton}
                onPress={() => setShowAnswer(true)}
              >
                <Text style={styles.revealButtonText}>Reveal Answer</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.answerContainer}>
                <Text style={styles.answerLabel}>English Translation:</Text>
                <Text style={styles.englishText}>{currentLesson.englishText}</Text>
                
                {currentLesson.explanation && (
                  <>
                    <Text style={styles.answerLabel}>Explanation:</Text>
                    <Text style={styles.explanationText}>{currentLesson.explanation}</Text>
                  </>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, currentLessonIndex === 0 && { opacity: 0.5 }]}
            onPress={handlePrevious}
            disabled={currentLessonIndex === 0}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNext}
          >
            <Text style={styles.navButtonText}>
              {currentLessonIndex === lessons.length - 1 ? 'Complete' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LessonDetailScreen;


