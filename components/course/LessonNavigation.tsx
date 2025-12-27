import Link from "next/link";
import { LessonMetadata, ModuleMetadata, ChapterMetadata } from "@/types/content";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getLessonPath } from "@/lib/content/utils";

interface LessonNavigationProps {
  currentLesson: LessonMetadata;
  prevLesson: LessonMetadata | null;
  nextLesson: LessonMetadata | null;
  module: ModuleMetadata;
  currentChapter: ChapterMetadata;
  prevChapter: ChapterMetadata;
  nextChapter: ChapterMetadata;
}

export function LessonNavigation({
  currentLesson,
  prevLesson,
  nextLesson,
  module,
  currentChapter,
  prevChapter,
  nextChapter,
}: LessonNavigationProps) {

  return (
    <nav className="flex items-center justify-between border-t pt-6 mt-8">
      <div>
        {prevLesson ? (
          <Link href={getLessonPath(module, prevChapter, prevLesson)}>
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>

      <div>
        {nextLesson ? (
          <Link href={getLessonPath(module, nextChapter, nextLesson)}>
            <Button variant="default" size="sm">
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}

