"use client";

import { useEffect, useState, useCallback } from "react";
import { ProgressIndicator } from "./ProgressIndicator";
import { isLessonComplete } from "@/lib/progress/tracker";

interface OverallProgressIndicatorProps {
  allLessonIds: string[];
  label?: string;
}

export function OverallProgressIndicator({ allLessonIds, label = "Course Completion" }: OverallProgressIndicatorProps) {
  const [percentage, setPercentage] = useState(0);

  const calculateProgress = useCallback(() => {
    const totalLessons = allLessonIds.length;
    if (totalLessons === 0) {
      setPercentage(0);
      return;
    }

    const completedLessons = allLessonIds.filter((lessonId) => isLessonComplete(lessonId)).length;
    const newPercentage = Math.round((completedLessons / totalLessons) * 100);
    setPercentage(newPercentage);
  }, [allLessonIds]);

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

  return <ProgressIndicator value={percentage} label={label} />;
}

