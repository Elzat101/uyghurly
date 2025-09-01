import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';

const AdminScreen = ({ navigation }: any) => {
  const { isDark } = useTheme();
  const { getFontSizeValue } = useFontSize();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState('');

  const adminActions = [
    {
      title: 'User Management',
      description: 'View and manage user accounts',
      icon: '👥',
      onPress: () => Alert.alert('User Management', 'User management features coming soon.'),
    },
    {
      title: 'Content Management',
      description: 'Add, edit, or remove lessons and content',
      icon: '📝',
      onPress: () => Alert.alert('Content Management', 'Content management features coming soon.'),
    },
    {
      title: 'Analytics Dashboard',
      description: 'View learning analytics and statistics',
      icon: '📊',
      onPress: () => Alert.alert('Analytics', 'Analytics dashboard coming soon.'),
    },
    {
      title: 'System Settings',
      description: 'Configure app-wide settings and preferences',
      icon: '⚙️',
      onPress: () => Alert.alert('System Settings', 'System settings coming soon.'),
    },
    {
      title: 'Backup & Restore',
      description: 'Manage data backup and restoration',
      icon: '💾',
      onPress: () => Alert.alert('Backup & Restore', 'Backup features coming soon.'),
    },
    {
      title: 'Logs & Monitoring',
      description: 'View system logs and monitor app performance',
      icon: '📋',
      onPress: () => Alert.alert('Logs & Monitoring', 'Logging features coming soon.'),
    },
  ];

  const quickStats = [
    { label: 'Total Users', value: '1,234', change: '+12%' },
    { label: 'Active Users', value: '567', change: '+8%' },
    { label: 'Lessons Created', value: '89', change: '+5%' },
    { label: 'Quiz Attempts', value: '2,345', change: '+15%' },
  ];

  const renderActionCard = (action: any) => (
    <TouchableOpacity
      key={action.title}
      style={styles.actionCard}
      onPress={action.onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.actionIcon}>{action.icon}</Text>
      <Text style={styles.actionTitle}>{action.title}</Text>
      <Text style={styles.actionDescription}>{action.description}</Text>
    </TouchableOpacity>
  );

  const renderStatCard = (stat: any) => (
    <View key={stat.label} style={styles.statCard}>
      <Text style={styles.statLabel}>{stat.label}</Text>
      <Text style={styles.statValue}>{stat.value}</Text>
      <Text style={styles.statChange}>{stat.change}</Text>
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
    statsSection: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: getFontSizeValue() + 4,
      fontWeight: '600',
      color: isDark ? '#f9fafb' : '#111827',
      marginBottom: 15,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    statCard: {
      width: '48%',
      backgroundColor: isDark ? '#374151' : '#ffffff',
      borderRadius: 12,
      padding: 15,
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
    statLabel: {
      fontSize: getFontSizeValue(),
      color: isDark ? '#9ca3af' : '#6b7280',
      marginBottom: 5,
    },
    statValue: {
      fontSize: getFontSizeValue() + 4,
      fontWeight: 'bold',
      color: isDark ? '#f9fafb' : '#111827',
      marginBottom: 5,
    },
    statChange: {
      fontSize: getFontSizeValue() - 2,
      color: '#10b981',
      fontWeight: '500',
    },
    actionsSection: {
      marginBottom: 30,
    },
    actionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    actionCard: {
      width: '48%',
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
      alignItems: 'center',
    },
    actionIcon: {
      fontSize: 32,
      marginBottom: 10,
    },
    actionTitle: {
      fontSize: getFontSizeValue() + 2,
      fontWeight: '600',
      color: isDark ? '#f9fafb' : '#111827',
      marginBottom: 8,
      textAlign: 'center',
    },
    actionDescription: {
      fontSize: getFontSizeValue(),
      color: isDark ? '#9ca3af' : '#6b7280',
      textAlign: 'center',
      lineHeight: 18,
    },
    quickActionsSection: {
      marginBottom: 30,
    },
    quickActionButton: {
      backgroundColor: '#3b82f6',
      paddingVertical: 15,
      borderRadius: 8,
      marginBottom: 15,
    },
    quickActionButtonText: {
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
          <Text style={styles.title}>Admin Panel</Text>
          <Text style={styles.subtitle}>
            Manage your Uyghur language learning platform. Monitor users, content, and system performance.
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Quick Stats</Text>
            <View style={styles.statsGrid}>
              {quickStats.map(renderStatCard)}
            </View>
          </View>

          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => Alert.alert('Export Data', 'Data export feature coming soon.')}
            >
              <Text style={styles.quickActionButtonText}>Export User Data</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => Alert.alert('System Check', 'System health check completed.')}
            >
              <Text style={styles.quickActionButtonText}>Run System Check</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Admin Tools</Text>
            <View style={styles.actionsGrid}>
              {adminActions.map(renderActionCard)}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminScreen;


