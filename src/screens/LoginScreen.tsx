import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';

const LoginScreen = ({ navigation }: any) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { login, signUp, loginAsGuest, isLoading } = useAuth();
  const { isDark } = useTheme();
  const { getFontSizeValue } = useFontSize();

  const handleSubmit = async () => {
    if (isLogin) {
      // Login
      if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      
      try {
        await login(email, password);
        navigation.replace('MainTabs');
      } catch (error: any) {
        Alert.alert('Login Failed', error.message);
      }
    } else {
      // Sign up
      if (!name || !username || !email || !password || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      
      if (password.length < 8) {
        Alert.alert('Error', 'Password must be at least 8 characters long');
        return;
      }
      
      try {
        await signUp(name, username, email, password);
        navigation.replace('MainTabs');
      } catch (error: any) {
        Alert.alert('Sign Up Failed', error.message);
      }
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigation.replace('MainTabs');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    title: {
      fontSize: getFontSizeValue() + 8,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 30,
      color: isDark ? '#f9fafb' : '#111827',
    },
    subtitle: {
      fontSize: getFontSizeValue() + 2,
      textAlign: 'center',
      marginBottom: 30,
      color: isDark ? '#d1d5db' : '#6b7280',
    },
    input: {
      borderWidth: 1,
      borderColor: isDark ? '#4b5563' : '#d1d5db',
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 12,
      marginBottom: 15,
      fontSize: getFontSizeValue(),
      backgroundColor: isDark ? '#374151' : '#ffffff',
      color: isDark ? '#f9fafb' : '#111827',
    },
    button: {
      backgroundColor: '#3b82f6',
      paddingVertical: 15,
      borderRadius: 8,
      marginBottom: 15,
    },
    buttonText: {
      color: '#ffffff',
      textAlign: 'center',
      fontSize: getFontSizeValue() + 2,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      paddingVertical: 15,
      borderRadius: 8,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#3b82f6',
    },
    secondaryButtonText: {
      color: '#3b82f6',
      textAlign: 'center',
      fontSize: getFontSizeValue() + 2,
      fontWeight: '600',
    },
    toggleText: {
      textAlign: 'center',
      color: '#3b82f6',
      fontSize: getFontSizeValue(),
      marginTop: 20,
    },
    guestButton: {
      backgroundColor: '#10b981',
      paddingVertical: 15,
      borderRadius: 8,
      marginTop: 20,
    },
    guestButtonText: {
      color: '#ffffff',
      textAlign: 'center',
      fontSize: getFontSizeValue() + 2,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text style={styles.subtitle}>
            {isLogin 
              ? 'Sign in to continue learning Uyghur' 
              : 'Start your Uyghur language journey'
            }
          </Text>

          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.secondaryButtonText}>
              {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestLogin}
          >
            <Text style={styles.guestButtonText}>
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;


