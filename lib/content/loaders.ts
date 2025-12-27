import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ModuleMetadata, ChapterMetadata, LessonMetadata, LessonContent } from "@/types/content";

const contentDirectory = path.join(process.cwd(), "content");

export function getAllModules(): ModuleMetadata[] {
  const modulesDir = path.join(contentDirectory, "modules");
  if (!fs.existsSync(modulesDir)) {
    return [];
  }

  const moduleDirs = fs
    .readdirSync(modulesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort();

  return moduleDirs
    .map((dir) => {
      const metaPath = path.join(modulesDir, dir, "meta.json");
      if (!fs.existsSync(metaPath)) {
        return null;
      }
      const fileContents = fs.readFileSync(metaPath, "utf8");
      return JSON.parse(fileContents) as ModuleMetadata;
    })
    .filter((module): module is ModuleMetadata => module !== null)
    .sort((a, b) => a.order - b.order);
}

export function getModuleBySlug(slug: string): ModuleMetadata | null {
  const modules = getAllModules();
  return modules.find((m) => m.slug === slug) || null;
}

export function getChaptersByModule(moduleId: string): ChapterMetadata[] {
  const modules = getAllModules();
  const mod = modules.find((m) => m.id === moduleId);
  if (!mod) {
    return [];
  }

  // Find the module directory (could be module-X-slug or just match by slug)
  const modulesDir = path.join(contentDirectory, "modules");
  const moduleDirs = fs
    .readdirSync(modulesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  
  const moduleDir = moduleDirs.find((dir) => dir.includes(mod.slug));
  if (!moduleDir) {
    return [];
  }
  
  const chaptersDir = path.join(modulesDir, moduleDir, "chapters");

  if (!fs.existsSync(chaptersDir)) {
    return [];
  }

  const chapterDirs = fs
    .readdirSync(chaptersDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort();

  return chapterDirs
    .map((dir) => {
      const metaPath = path.join(chaptersDir, dir, "meta.json");
      if (!fs.existsSync(metaPath)) {
        return null;
      }
      const fileContents = fs.readFileSync(metaPath, "utf8");
      return JSON.parse(fileContents) as ChapterMetadata;
    })
    .filter((chapter): chapter is ChapterMetadata => chapter !== null)
    .sort((a, b) => a.order - b.order);
}

export function getLessonsByChapter(chapterId: string): LessonMetadata[] {
  const modules = getAllModules();
  for (const mod of modules) {
    const chapters = getChaptersByModule(mod.id);
    const chapter = chapters.find((c) => c.id === chapterId);
    if (chapter) {
      // Find the chapter directory
      const modulesDir = path.join(contentDirectory, "modules");
      const moduleDirs = fs
        .readdirSync(modulesDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
      
      const moduleDir = moduleDirs.find((dir) => dir.includes(mod.slug));
      if (!moduleDir) {
        return [];
      }
      
      const chaptersBaseDir = path.join(modulesDir, moduleDir, "chapters");
      const chapterDirs = fs
        .readdirSync(chaptersBaseDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
      
      const chapterDir = chapterDirs.find((dir) => dir.includes(chapter.slug));
      if (!chapterDir) {
        return [];
      }
      
      const lessonsDir = path.join(chaptersBaseDir, chapterDir, "lessons");

      if (!fs.existsSync(lessonsDir)) {
        return [];
      }

      const lessonDirs = fs
        .readdirSync(lessonsDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .sort();

      return lessonDirs
        .map((dir) => {
          const contentPath = path.join(lessonsDir, dir, "content.mdx");
          if (!fs.existsSync(contentPath)) {
            return null;
          }
          const fileContents = fs.readFileSync(contentPath, "utf8");
          const { data } = matter(fileContents);
          return data as LessonMetadata;
        })
        .filter((lesson): lesson is LessonMetadata => lesson !== null)
        .sort((a, b) => a.order - b.order);
    }
  }
  return [];
}

export function getAllLessons(): LessonMetadata[] {
  const modules = getAllModules();
  const allLessons: LessonMetadata[] = [];

  for (const mod of modules) {
    const chapters = getChaptersByModule(mod.id);
    for (const chapter of chapters) {
      const lessons = getLessonsByChapter(chapter.id);
      allLessons.push(...lessons);
    }
  }

  return allLessons;
}

export function getLessonBySlug(
  moduleSlug: string,
  chapterSlug: string,
  lessonSlug: string
): LessonContent | null {
  const mod = getModuleBySlug(moduleSlug);
  if (!mod) {
    return null;
  }

  const chapters = getChaptersByModule(mod.id);
  const chapter = chapters.find((c) => c.slug === chapterSlug);
  if (!chapter) {
    return null;
  }

  const lessons = getLessonsByChapter(chapter.id);
  const lesson = lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) {
    return null;
  }

  // Find paths using directory matching
  const modulesDir = path.join(contentDirectory, "modules");
  const moduleDirs = fs
    .readdirSync(modulesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  
  const moduleDir = moduleDirs.find((dir) => dir.includes(mod.slug));
  if (!moduleDir) {
    return null;
  }
  
  const chaptersBaseDir = path.join(modulesDir, moduleDir, "chapters");
  const chapterDirs = fs
    .readdirSync(chaptersBaseDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  
  const chapterDir = chapterDirs.find((dir) => dir.includes(chapter.slug));
  if (!chapterDir) {
    return null;
  }
  
  const lessonsBaseDir = path.join(chaptersBaseDir, chapterDir, "lessons");
  const lessonDirs = fs
    .readdirSync(lessonsBaseDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  
  const lessonDir = lessonDirs.find((dir) => dir.includes(lesson.slug));
  if (!lessonDir) {
    return null;
  }
  
  const contentPath = path.join(lessonsBaseDir, lessonDir, "content.mdx");

  if (!fs.existsSync(contentPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(contentPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    metadata: data as LessonMetadata,
    content,
  };
}

export function getNextLesson(
  currentLesson: LessonMetadata
): LessonMetadata | null {
  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);

  if (currentIndex === -1 || currentIndex === allLessons.length - 1) {
    return null;
  }

  return allLessons[currentIndex + 1];
}

export function getPrevLesson(
  currentLesson: LessonMetadata
): LessonMetadata | null {
  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);

  if (currentIndex <= 0) {
    return null;
  }

  return allLessons[currentIndex - 1];
}

