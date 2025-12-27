import { getAllModules } from "@/lib/content/loaders";
import { getTotalLessons, getTotalEstimatedHours } from "@/lib/content/utils";
import { formatTime } from "@/lib/utils";
import { ModuleCard } from "@/components/course/ModuleCard";
import { getModuleProgress } from "@/lib/progress/tracker-server";
import { ProgressIndicator } from "@/components/course/ProgressIndicator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LearningPathPage() {
  const modules = getAllModules();
  const totalLessons = getTotalLessons();
  const totalHours = getTotalEstimatedHours();

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Learning Path</h1>
          <p className="text-xl text-muted-foreground">
            A comprehensive journey from AI fundamentals to production engineering
          </p>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
            <CardDescription>
              Your complete path to becoming an AI engineer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <div className="text-3xl font-bold">{modules.length}</div>
                <div className="text-sm text-muted-foreground">Modules</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{totalLessons}</div>
                <div className="text-sm text-muted-foreground">Lessons</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{formatTime(totalHours * 60)}</div>
                <div className="text-sm text-muted-foreground">Estimated Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Modules</h2>
          <div className="space-y-6">
            {modules.map((module, index) => {
              const progress = getModuleProgress(module.id);
              return (
                <div key={module.id} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {module.order}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{module.title}</h3>
                      <p className="text-muted-foreground">{module.description}</p>
                      <div className="mt-2">
                        <ProgressIndicator
                          value={progress.percentage}
                          showPercentage
                        />
                      </div>
                    </div>
                  </div>
                  <div className="ml-14">
                    <ModuleCard module={module} progress={progress.percentage} />
                  </div>
                  {index < modules.length - 1 && (
                    <div className="ml-5 border-l-2 border-border h-8" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

