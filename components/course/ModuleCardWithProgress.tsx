"use client";

import { useEffect, useState, useCallback } from "react";
import { ModuleCard } from "./ModuleCard";
import { ModuleMetadata } from "@/types/content";
import { isLessonComplete } from "@/lib/progress/tracker";

interface ModuleCardWithProgressProps {
  module: ModuleMetadata;
  lessonIds: string[];
}

export function ModuleCardWithProgress({ module, lessonIds }: ModuleCardWithProgressProps) {
  const [progress, setProgress] = useState(0);

  const calculateProgress = useCallback(() => {
    const totalLessons = lessonIds.length;
    if (totalLessons === 0) {
      setProgress(0);
      return;
    }

    const completedLessons = lessonIds.filter((lessonId) => isLessonComplete(lessonId)).length;
    const newProgress = Math.round((completedLessons / totalLessons) * 100);
    setProgress(newProgress);
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

  return <ModuleCard module={module} progress={progress} />;
}

