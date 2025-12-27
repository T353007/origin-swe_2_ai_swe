import { ModuleMetadata, ChapterMetadata, LessonMetadata } from "@/types/content";
import { getAllModules, getChaptersByModule, getLessonsByChapter } from "./loaders";

export function getModulePath(module: ModuleMetadata): string {
  return `/learning-path/module/${module.slug}`;
}

export function getLessonPath(
  module: ModuleMetadata,
  chapter: ChapterMetadata,
  lesson: LessonMetadata
): string {
  return `/learning-path/module/${module.slug}/chapter/${chapter.slug}/lesson/${lesson.slug}`;
}

export function getFullCourseStructure() {
  const modules = getAllModules();
  return modules.map((module) => {
    const chapters = getChaptersByModule(module.id);
    const chaptersWithLessons = chapters.map((chapter) => {
      const lessons = getLessonsByChapter(chapter.id);
      return { ...chapter, lessons };
    });
    return { ...module, chapters: chaptersWithLessons };
  });
}

export function getTotalLessons(): number {
  const modules = getAllModules();
  let total = 0;
  for (const module of modules) {
    const chapters = getChaptersByModule(module.id);
    for (const chapter of chapters) {
      total += getLessonsByChapter(chapter.id).length;
    }
  }
  return total;
}

export function getTotalEstimatedHours(): number {
  const modules = getAllModules();
  return modules.reduce((sum, module) => sum + module.estimatedHours, 0);
}
