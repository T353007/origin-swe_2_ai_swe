"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getProgress,
  markLessonComplete,
  markLessonIncomplete,
  isLessonComplete,
} from "@/lib/progress/tracker";
import { ProgressData } from "@/types/progress";

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(getProgress());

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    markLessonComplete(lessonId);
    setProgress(getProgress());
  }, []);

  const incompleteLesson = useCallback((lessonId: string) => {
    markLessonIncomplete(lessonId);
    setProgress(getProgress());
  }, []);

  const checkComplete = useCallback((lessonId: string) => {
    return isLessonComplete(lessonId);
  }, []);

  return {
    progress,
    completeLesson,
    incompleteLesson,
    checkComplete,
  };
}
