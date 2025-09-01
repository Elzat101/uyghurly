import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';

const SettingsScreen = ({ navigation }: any) => {
  const { theme, setTheme, isDark } = useTheme();
  const { fontSize, setFontSize, getFontSizeValue } = useFontSize();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
  };

  const handleFontSizeChange = (newFontSize: 'small' | 'medium' | 'large') => {
    setFontSize(newFontSize);
  };

  const settingsSections = [
    {
      title: 'Appearance',
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
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          label: 'Push Notifications',
          value: true,
          type: 'switch',
        },
        {
          label: 'Daily Reminders',
          value: false,
          type: 'switch',
        },
        {
          label: 'Quiz Results',
          value: true,
          type: 'switch',
        },
      ],
    },
    {
      title: 'Learning',
      items: [
        {
          label: 'Auto-play Audio',
          value: false,
          type: 'switch',
        },
        {
          label: 'Show Hints',
          value: true,
          type: 'switch',
        },
        {
          label: 'Review Mode',
          value: false,
          type: 'switch',
        },
      ],
    },
    {
      title: 'Data & Privacy',
      items: [
        {
          label: 'Sync Progress',
          value: true,
          type: 'switch',
        },
        {
          label: 'Analytics',
          value: false,
          type: 'switch',
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
              onValueChange={() => {}}
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
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Customize your learning experience and app preferences.
          </Text>
        </View>

        <View style={styles.content}>
          {settingsSections.map(renderSection)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;


