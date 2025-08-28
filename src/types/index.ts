export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: number;
  exercises: Exercise[];
  requiredLevel: number;
  xpReward: number;
}

export interface Exercise {
  id: string;
  type: "multiple-choice" | "translation" | "listening" | "speaking";
  question: string;
  correctAnswer: string;
  options?: string[];
  audioUrl?: string;
}

export interface UserProgress {
  level: number;
  xp: number;
  completedLessons: string[];
  currentStreak: number;
  longestStreak: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  progress: UserProgress;
  avatarUrl?: string;
}
