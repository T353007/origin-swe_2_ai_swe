import { ModuleMetadata, ChapterMetadata, LessonMetadata } from "@/types/content";
import { getAllModules, getChaptersByModule, getLessonsByChapter } from "./loaders";

export function getModulePath(mod: ModuleMetadata): string {
  return `/learning-path/module/${mod.slug}`;
}

export function getLessonPath(
  mod: ModuleMetadata,
  chapter: ChapterMetadata,
  lesson: LessonMetadata
): string {
  return `/learning-path/module/${mod.slug}/chapter/${chapter.slug}/lesson/${lesson.slug}`;
}

export function getFullCourseStructure() {
  const modules = getAllModules();
  return modules.map((modItem) => {
    const chapters = getChaptersByModule(modItem.id);
    const chaptersWithLessons = chapters.map((chapter) => {
      const lessons = getLessonsByChapter(chapter.id);
      return { ...chapter, lessons };
    });
    return { ...modItem, chapters: chaptersWithLessons };
  });
}

export function getTotalLessons(): number {
  const modules = getAllModules();
  let total = 0;
  for (const mod of modules) {
    const chapters = getChaptersByModule(mod.id);
    for (const chapter of chapters) {
      total += getLessonsByChapter(chapter.id).length;
    }
  }
  return total;
}

export function getTotalEstimatedHours(): number {
  const modules = getAllModules();
  return modules.reduce((sum, mod) => sum + mod.estimatedHours, 0);
}
