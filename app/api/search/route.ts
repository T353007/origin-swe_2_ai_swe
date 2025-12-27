import { NextRequest, NextResponse } from "next/server";
import { getAllModules, getAllLessons } from "@/lib/content/loaders";
import { getChaptersByModule } from "@/lib/content/loaders";
import { SearchResult } from "@/types/content";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase();

  // Search modules
  const modules = getAllModules();
  for (const mod of modules) {
    if (
      mod.title.toLowerCase().includes(queryLower) ||
      mod.description.toLowerCase().includes(queryLower)
    ) {
      results.push({
        type: "module",
        id: mod.id,
        title: mod.title,
        description: mod.description,
        url: `/learning-path/module/${mod.slug}`,
        moduleId: mod.id,
      });
    }
  }

  // Search lessons
  const lessons = getAllLessons();
  for (const lesson of lessons) {
    if (
      lesson.title.toLowerCase().includes(queryLower) ||
      lesson.description.toLowerCase().includes(queryLower) ||
      lesson.tags.some((tag) => tag.toLowerCase().includes(queryLower))
    ) {
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
  }

  // Sort results by relevance (exact title matches first, then description matches)
  results.sort((a, b) => {
    const aTitleMatch = a.title.toLowerCase().includes(queryLower);
    const bTitleMatch = b.title.toLowerCase().includes(queryLower);
    if (aTitleMatch && !bTitleMatch) return -1;
    if (!aTitleMatch && bTitleMatch) return 1;
    return 0;
  });

  return NextResponse.json({ results });
}

