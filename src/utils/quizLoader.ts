import { UnitQuiz, QuizResult } from "@/types/lesson";
import unitQuizzesData from "@/lessons_by_unit_bundle/unit_quizzes.json";

// Cache for quizzes
const quizCache = new Map<string, UnitQuiz>();

// Load all quizzes
export async function getAllQuizzes(): Promise<UnitQuiz[]> {
  try {
    if (!unitQuizzesData || !Array.isArray(unitQuizzesData.quizzes)) {
      throw new Error("Invalid quiz data structure");
    }

    return unitQuizzesData.quizzes as UnitQuiz[];
  } catch (error) {
    console.error("Error loading quizzes:", error);
    return [];
  }
}

// Load quiz by unit ID
export async function getQuizByUnitId(
  unitId: string
): Promise<UnitQuiz | null> {
  try {
    // Check cache first
    const cachedQuiz = quizCache.get(unitId);
    if (cachedQuiz) {
      return cachedQuiz;
    }

    const quizzes = await getAllQuizzes();
    const quiz = quizzes.find((q) => q.unitId === unitId);

    if (quiz) {
      // Cache the quiz
      quizCache.set(unitId, quiz);
      return quiz;
    }

    return null;
  } catch (error) {
    console.error(`Error loading quiz for unit ${unitId}:`, error);
    return null;
  }
}

// Save quiz result to localStorage
export function saveQuizResult(quizResult: QuizResult): void {
  try {
    localStorage.setItem(
      `quiz-${quizResult.quizId}`,
      JSON.stringify(quizResult)
    );
  } catch (error) {
    console.error("Error saving quiz result:", error);
  }
}

// Get quiz result from localStorage
export function getQuizResult(quizId: string): QuizResult | null {
  try {
    const result = localStorage.getItem(`quiz-${quizId}`);
    if (result) {
      const parsed = JSON.parse(result);
      // Convert string date back to Date object
      parsed.completedAt = new Date(parsed.completedAt);
      return parsed;
    }
    return null;
  } catch (error) {
    console.error("Error loading quiz result:", error);
    return null;
  }
}

// Check if quiz is completed
export function isQuizCompleted(quizId: string): boolean {
  const result = getQuizResult(quizId);
  return result !== null && result.passed;
}

// Check if quiz is unlocked (all lessons in unit completed)
export function isQuizUnlocked(
  unitId: string,
  completedLessons: string[]
): boolean {
  // This will be implemented based on the lesson completion logic
  // For now, we'll assume all quizzes are unlocked
  // TODO: Implement proper lesson completion checking
  console.log(
    `Checking quiz unlock for unit ${unitId} with ${completedLessons.length} completed lessons`
  );
  return true;
}

// Get quiz progress for a unit
export function getQuizProgress(unitId: string): {
  isCompleted: boolean;
  isUnlocked: boolean;
  score?: number;
  passed?: boolean;
} {
  const quiz = quizCache.get(unitId);
  if (!quiz) {
    return { isCompleted: false, isUnlocked: false };
  }

  const result = getQuizResult(quiz.unitId);
  const isCompleted = result !== null;
  const isUnlocked = true; // This will be updated based on lesson completion

  return {
    isCompleted,
    isUnlocked,
    score: result?.score,
    passed: result?.passed,
  };
}
