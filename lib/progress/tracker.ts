import { ProgressData } from "@/types/progress";

const STORAGE_KEY = "course-progress";

export function getProgress(): ProgressData {
  if (typeof window === "undefined") {
    return { completedLessons: [], lastUpdated: Date.now() };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as ProgressData;
    }
  } catch (error) {
    console.error("Error reading progress from localStorage:", error);
  }

  return { completedLessons: [], lastUpdated: Date.now() };
}

export function saveProgress(progress: ProgressData): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    progress.lastUpdated = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Error saving progress to localStorage:", error);
  }
}

export function markLessonComplete(lessonId: string): void {
  const progress = getProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    saveProgress(progress);
  }
}

export function markLessonIncomplete(lessonId: string): void {
  const progress = getProgress();
  progress.completedLessons = progress.completedLessons.filter(
    (id) => id !== lessonId
  );
  saveProgress(progress);
}

export function isLessonComplete(lessonId: string): boolean {
  const progress = getProgress();
  return progress.completedLessons.includes(lessonId);
}
