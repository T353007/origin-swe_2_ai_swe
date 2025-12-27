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
  prevModule: ModuleMetadata;
  prevChapter: ChapterMetadata;
  nextModule: ModuleMetadata;
  nextChapter: ChapterMetadata;
}

export function LessonNavigation({
  currentLesson,
  prevLesson,
  nextLesson,
  module: mod,
  currentChapter,
  prevModule,
  prevChapter,
  nextModule,
  nextChapter,
}: LessonNavigationProps) {

  return (
    <nav className="flex items-center justify-between border-t pt-6 mt-8">
      <div>
        {prevLesson ? (
          <Link href={getLessonPath(prevModule, prevChapter, prevLesson)}>
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
          <Link href={getLessonPath(nextModule, nextChapter, nextLesson)}>
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

