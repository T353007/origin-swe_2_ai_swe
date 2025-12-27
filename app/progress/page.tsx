import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressIndicator } from "@/components/course/ProgressIndicator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { getAllModules, getChaptersByModule, getLessonsByChapter } from "@/lib/content/loaders";
import { getModuleProgress, getOverallProgress } from "@/lib/progress/tracker-server";

export default function ProgressPage() {
  const modules = getAllModules();
  const overallProgress = getOverallProgress();

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
            <ProgressIndicator value={overallProgress} label="Course Completion" />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Module Progress</h2>
          {modules.map((module) => {
            const progress = getModuleProgress(module.id);
            const chapters = getChaptersByModule(module.id);
            
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
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium">{progress.completedLessons} of {progress.totalLessons} lessons completed</span>
                        <span className="text-muted-foreground">{progress.percentage}%</span>
                      </div>
                      <ProgressIndicator
                        value={progress.percentage}
                      />
                    </div>
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
