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

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

const QuizScreen = ({ route, navigation }: any) => {
  const { unitId } = route.params;
  const { isDark } = useTheme();
  const { getFontSizeValue } = useFontSize();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    // Mock data - in real app, this would come from your data source
    const mockQuestions: QuizQuestion[] = [
      {
        id: '1',
        question: 'What does "ياخشى" mean in English?',
        options: ['Good', 'Bad', 'Hello', 'Thank you'],
        correctAnswer: 'Good',
        explanation: '"ياخشى" (yakhshi) means "good" in Uyghur.',
      },
      {
        id: '2',
        question: 'What does "رەھمەت" mean in English?',
        options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
        correctAnswer: 'Thank you',
        explanation: '"رەھمەت" (rehmet) means "thank you" in Uyghur.',
      },
      {
        id: '3',
        question: 'What does "سەلەم" mean in English?',
        options: ['Goodbye', 'Hello', 'Thank you', 'Please'],
        correctAnswer: 'Hello',
        explanation: '"سەلەم" (selam) means "hello" in Uyghur.',
      },
      {
        id: '4',
        question: 'What does "خوش" mean in English?',
        options: ['Hello', 'Goodbye', 'Good', 'Thank you'],
        correctAnswer: 'Goodbye',
        explanation: '"خوش" (khosh) means "goodbye" in Uyghur.',
      },
    ];

    setQuestions(mockQuestions);
  }, [unitId]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      Alert.alert('Error', 'Please select an answer before submitting.');
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      const finalScore = selectedAnswer === currentQuestion.correctAnswer ? score + 1 : score;
      const percentage = Math.round((finalScore / questions.length) * 100);
      
      setQuizCompleted(true);
      setScore(finalScore);
      
      Alert.alert(
        'Quiz Complete!',
        `Your score: ${finalScore}/${questions.length} (${percentage}%)`,
        [
          {
            text: 'Review Results',
            onPress: () => {},
          },
          {
            text: 'Back to Lessons',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  const getOptionStyle = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option ? styles.optionSelected : styles.option;
    }

    if (option === currentQuestion.correctAnswer) {
      return styles.optionCorrect;
    }

    if (selectedAnswer === option && option !== currentQuestion.correctAnswer) {
      return styles.optionIncorrect;
    }

    return styles.option;
  };

  const getOptionTextStyle = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option ? styles.optionTextSelected : styles.optionText;
    }

    if (option === currentQuestion.correctAnswer) {
      return styles.optionTextCorrect;
    }

    if (selectedAnswer === option && option !== currentQuestion.correctAnswer) {
      return styles.optionTextIncorrect;
    }

    return styles.optionText;
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
      width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    questionCard: {
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
    questionText: {
      fontSize: getFontSizeValue() + 4,
      fontWeight: '600',
      color: isDark ? '#f9fafb' : '#111827',
      marginBottom: 20,
      lineHeight: 28,
    },
    optionsContainer: {
      marginBottom: 20,
    },
    option: {
      backgroundColor: isDark ? '#4b5563' : '#f3f4f6',
      borderRadius: 8,
      padding: 15,
      marginBottom: 10,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    optionSelected: {
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
    },
    optionCorrect: {
      backgroundColor: '#10b981',
      borderColor: '#10b981',
    },
    optionIncorrect: {
      backgroundColor: '#ef4444',
      borderColor: '#ef4444',
    },
    optionText: {
      fontSize: getFontSizeValue() + 2,
      color: isDark ? '#f9fafb' : '#111827',
      textAlign: 'center',
    },
    optionTextSelected: {
      color: '#ffffff',
      fontWeight: '600',
    },
    optionTextCorrect: {
      color: '#ffffff',
      fontWeight: '600',
    },
    optionTextIncorrect: {
      color: '#ffffff',
      fontWeight: '600',
    },
    explanationContainer: {
      backgroundColor: isDark ? '#1f2937' : '#f9fafb',
      borderRadius: 8,
      padding: 15,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: isDark ? '#4b5563' : '#e5e7eb',
    },
    explanationText: {
      fontSize: getFontSizeValue(),
      color: isDark ? '#9ca3af' : '#6b7280',
      lineHeight: 20,
      fontStyle: 'italic',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    button: {
      backgroundColor: '#3b82f6',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 8,
      minWidth: 120,
      marginHorizontal: 10,
    },
    buttonText: {
      color: '#ffffff',
      textAlign: 'center',
      fontSize: getFontSizeValue() + 2,
      fontWeight: '600',
    },
    nextButton: {
      backgroundColor: '#10b981',
    },
  });

  if (!currentQuestion) {
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
          <Text style={styles.title}>Quiz</Text>
          <Text style={styles.subtitle}>
            Test your knowledge of the Uyghur language. Choose the correct answer for each question.
          </Text>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>Question {currentQuestionIndex + 1} of {questions.length}</Text>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={getOptionStyle(option)}
                  onPress={() => handleAnswerSelect(option)}
                  disabled={showResult}
                >
                  <Text style={getOptionTextStyle(option)}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {showResult && currentQuestion.explanation && (
              <View style={styles.explanationContainer}>
                <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {!showResult ? (
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmitAnswer}
              disabled={!selectedAnswer}
            >
              <Text style={styles.buttonText}>Submit Answer</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.nextButton]}
              onPress={handleNextQuestion}
            >
              <Text style={styles.buttonText}>
                {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuizScreen;


