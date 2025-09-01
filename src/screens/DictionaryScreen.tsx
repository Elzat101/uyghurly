import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';

interface DictionaryEntry {
  id: string;
  uyghur: string;
  english: string;
  pronunciation: string;
  category: string;
  example?: string;
}

const DictionaryScreen = ({ navigation }: any) => {
  const { isDark } = useTheme();
  const { getFontSizeValue } = useFontSize();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEntries, setFilteredEntries] = useState<DictionaryEntry[]>([]);
  const [allEntries, setAllEntries] = useState<DictionaryEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Mock data - in real app, this would come from your data source
    const mockEntries: DictionaryEntry[] = [
      {
        id: '1',
        uyghur: 'ياخشى',
        english: 'Good',
        pronunciation: 'yakhshi',
        category: 'Basics',
        example: 'ياخشى كۈن - Good day',
      },
      {
        id: '2',
        uyghur: 'رەھمەت',
        english: 'Thank you',
        pronunciation: 'rehmet',
        category: 'Basics',
        example: 'رەھمەت سىزگە - Thank you',
      },
      {
        id: '3',
        uyghur: 'سەلەم',
        english: 'Hello',
        pronunciation: 'selam',
        category: 'Greetings',
        example: 'سەلەم - Hello',
      },
      {
        id: '4',
        uyghur: 'خوش',
        english: 'Goodbye',
        pronunciation: 'khosh',
        category: 'Greetings',
        example: 'خوش - Goodbye',
      },
      {
        id: '5',
        uyghur: 'سۇ',
        english: 'Water',
        pronunciation: 'su',
        category: 'Food',
        example: 'سۇ ئىچىڭ - Drink water',
      },
      {
        id: '6',
        uyghur: 'نان',
        english: 'Bread',
        pronunciation: 'nan',
        category: 'Food',
        example: 'نان يەڭ - Eat bread',
      },
      {
        id: '7',
        uyghur: 'ئۆي',
        english: 'House',
        pronunciation: 'öy',
        category: 'Home',
        example: 'مەن ئۆيدە - I am at home',
      },
      {
        id: '8',
        uyghur: 'ماشىنا',
        english: 'Car',
        pronunciation: 'mashina',
        category: 'Transport',
        example: 'ماشىنا سۈرۈڭ - Drive a car',
      },
    ];

    setAllEntries(mockEntries);
    setFilteredEntries(mockEntries);
  }, []);

  const categories = ['all', 'Basics', 'Greetings', 'Food', 'Home', 'Transport'];

  useEffect(() => {
    let filtered = allEntries;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(entry => entry.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.english.toLowerCase().includes(query) ||
        entry.uyghur.includes(query) ||
        entry.pronunciation.toLowerCase().includes(query)
      );
    }

    setFilteredEntries(filtered);
  }, [searchQuery, selectedCategory, allEntries]);

  const renderEntry = ({ item }: { item: DictionaryEntry }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <Text style={styles.uyghurText}>{item.uyghur}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
      
      <Text style={styles.englishText}>{item.english}</Text>
      <Text style={styles.pronunciationText}>[{item.pronunciation}]</Text>
      
      {item.example && (
        <Text style={styles.exampleText}>{item.example}</Text>
      )}
    </View>
  );

  const renderCategoryButton = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === item && styles.categoryButtonTextActive
      ]}>
        {item === 'all' ? 'All' : item}
      </Text>
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
    searchContainer: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    searchInput: {
      backgroundColor: isDark ? '#374151' : '#ffffff',
      borderWidth: 1,
      borderColor: isDark ? '#4b5563' : '#d1d5db',
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 12,
      fontSize: getFontSizeValue(),
      color: isDark ? '#f9fafb' : '#111827',
    },
    categoriesContainer: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    categoriesTitle: {
      fontSize: getFontSizeValue() + 2,
      fontWeight: '600',
      color: isDark ? '#f9fafb' : '#111827',
      marginBottom: 15,
    },
    categoriesList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    categoryButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDark ? '#374151' : '#f3f4f6',
      marginRight: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: isDark ? '#4b5563' : '#e5e7eb',
    },
    categoryButtonActive: {
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
    },
    categoryButtonText: {
      fontSize: getFontSizeValue(),
      color: isDark ? '#9ca3af' : '#6b7280',
      fontWeight: '500',
    },
    categoryButtonTextActive: {
      color: '#ffffff',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    entryCard: {
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
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    uyghurText: {
      fontSize: getFontSizeValue() + 6,
      fontWeight: '600',
      color: isDark ? '#f9fafb' : '#111827',
    },
    categoryBadge: {
      backgroundColor: '#3b82f6',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    categoryText: {
      fontSize: getFontSizeValue() - 2,
      color: '#ffffff',
      fontWeight: '500',
    },
    englishText: {
      fontSize: getFontSizeValue() + 2,
      fontWeight: '500',
      color: isDark ? '#f9fafb' : '#111827',
      marginBottom: 5,
    },
    pronunciationText: {
      fontSize: getFontSizeValue(),
      color: isDark ? '#9ca3af' : '#6b7280',
      fontStyle: 'italic',
      marginBottom: 10,
    },
    exampleText: {
      fontSize: getFontSizeValue(),
      color: isDark ? '#9ca3af' : '#6b7280',
      fontStyle: 'italic',
      borderLeftWidth: 3,
      borderLeftColor: '#3b82f6',
      paddingLeft: 10,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dictionary</Text>
        <Text style={styles.subtitle}>
          Search and browse Uyghur words and phrases with their English translations, 
          pronunciations, and example usage.
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search words..."
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryButton}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <View style={styles.content}>
        <FlatList
          data={filteredEntries}
          renderItem={renderEntry}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default DictionaryScreen;


