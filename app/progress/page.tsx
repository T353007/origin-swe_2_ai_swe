import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { getAllModules, getChaptersByModule, getLessonsByChapter } from "@/lib/content/loaders";
import { OverallProgressIndicator } from "@/components/course/OverallProgressIndicator";
import { ModuleProgressCard } from "@/components/course/ModuleProgressCard";

export default function ProgressPage() {
  const modules = getAllModules();
  
  // Get all lesson IDs for overall progress
  const allLessonIds = modules.flatMap((module) => {
    const chapters = getChaptersByModule(module.id);
    return chapters.flatMap((chapter) => {
      const lessons = getLessonsByChapter(chapter.id);
      return lessons.map((lesson) => lesson.id);
    });
  });

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Your Progress</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>Track your journey through the course</CardDescription>
          </CardHeader>
          <CardContent>
            <OverallProgressIndicator allLessonIds={allLessonIds} label="Course Completion" />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Module Progress</h2>
          {modules.map((module) => {
            const chapters = getChaptersByModule(module.id);
            const lessonIds = chapters.flatMap((chapter) => {
              const lessons = getLessonsByChapter(chapter.id);
              return lessons.map((lesson) => lesson.id);
            });
            
            return (
              <Card key={module.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{module.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {module.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">Module {module.order}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ModuleProgressCard lessonIds={lessonIds} />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatTime(module.estimatedHours * 60)} estimated</span>
                      <Link href={`/learning-path/module/${module.slug}`}>
                        <Button variant="outline" size="sm">
                          Continue
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
