import { notFound } from "next/navigation";
import Link from "next/link";
import { getModuleBySlug, getChaptersByModule, getLessonsByChapter } from "@/lib/content/loaders";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "@/components/course/ProgressIndicator";
import { LessonCard } from "@/components/course/LessonCard";
import { formatTime } from "@/lib/utils";
import { getModuleProgress } from "@/lib/progress/tracker-server";
import { getLessonPath } from "@/lib/content/utils";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ModulePage({ params }: PageProps) {
  const { slug } = await params;
  const module = getModuleBySlug(slug);

  if (!module) {
    notFound();
  }

  const chapters = getChaptersByModule(module.id);
  const progress = getModuleProgress(module.id);

  return (
    <div className="container py-12">
      <Link href="/learning-path">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Learning Path
        </Button>
      </Link>

      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Badge className="mb-4">Module {module.order}</Badge>
          <h1 className="text-4xl font-bold mb-4">{module.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{module.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <div className="text-2xl font-bold">{formatTime(module.estimatedHours * 60)}</div>
              <div className="text-sm text-muted-foreground">Estimated Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{chapters.length}</div>
              <div className="text-sm text-muted-foreground">Chapters</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{progress.totalLessons}</div>
              <div className="text-sm text-muted-foreground">Lessons</div>
            </div>
          </div>

          <ProgressIndicator value={progress.percentage} label="Module Progress" />
        </div>

        {module.learningObjectives.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {module.learningObjectives.map((objective, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {module.prerequisites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Prerequisites</CardTitle>
              <CardDescription>
                Complete these modules before starting this one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {module.prerequisites.map((prereqId) => {
                  // In a real implementation, you'd look up the prerequisite module
                  return (
                    <Badge key={prereqId} variant="outline">
                      {prereqId}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Chapters</h2>
          {chapters.map((chapter) => {
            const lessons = getLessonsByChapter(chapter.id);
            return (
              <div key={chapter.id} className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{chapter.title}</h3>
                  <p className="text-muted-foreground mb-4">{chapter.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lessons.map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      module={module}
                      chapter={chapter}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

