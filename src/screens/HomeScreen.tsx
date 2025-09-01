import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { getFontSizeValue } = useFontSize();

  const quickActions = [
    {
      title: 'Start Learning',
      description: 'Begin with basic vocabulary',
      icon: '📚',
      onPress: () => navigation.navigate('Lessons'),
      color: '#3b82f6',
    },
    {
      title: 'Take Quiz',
      description: 'Test your knowledge',
      icon: '🧠',
      onPress: () => navigation.navigate('Quiz', { unitId: 'basics' }),
      color: '#10b981',
    },
    {
      title: 'Dictionary',
      description: 'Look up words',
      icon: '📖',
      onPress: () => navigation.navigate('Dictionary'),
      color: '#f59e0b',
    },
    {
      title: 'Progress',
      description: 'Track your learning',
      icon: '📊',
      onPress: () => navigation.navigate('Profile'),
      color: '#8b5cf6',
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 30,
    },
    welcomeText: {
      fontSize: getFontSizeValue() + 4,
      color: isDark ? '#d1d5db' : '#6b7280',
      marginBottom: 5,
    },
    userName: {
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
    sectionTitle: {
      fontSize: getFontSizeValue() + 4,
      fontWeight: '600',
      color: isDark ? '#f9fafb' : '#111827',
      marginBottom: 20,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 30,
    },
    actionCard: {
      width: (width - 60) / 2,
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
    actionIcon: {
      fontSize: 32,
      marginBottom: 10,
    },
    actionTitle: {
      fontSize: getFontSizeValue() + 2,
      fontWeight: '600',
      color: isDark ? '#f9fafb' : '#111827',
      marginBottom: 5,
    },
    actionDescription: {
      fontSize: getFontSizeValue(),
      color: isDark ? '#9ca3af' : '#6b7280',
      lineHeight: 20,
    },
    statsContainer: {
      backgroundColor: isDark ? '#374151' : '#ffffff',
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: isDark ? '#4b5563' : '#e5e7eb',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    statsLabel: {
      fontSize: getFontSizeValue(),
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    statsValue: {
      fontSize: getFontSizeValue() + 2,
      fontWeight: '600',
      color: isDark ? '#f9fafb' : '#111827',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.userName}>
            {user?.name || 'Guest User'}
          </Text>
          <Text style={styles.subtitle}>
            Ready to continue your Uyghur language journey? 
            Choose an activity below to get started.
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={action.onPress}
                activeOpacity={0.7}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>
                  {action.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Your Progress</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Lessons Completed</Text>
              <Text style={styles.statsValue}>0</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Quizzes Taken</Text>
              <Text style={styles.statsValue}>0</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Average Score</Text>
              <Text style={styles.statsValue}>0%</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Learning Streak</Text>
              <Text style={styles.statsValue}>0 days</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;


