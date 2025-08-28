import { LessonContent } from "@/types/lesson";
import unitsData from "@/lessons_by_unit_bundle/units.json";
import { convertRawLessonsToStructuredLessons } from "@/utils/convertLessons";

// Import the actual lesson files
import basicsData from "@/lessons_by_unit_bundle/Basics.json";
import basicsPt2Data from "@/lessons_by_unit_bundle/Basics_pt2.json";
import basicVocabularyData from "@/lessons_by_unit_bundle/Basic_Vocabulary.json";
import peopleData from "@/lessons_by_unit_bundle/People.json";
import describingData from "@/lessons_by_unit_bundle/Describing.json";
import dailyLifeData from "@/lessons_by_unit_bundle/Daily_Life.json";
import homeData from "@/lessons_by_unit_bundle/Home.json";
import schoolData from "@/lessons_by_unit_bundle/School.json";
import foodData from "@/lessons_by_unit_bundle/Food.json";
import shoppingData from "@/lessons_by_unit_bundle/Shopping_and_Money.json";
import healthData from "@/lessons_by_unit_bundle/Health.json";
import travelData from "@/lessons_by_unit_bundle/Travel.json";
import natureData from "@/lessons_by_unit_bundle/Nature_and_Environment.json";

// Define Unit interface
interface Unit {
  id: string;
  title: string;
  lessons: string[];
}

// Cache for lessons and units
const lessonCache = new Map<string, LessonContent>();
const unitCache = new Map<string, Unit>();

// Map of lesson data files
const lessonDataFiles = {
  basics: basicsData,
  basics_pt2: basicsPt2Data,
  basic_vocabulary: basicVocabularyData,
  people: peopleData,
  describing: describingData,
  daily_life: dailyLifeData,
  home: homeData,
  school: schoolData,
  food: foodData,
  shopping_and_money: shoppingData,
  health: healthData,
  travel: travelData,
  nature_and_environment: natureData,
} as const;

// Convert all lesson data to structured format
function convertAllLessonData(): LessonContent[] {
  const allLessons: LessonContent[] = [];

  Object.entries(lessonDataFiles).forEach(([unitKey, rawData]) => {
    try {
      const structuredLessons = convertRawLessonsToStructuredLessons(rawData);
      allLessons.push(...structuredLessons);
    } catch (error) {
      console.error(`Error converting lessons for unit ${unitKey}:`, error);
    }
  });

  return allLessons;
}

// Load a lesson by its slug
export async function getLessonBySlug(
  slug: string
): Promise<LessonContent | null> {
  try {
    // Check cache first
    const cachedLesson = lessonCache.get(slug);
    if (cachedLesson) {
      return cachedLesson;
    }

    // Convert all lesson data and find the requested lesson
    const allLessons = convertAllLessonData();
    const lesson = allLessons.find((l) => l.slug === slug);

    if (lesson) {
      // Cache the lesson
      lessonCache.set(slug, lesson);
      return lesson;
    }

    return null;
  } catch (error) {
    console.error(`Error loading lesson ${slug}:`, error);
    return null;
  }
}

// Load all units
export async function getAllUnits(): Promise<string[]> {
  try {
    // Check cache first
    if (unitCache.size > 0) {
      return Array.from(unitCache.values()).map((unit) => unit.title);
    }

    // Validate units data structure
    if (!unitsData || !Array.isArray(unitsData.units)) {
      throw new Error("Invalid units data structure");
    }

    // Use the statically imported units data
    const units = unitsData.units as Unit[];

    // Validate each unit
    units.forEach((unit) => {
      if (!unit.id || !unit.title || !Array.isArray(unit.lessons)) {
        throw new Error(`Invalid unit structure: ${JSON.stringify(unit)}`);
      }
      unitCache.set(unit.id, unit);
    });

    return units.map((unit) => unit.title);
  } catch (error) {
    console.error("Error loading units:", error);
    return [];
  }
}

// Load lessons for a specific unit
export async function getLessonsByUnit(
  unitId: string
): Promise<LessonContent[]> {
  try {
    const unit = unitCache.get(unitId);
    if (!unit) {
      console.error(`Unit ${unitId} not found`);
      return [];
    }

    const lessons: LessonContent[] = [];
    for (const lessonSlug of unit.lessons) {
      const lesson = await getLessonBySlug(lessonSlug);
      if (lesson) {
        lessons.push(lesson);
      }
    }

    return lessons;
  } catch (error) {
    console.error(`Error loading lessons for unit ${unitId}:`, error);
    return [];
  }
}

// Get all lessons (used for search functionality)
export async function getAllLessons(): Promise<LessonContent[]> {
  try {
    // Convert all lesson data
    const allLessons = convertAllLessonData();

    // Validate lesson structure
    const validLessons = allLessons.filter((lesson) => {
      if (!lesson.slug || !lesson.title || !Array.isArray(lesson.vocabulary)) {
        console.warn(`Skipping invalid lesson: ${JSON.stringify(lesson)}`);
        return false;
      }
      return true;
    });

    return validLessons;
  } catch (error) {
    console.error("Error loading all lessons:", error);
    return [];
  }
}
