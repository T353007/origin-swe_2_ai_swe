import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getModuleBySlug,
  getChaptersByModule,
  getLessonsByChapter,
  getLessonBySlug,
  getNextLesson,
  getPrevLesson,
  getAllModules,
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
import { CodeBlock } from "@/components/ui/CodeBlock";

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
  ol: (props: any) => <ol className="mb-4" {...props} />,
  li: (props: any) => <li className="mb-2 leading-7" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 dark:border-blue-400 pl-4 pr-4 py-3 my-6 italic text-gray-800 dark:text-gray-200 rounded-r" {...props} />
  ),
  code: (props: any) => {
    // If code is inside a pre tag, it will be handled by the pre component
    // Otherwise, render as inline code
    if (props.className) {
      // This is a code block, return as-is to be handled by pre
      return <code {...props} />;
    }
    return (
      <code className="bg-gray-100 dark:bg-muted text-gray-900 dark:text-foreground px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
    );
  },
  pre: (props: any) => {
    // Check if pre contains a code element with className (code block)
    const codeElement = props.children;
    if (codeElement && typeof codeElement === "object" && codeElement.props?.className) {
      return <CodeBlock>{codeElement}</CodeBlock>;
    }
    // Fallback for plain pre tags
    return (
      <pre className="bg-gray-100 dark:bg-muted text-gray-900 dark:text-foreground rounded-lg p-4 overflow-x-auto mb-4" {...props} />
    );
  },
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
  
  // Find module and chapter for prev/next lessons (may be in different modules)
  const prevModule = prevLesson ? getAllModules().find(m => m.id === prevLesson.moduleId) : null;
  const nextModule = nextLesson ? getAllModules().find(m => m.id === nextLesson.moduleId) : null;
  const prevChapter = prevLesson && prevModule ? getChaptersByModule(prevModule.id).find(c => c.id === prevLesson.chapterId) : null;
  const nextChapter = nextLesson && nextModule ? getChaptersByModule(nextModule.id).find(c => c.id === nextLesson.chapterId) : null;

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
            prevModule={prevModule || mod}
            prevChapter={prevChapter || chapter}
            nextModule={nextModule || mod}
            nextChapter={nextChapter || chapter}
          />
        </article>
      </div>
    </div>
  );
}

