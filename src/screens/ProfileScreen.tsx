import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';

const ProfileScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const { fontSize, setFontSize, getFontSizeValue } = useFontSize();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
  };

  const handleFontSizeChange = (newFontSize: 'small' | 'medium' | 'large') => {
    setFontSize(newFontSize);
  };

  const profileSections = [
    {
      title: 'Account',
      items: [
        {
          label: 'Name',
          value: user?.name || 'Guest User',
          type: 'text',
        },
        {
          label: 'Username',
          value: user?.username || 'guest',
          type: 'text',
        },
        {
          label: 'Email',
          value: user?.email || 'guest@uyghurly.com',
          type: 'text',
        },
        {
          label: 'Account Type',
          value: user?.isGuest ? 'Guest' : 'Registered',
          type: 'text',
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          label: 'Theme',
          value: theme,
          type: 'theme',
          options: ['light', 'dark', 'auto'],
        },
        {
          label: 'Font Size',
          value: fontSize,
          type: 'fontSize',
          options: ['small', 'medium', 'large'],
        },
        {
          label: 'Notifications',
          value: notificationsEnabled,
          type: 'switch',
        },
      ],
    },
    {
      title: 'Learning',
      items: [
        {
          label: 'Lessons Completed',
          value: '0',
          type: 'text',
        },
        {
          label: 'Quizzes Taken',
          value: '0',
          type: 'text',
        },
        {
          label: 'Average Score',
          value: '0%',
          type: 'text',
        },
        {
          label: 'Learning Streak',
          value: '0 days',
          type: 'text',
        },
      ],
    },
  ];

  const renderSection = (section: any) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.items.map((item: any, index: number) => (
        <View key={index} style={styles.settingItem}>
          <Text style={styles.settingLabel}>{item.label}</Text>
          
          {item.type === 'text' && (
            <Text style={styles.settingValue}>{item.value}</Text>
          )}
          
          {item.type === 'theme' && (
            <View style={styles.optionsContainer}>
              {item.options.map((option: string) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    item.value === option && styles.optionButtonActive
                  ]}
                  onPress={() => handleThemeChange(option as any)}
                >
                  <Text style={[
                    styles.optionButtonText,
                    item.value === option && styles.optionButtonTextActive
                  ]}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {item.type === 'fontSize' && (
            <View style={styles.optionsContainer}>
              {item.options.map((option: string) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    item.value === option && styles.optionButtonActive
                  ]}
                  onPress={() => handleFontSizeChange(option as any)}
                >
                  <Text style={[
                    styles.optionButtonText,
                    item.value === option && styles.optionButtonTextActive
                  ]}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {item.type === 'switch' && (
            <Switch
              value={item.value}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              thumbColor={item.value ? '#ffffff' : '#ffffff'}
            />
          )}
        </View>
      ))}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 30,
      alignItems: 'center',
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#3b82f6',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
    },
    avatarText: {
      fontSize: getFontSizeValue() + 8,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    userName: {
      fontSize: getFontSizeValue() + 6,
      fontWeight: 'bold',
      color: isDark ? '#f9fafb' : '#111827',
      marginBottom: 5,
    },
    userEmail: {
      fontSize: getFontSizeValue(),
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: getFontSizeValue() + 4,
      fontWeight: '600',
      color: isDark ? '#f9fafb' : '#111827',
      marginBottom: 15,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#4b5563' : '#e5e7eb',
    },
    settingLabel: {
      fontSize: getFontSizeValue(),
      color: isDark ? '#f9fafb' : '#111827',
      flex: 1,
    },
    settingValue: {
      fontSize: getFontSizeValue(),
      color: isDark ? '#9ca3af' : '#6b7280',
      textAlign: 'right',
    },
    optionsContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    optionButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: isDark ? '#374151' : '#f3f4f6',
      borderWidth: 1,
      borderColor: isDark ? '#4b5563' : '#e5e7eb',
    },
    optionButtonActive: {
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
    },
    optionButtonText: {
      fontSize: getFontSizeValue() - 2,
      color: isDark ? '#9ca3af' : '#6b7280',
      fontWeight: '500',
    },
    optionButtonTextActive: {
      color: '#ffffff',
    },
    logoutButton: {
      backgroundColor: '#ef4444',
      paddingVertical: 15,
      borderRadius: 8,
      marginHorizontal: 20,
      marginBottom: 30,
    },
    logoutButtonText: {
      color: '#ffffff',
      textAlign: 'center',
      fontSize: getFontSizeValue() + 2,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name || 'G').charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'guest@uyghurly.com'}</Text>
        </View>

        <View style={styles.content}>
          {profileSections.map(renderSection)}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;


