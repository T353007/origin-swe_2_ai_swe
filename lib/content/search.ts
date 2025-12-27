import { getAllModules, getAllLessons } from "./loaders";
import { getModuleBySlug, getChaptersByModule } from "./loaders";
import { SearchResult } from "@/types/content";
import MiniSearch from "minisearch";

let searchIndex: MiniSearch<SearchResult> | null = null;

export function buildSearchIndex(): MiniSearch<SearchResult> {
  const results: SearchResult[] = [];

  // Add modules
  const modules = getAllModules();
  for (const mod of modules) {
    results.push({
      type: "module",
      id: mod.id,
      title: mod.title,
      description: mod.description,
      url: `/learning-path/module/${mod.slug}`,
      moduleId: mod.id,
    });
  }

  // Add lessons
  const lessons = getAllLessons();
  for (const lesson of lessons) {
    const mod = modules.find((m) => m.id === lesson.moduleId);
    if (!mod) continue;

    const chapters = getChaptersByModule(mod.id);
    const chapter = chapters.find((c) => c.id === lesson.chapterId);
    if (!chapter) continue;

    results.push({
      type: "lesson",
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      url: `/learning-path/module/${mod.slug}/chapter/${chapter.slug}/lesson/${lesson.slug}`,
      moduleId: mod.id,
      chapterId: chapter.id,
    });
  }

  const index = new MiniSearch<SearchResult>({
    fields: ["title", "description"],
    storeFields: ["type", "id", "title", "description", "url", "moduleId", "chapterId"],
  });

  index.addAll(results);
  return index;
}

export function getSearchIndex(): MiniSearch<SearchResult> {
  if (!searchIndex) {
    searchIndex = buildSearchIndex();
  }
  return searchIndex;
}

export function search(query: string): SearchResult[] {
  const index = getSearchIndex();
  if (!query.trim()) {
    return [];
  }
  return index.search(query, { fuzzy: 0.2, prefix: true });
}

