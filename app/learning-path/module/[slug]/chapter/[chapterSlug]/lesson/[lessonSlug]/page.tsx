import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getModuleBySlug,
  getChaptersByModule,
  getLessonsByChapter,
  getLessonBySlug,
  getNextLesson,
  getPrevLesson,
} from "@/lib/content/loaders";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LessonNavigation } from "@/components/course/LessonNavigation";
import { formatTime } from "@/lib/utils";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { getLessonPath } from "@/lib/content/utils";
import { LessonCompleteCheckbox } from "@/components/course/LessonCompleteCheckbox";

interface PageProps {
  params: Promise<{ slug: string; chapterSlug: string; lessonSlug: string }>;
}

const mdxComponents = {
  // Add custom MDX components here if needed
  h1: (props: any) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-semibold mt-6 mb-3" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-semibold mt-4 mb-2" {...props} />,
  p: (props: any) => <p className="mb-4 leading-7" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
  code: (props: any) => (
    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-muted rounded-lg p-4 overflow-x-auto mb-4" {...props} />
  ),
  a: (props: any) => (
    <a className="text-primary underline hover:text-primary/80" {...props} />
  ),
};

export default async function LessonPage({ params }: PageProps) {
  const { slug, chapterSlug, lessonSlug } = await params;

  const mod = getModuleBySlug(slug);
  if (!mod) {
    notFound();
  }

  const chapters = getChaptersByModule(mod.id);
  const chapter = chapters.find((c) => c.slug === chapterSlug);
  if (!chapter) {
    notFound();
  }

  const lessonData = getLessonBySlug(slug, chapterSlug, lessonSlug);
  if (!lessonData) {
    notFound();
  }

  const { metadata: lesson, content } = lessonData;
  const prevLesson = getPrevLesson(lesson);
  const nextLesson = getNextLesson(lesson);
  
  // Find chapter for navigation
  const allChapters = getChaptersByModule(mod.id);
  const prevChapter = prevLesson ? allChapters.find(c => c.id === prevLesson.chapterId) : null;
  const nextChapter = nextLesson ? allChapters.find(c => c.id === nextLesson.chapterId) : null;

  return (
    <div className="container py-12">
      <Link href={`/learning-path/module/${mod.slug}`}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Module
        </Button>
      </Link>

      <div className="max-w-4xl mx-auto">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="outline">Module {mod.order}</Badge>
              <Badge variant="outline">Chapter {chapter.order}</Badge>
              <Badge>{lesson.difficulty}</Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">{lesson.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{lesson.description}</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>{formatTime(lesson.estimatedMinutes)} read</span>
              <LessonCompleteCheckbox lessonId={lesson.id} />
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXRemote source={content} components={mdxComponents} />
          </div>

          <LessonNavigation
            currentLesson={lesson}
            prevLesson={prevLesson}
            nextLesson={nextLesson}
            module={mod}
            currentChapter={chapter}
            prevChapter={prevChapter || chapter}
            nextChapter={nextChapter || chapter}
          />
        </article>
      </div>
    </div>
  );
}

