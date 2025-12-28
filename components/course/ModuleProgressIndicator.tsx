"use client";

import { useEffect, useState, useCallback } from "react";
import { ProgressIndicator } from "./ProgressIndicator";
import { isLessonComplete } from "@/lib/progress/tracker";

interface ModuleProgressIndicatorProps {
  lessonIds: string[];
  label?: string;
}

export function ModuleProgressIndicator({ lessonIds, label = "Module Progress" }: ModuleProgressIndicatorProps) {
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

    // Listen for custom events when progress changes
    window.addEventListener("progressUpdated", handleProgressUpdate);

    return () => {
      window.removeEventListener("progressUpdated", handleProgressUpdate);
    };
  }, [calculateProgress]);

  return <ProgressIndicator value={percentage} label={label} />;
}

