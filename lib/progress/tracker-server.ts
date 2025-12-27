import { ModuleProgress } from "@/types/progress";
import { getAllModules, getChaptersByModule, getLessonsByChapter } from "@/lib/content/loaders";
import { isLessonComplete } from "./tracker";

export function getModuleProgress(moduleId: string): ModuleProgress {
  const modules = getAllModules();
  const module = modules.find((m) => m.id === moduleId);
  if (!module) {
    return { moduleId, completedLessons: 0, totalLessons: 0, percentage: 0 };
  }

  const chapters = getChaptersByModule(moduleId);
  let totalLessons = 0;
  let completedLessons = 0;

  for (const chapter of chapters) {
    const lessons = getLessonsByChapter(chapter.id);
    totalLessons += lessons.length;
    for (const lesson of lessons) {
      if (isLessonComplete(lesson.id)) {
        completedLessons++;
      }
    }
  }

  const percentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    moduleId,
    completedLessons,
    totalLessons,
    percentage,
  };
}

export function getOverallProgress(): number {
  const modules = getAllModules();
  let totalLessons = 0;
  let completedLessons = 0;

  for (const module of modules) {
    const chapters = getChaptersByModule(module.id);
    for (const chapter of chapters) {
      const lessons = getLessonsByChapter(chapter.id);
      totalLessons += lessons.length;
      for (const lesson of lessons) {
        if (isLessonComplete(lesson.id)) {
          completedLessons++;
        }
      }
    }
  }

  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
}

