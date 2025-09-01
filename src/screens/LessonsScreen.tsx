import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';

interface Unit {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isCompleted: boolean;
  progress: number;
}

const LessonsScreen = ({ navigation }: any) => {
  const { isDark } = useTheme();
  const { getFontSizeValue } = useFontSize();
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    // Mock data - in real app, this would come from your data source
    const mockUnits: Unit[] = [
      {
        id: 'basics',
        title: 'Basics',
        description: 'Learn fundamental Uyghur words and phrases',
        lessonCount: 5,
        difficulty: 'Beginner',
        isCompleted: false,
        progress: 0,
      },
      {
        id: 'basics-pt2',
        title: 'Basics Part 2',
        description: 'Continue with essential vocabulary',
        lessonCount: 4,
        difficulty: 'Beginner',
        isCompleted: false,
        progress: 0,
      },
      {
        id: 'basic-vocabulary',
        title: 'Basic Vocabulary',
        description: 'Essential words for everyday use',
        lessonCount: 6,
        difficulty: 'Beginner',
        isCompleted: false,
        progress: 0,
      },
      {
        id: 'daily-life',
        title: 'Daily Life',
        description: 'Common phrases for daily activities',
        lessonCount: 5,
        difficulty: 'Beginner',
        isCompleted: false,
        progress: 0,
      },
      {
        id: 'food',
        title: 'Food & Dining',
        description: 'Learn about food, restaurants, and dining',
        lessonCount: 4,
        difficulty: 'Beginner',
        isCompleted: false,
        progress: 0,
      },
      {
        id: 'home',
        title: 'Home & Family',
        description: 'Family members and household items',
        lessonCount: 5,
        difficulty: 'Beginner',
        isCompleted: false,
        progress: 0,
      },
    ];

    setUnits(mockUnits);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#10b981';
      case 'Intermediate':
        return '#f59e0b';
      case 'Advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return '#e5e7eb';
    if (progress < 50) return '#fbbf24';
    if (progress < 100) return '#34d399';
    return '#10b981';
  };

  const renderUnit = ({ item }: { item: Unit }) => (
    <TouchableOpacity
      style={styles.unitCard}
      onPress={() => navigation.navigate('LessonDetail', { unitId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.unitHeader}>
        <View style={styles.unitInfo}>
          <Text style={styles.unitTitle}>{item.title}</Text>
          <Text style={styles.unitDescription}>{item.description}</Text>
        </View>
        <View style={styles.unitMeta}>
          <Text style={styles.lessonCount}>{item.lessonCount} lessons</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
            <Text style={styles.difficultyText}>{item.difficulty}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${item.progress}%`,
                backgroundColor: getProgressColor(item.progress)
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{item.progress}% complete</Text>
      </View>

      {item.isCompleted && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>✓ Completed</Text>
        </View>
      )}
    </TouchableOpacity>
  );

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
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    unitCard: {
      backgroundColor: isDark ? '#374151' : '#ffffff',
      borderRadius: 12,
      padding: 20,
      marginBottom: 15,
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
    unitHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    unitInfo: {
      flex: 1,
      marginRight: 15,
    },
    unitTitle: {
      fontSize: getFontSizeValue() + 4,
      fontWeight: '600',
      color: isDark ? '#f9fafb' : '#111827',
      marginBottom: 5,
    },
    unitDescription: {
      fontSize: getFontSizeValue(),
      color: isDark ? '#9ca3af' : '#6b7280',
      lineHeight: 20,
    },
    unitMeta: {
      alignItems: 'flex-end',
    },
    lessonCount: {
      fontSize: getFontSizeValue(),
      color: isDark ? '#9ca3af' : '#6b7280',
      marginBottom: 8,
    },
    difficultyBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    difficultyText: {
      fontSize: getFontSizeValue() - 2,
      color: '#ffffff',
      fontWeight: '500',
    },
    progressContainer: {
      marginBottom: 15,
    },
    progressBar: {
      height: 6,
      backgroundColor: isDark ? '#4b5563' : '#e5e7eb',
      borderRadius: 3,
      marginBottom: 8,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
    },
    progressText: {
      fontSize: getFontSizeValue() - 2,
      color: isDark ? '#9ca3af' : '#6b7280',
      textAlign: 'right',
    },
    completedBadge: {
      backgroundColor: '#10b981',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'flex-start',
    },
    completedText: {
      fontSize: getFontSizeValue() - 2,
      color: '#ffffff',
      fontWeight: '500',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lessons</Text>
        <Text style={styles.subtitle}>
          Choose a unit to start learning Uyghur. Each unit contains multiple lessons 
          that will help you build your vocabulary and understanding.
        </Text>
      </View>

      <View style={styles.content}>
        <FlatList
          data={units}
          renderItem={renderUnit}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default LessonsScreen;


