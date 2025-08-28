export interface LessonStatus {
  id: number;
  completed: boolean;
  score?: number;
  lastAttempted?: string;
}

const LESSONS_STORAGE_KEY = "uyghur-lessons-status";

export const getLessonStatus = (lessonId: number): LessonStatus | null => {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(LESSONS_STORAGE_KEY);
  if (!stored) return null;

  const statuses: LessonStatus[] = JSON.parse(stored);
  return statuses.find((status) => status.id === lessonId) || null;
};

export const getAllLessonStatuses = (): LessonStatus[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(LESSONS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const updateLessonStatus = (status: LessonStatus): void => {
  if (typeof window === "undefined") return;

  const stored = localStorage.getItem(LESSONS_STORAGE_KEY);
  const statuses: LessonStatus[] = stored ? JSON.parse(stored) : [];

  const existingIndex = statuses.findIndex((s) => s.id === status.id);
  if (existingIndex >= 0) {
    statuses[existingIndex] = status;
  } else {
    statuses.push(status);
  }

  localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(statuses));
};
