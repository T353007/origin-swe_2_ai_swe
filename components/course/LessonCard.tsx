import Link from "next/link";
import { LessonMetadata, ModuleMetadata, ChapterMetadata } from "@/types/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { getLessonPath } from "@/lib/content/utils";

interface LessonCardProps {
  lesson: LessonMetadata;
  module: ModuleMetadata;
  chapter: ChapterMetadata;
  isComplete?: boolean;
}

export function LessonCard({ lesson, module, chapter, isComplete = false }: LessonCardProps) {
  const difficultyColors: Record<string, "default" | "secondary" | "outline"> = {
    beginner: "default",
    intermediate: "secondary",
    advanced: "outline",
  };

  return (
    <Link href={getLessonPath(module, chapter, lesson)}>
      <Card className="transition-shadow hover:shadow-md cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 flex-1">
              {isComplete ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg line-clamp-2">{lesson.title}</CardTitle>
              </div>
            </div>
          </div>
          <CardDescription className="mt-2 line-clamp-2">
            {lesson.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant={difficultyColors[lesson.difficulty]}>
                {lesson.difficulty}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {formatTime(lesson.estimatedMinutes)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

