"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "../../components/ui/input";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import dictionaryData from "@/data/dictionary.json";

interface DictionaryEntry {
  uyghur: string;
  english: string;
  definition: string;
  unit: string;
}

interface DictionaryDataEntry {
  uyghur: string;
  english: string;
  definition: string;
  unit: string;
}

// Function to capitalize first letter of Uyghur words
const capitalizeUyghur = (word: string): string => {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export default function DictionaryPage() {
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [filteredDictionary, setFilteredDictionary] = useState<
    DictionaryEntry[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load dictionary data directly from the JSON file
        const entries: DictionaryEntry[] = (
          dictionaryData as DictionaryDataEntry[]
        ).map((entry) => ({
          uyghur: entry.uyghur,
          english: entry.english,
          definition: entry.definition,
          unit: entry.unit,
        }));

        if (entries.length === 0) {
          setError(
            "No dictionary entries found. Please check if the dictionary file is properly loaded."
          );
          return;
        }

        // Sort alphabetically by Uyghur text
        entries.sort((a, b) => a.uyghur.localeCompare(b.uyghur));

        setDictionary(entries);
        setFilteredDictionary(entries);
      } catch (err) {
        setError("Failed to load dictionary. Please try again later.");
        console.error("Error loading dictionary:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDictionary();
  }, []);

  useEffect(() => {
    // Filter dictionary based on search term
    if (!searchTerm.trim()) {
      setFilteredDictionary(dictionary);
      return;
    }

    const filtered = dictionary.filter(
      (entry) =>
        entry.uyghur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.unit.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredDictionary(filtered);
  }, [searchTerm, dictionary]);

  if (isLoading) {
    return (
      <MainLayout hideProgress={true}>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dictionary
          </h1>
          <div className="text-center py-8">
            <div className="animate-pulse text-gray-900 dark:text-gray-100">
              Loading dictionary...
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout hideProgress={true}>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dictionary
          </h1>
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideProgress={true}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dictionary
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search words, definitions, or units..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="pl-10 w-full sm:w-80"
            />
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {filteredDictionary.length} words found
          {searchTerm && ` for "${searchTerm}"`}
        </div>

        {filteredDictionary.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No words found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDictionary.map((entry, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <CardHeader>
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-3 font-bold text-gray-900 dark:text-gray-100">
                      {capitalizeUyghur(entry.uyghur)}
                    </CardTitle>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400 pl-3">
                      {entry.english}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{entry.definition}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
