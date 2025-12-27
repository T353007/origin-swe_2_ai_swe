export interface ModuleMetadata {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  estimatedHours: number;
  prerequisites: string[];
  learningObjectives: string[];
  icon?: string;
}

export interface ChapterMetadata {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  moduleId: string;
}

export interface LessonMetadata {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  chapterId: string;
  moduleId: string;
  prerequisites: string[];
  estimatedMinutes: number;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface LessonContent {
  metadata: LessonMetadata;
  content: string;
}

export interface ToolboxItem {
  id: string;
  title: string;
  category:
    | "agents"
    | "rag"
    | "evals"
    | "observability"
    | "vector-db"
    | "prompt-mgmt"
    | "guardrails"
    | "fine-tuning"
    | "data-pipelines"
    | "ci-cd"
    | "other";
  description: string;
  officialUrl: string;
  tags: string[];
  whenToUse: string[];
  alternatives: string[];
  content: string;
}

export interface SearchResult {
  type: "lesson" | "module" | "toolbox";
  id: string;
  title: string;
  description: string;
  url: string;
  moduleId?: string;
  chapterId?: string;
}

