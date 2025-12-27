export interface ProgressData {
  completedLessons: string[];
  lastUpdated: number;
}

export interface ModuleProgress {
  moduleId: string;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
}

