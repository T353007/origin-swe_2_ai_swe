"use client";

import MiniSearch from "minisearch";
import { SearchResult } from "@/types/content";

let searchIndex: MiniSearch<SearchResult> | null = null;

export function buildClientSearchIndex(items: SearchResult[]): MiniSearch<SearchResult> {
  const index = new MiniSearch<SearchResult>({
    fields: ["title", "description"],
    storeFields: ["type", "id", "title", "description", "url", "moduleId", "chapterId"],
  });

  index.addAll(items);
  return index;
}

export function searchClient(index: MiniSearch<SearchResult>, query: string): SearchResult[] {
  if (!query.trim()) {
    return [];
  }
  return index.search(query, { fuzzy: 0.2, prefix: true });
}

