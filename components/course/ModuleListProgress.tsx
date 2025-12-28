"use client";

import { useEffect, useState, useCallback } from "react";
import { ProgressIndicator } from "./ProgressIndicator";
import { isLessonComplete } from "@/lib/progress/tracker";

interface ModuleListProgressProps {
  lessonIds: string[];
}

export function ModuleListProgress({ lessonIds }: ModuleListProgressProps) {
  const [percentage, setPercentage] = useState(0);

  const calculateProgress = useCallback(() => {
    const totalLessons = lessonIds.length;
    if (totalLessons === 0) {
      setPercentage(0);
      return;
    }

    const completedLessons = lessonIds.filter((lessonId) => isLessonComplete(lessonId)).length;
    const newPercentage = Math.round((completedLessons / totalLessons) * 100);
    setPercentage(newPercentage);
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

  return <ProgressIndicator value={percentage} showPercentage />;
}

