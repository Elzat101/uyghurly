"use client";

import { Progress } from "@/components/ui/progress";
import { useCallback, useEffect, useState } from "react";
import { getAllLessonStatuses } from "@/utils/lessons";
import { getLessonBySlug } from "@/utils/lessonLoader";

interface Lesson {
  id: number;
  title: string;
  description: string;
  level: number;
  slug: string;
}

const lessons: Lesson[] = [
  // Level 1 - Basic Communication
  {
    id: 1,
    title: "Basic Greetings",
    description: "Learn common Uyghur greetings and introductions",
    level: 1,
    slug: "greetings",
  },
  {
    id: 2,
    title: "Numbers 1-10",
    description: "Master counting in Uyghur from 1 to 10",
    level: 1,
    slug: "numbers",
  },
  {
    id: 3,
    title: "Colors",
    description: "Learn the basic colors in Uyghur",
    level: 1,
    slug: "colors",
  },

  // Level 2 - Family and Time
  {
    id: 4,
    title: "Family Members",
    description: "Learn how to talk about your family in Uyghur",
    level: 2,
    slug: "family",
  },
  {
    id: 5,
    title: "Days of the Week",
    description: "Learn the days of the week in Uyghur",
    level: 2,
    slug: "days",
  },
  {
    id: 6,
    title: "Time and Months",
    description: "Learn months and time-related vocabulary",
    level: 2,
    slug: "time",
  },

  // Level 3 - Home and Environment
  {
    id: 7,
    title: "Household Items",
    description: "Learn vocabulary for common household items",
    level: 3,
    slug: "household",
  },
  {
    id: 8,
    title: "Weather",
    description: "Learn to talk about weather in Uyghur",
    level: 3,
    slug: "weather",
  },
  {
    id: 9,
    title: "Shapes",
    description: "Learn common shapes in Uyghur",
    level: 3,
    slug: "shapes",
  },

  // Level 4 - Living World
  {
    id: 10,
    title: "Animals",
    description: "Learn common animal names in Uyghur",
    level: 4,
    slug: "animals",
  },
  {
    id: 11,
    title: "Food and Drinks",
    description: "Essential vocabulary for ordering food and drinks",
    level: 4,
    slug: "food",
  },
  {
    id: 12,
    title: "Emotions",
    description: "Express feelings and emotions in Uyghur",
    level: 4,
    slug: "emotions",
  },

  // Level 5 - Society and Daily Life
  {
    id: 13,
    title: "Professions",
    description: "Learn common job and profession names",
    level: 5,
    slug: "professions",
  },
  {
    id: 14,
    title: "Daily Activities",
    description: "Learn to talk about your daily routine",
    level: 5,
    slug: "daily",
  },
  {
    id: 15,
    title: "Shopping",
    description: "Essential phrases for shopping in Uyghur",
    level: 5,
    slug: "shopping",
  },
];

export function MainLayout({
  children,
  hideProgress = false,
}: {
  children: React.ReactNode;
  hideProgress?: boolean;
}) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelProgress, setLevelProgress] = useState(0);
  const [lessonExercises, setLessonExercises] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    // Load exercise counts for each lesson
    const loadExerciseCounts = async () => {
      const counts: Record<string, number> = {};
      for (const lesson of lessons) {
        const lessonData = await getLessonBySlug(lesson.slug);
        if (lessonData) {
          counts[lesson.slug] = lessonData.exercises.length;
        }
      }
      setLessonExercises(counts);
    };

    loadExerciseCounts();
  }, []);

  const calculateLevelAndProgress = useCallback(() => {
    const lessonStatuses = getAllLessonStatuses();
    const levels = Array.from(
      new Set(
        lessonStatuses.map((status) => {
          const lesson = lessons.find((l) => l.id === status.id);
          return lesson?.level || 1;
        })
      )
    ).sort();

    // Find the highest level where all lessons are completed perfectly
    let highestCompletedLevel = 1;
    for (const level of levels) {
      const levelLessons = lessons.filter((l) => l.level === level);
      const allPerfect = levelLessons.every((lesson) => {
        const status = lessonStatuses.find((s) => s.id === lesson.id);
        const exerciseCount = lessonExercises[lesson.slug] || 0;
        return status?.completed && status.score === exerciseCount;
      });
      if (allPerfect) {
        highestCompletedLevel = level;
      } else {
        break;
      }
    }

    // Calculate progress for current level
    const currentLevelLessons = lessons.filter(
      (l) => l.level === highestCompletedLevel
    );
    const completedPerfectly = currentLevelLessons.filter((lesson) => {
      const status = lessonStatuses.find((s) => s.id === lesson.id);
      const exerciseCount = lessonExercises[lesson.slug] || 0;
      return status?.completed && status.score === exerciseCount;
    }).length;

    const progress = (completedPerfectly / currentLevelLessons.length) * 100;

    // If progress is 100% and there's a next level, move to it
    if (progress === 100 && highestCompletedLevel < Math.max(...levels)) {
      setCurrentLevel(highestCompletedLevel + 1);
      setLevelProgress(0);
    } else {
      setCurrentLevel(highestCompletedLevel);
      setLevelProgress(progress);
    }
  }, [lessonExercises]);

  useEffect(() => {
    // Calculate initial level and progress
    calculateLevelAndProgress();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "uyghur-lessons-status") {
        calculateLevelAndProgress();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [calculateLevelAndProgress]);

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {!hideProgress && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Level {currentLevel}
                </h2>
                <span className="text-sm text-gray-500">
                  {Math.round(levelProgress)}% Complete
                </span>
              </div>
              <Progress value={levelProgress} className="mt-2" />
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
