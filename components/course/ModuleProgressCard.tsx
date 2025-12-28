"use client";

import { useEffect, useState, useCallback } from "react";
import { ProgressIndicator } from "./ProgressIndicator";
import { isLessonComplete } from "@/lib/progress/tracker";

interface ModuleProgressCardProps {
  lessonIds: string[];
}

export function ModuleProgressCard({ lessonIds }: ModuleProgressCardProps) {
  const [progress, setProgress] = useState({ percentage: 0, completedLessons: 0, totalLessons: lessonIds.length });

  const calculateProgress = useCallback(() => {
    const totalLessons = lessonIds.length;
    const completedLessons = lessonIds.filter((lessonId) => isLessonComplete(lessonId)).length;
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    setProgress({ percentage, completedLessons, totalLessons });
  }, [lessonIds]);

  useEffect(() => {
    calculateProgress();
  }, [calculateProgress]);

  // Listen for progress updates
  useEffect(() => {
    const handleProgressUpdate = () => {
      calculateProgress();
    };

    window.addEventListener("progressUpdated", handleProgressUpdate);
    return () => {
      window.removeEventListener("progressUpdated", handleProgressUpdate);
    };
  }, [calculateProgress]);

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="font-medium">
          {progress.completedLessons} of {progress.totalLessons} lessons completed
        </span>
        <span className="text-muted-foreground">{progress.percentage}%</span>
      </div>
      <ProgressIndicator value={progress.percentage} />
    </div>
  );
}

