import Link from "next/link";
import { ModuleMetadata } from "@/types/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/utils";

interface ModuleCardProps {
  module: ModuleMetadata;
  progress?: number;
}

export function ModuleCard({ module, progress = 0 }: ModuleCardProps) {
  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <Link href={`/learning-path/module/${module.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-lg cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl">{module.title}</CardTitle>
            <Badge variant="outline">Module {module.order}</Badge>
          </div>
          <CardDescription className="mt-2">{module.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{formatTime(module.estimatedHours * 60)}</span>
              <span>{progress}% complete</span>
            </div>
            {progress > 0 && (
              <Progress value={progress} className="h-2" />
            )}
            {module.learningObjectives.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Learning Objectives:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {module.learningObjectives.slice(0, 3).map((objective, idx) => (
                    <li key={idx}>• {objective}</li>
                  ))}
                  {module.learningObjectives.length > 3 && (
                    <li className="text-xs">+ {module.learningObjectives.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

