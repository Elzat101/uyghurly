export interface VocabularyItem {
  uyghur: string;
  english: string;
  definition: string;
}

export interface TypingQuestion {
  question: string;
  correctAnswer: string;
  type: "uyghur-to-english" | "english-to-uyghur";
  hint?: string;
}

export interface Exercise {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  type: "multiple-choice" | "translation" | "fill-in-blank";
}

export interface UnitQuiz {
  unitId: string;
  unitTitle: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number; // Minimum score to pass (e.g., 70%)
  timeLimit?: number; // Optional time limit in minutes
}

export interface LessonContent {
  title: string;
  slug: string;
  description: string;
  unit: string;
  vocabulary: VocabularyItem[];
  exercises: Exercise[];
  typingQuestions: TypingQuestion[];
}

export interface LessonMetadata {
  title: string;
  slug: string;
  description: string;
  unit: string;
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: Date;
  passed: boolean;
  answers: {
    questionId: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
}
