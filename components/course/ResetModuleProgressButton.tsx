"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { resetModuleProgress, isLessonComplete } from "@/lib/progress/tracker";

interface ResetModuleProgressButtonProps {
  lessonIds: string[];
  moduleTitle: string;
}

export function ResetModuleProgressButton({ lessonIds, moduleTitle }: ResetModuleProgressButtonProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [hasProgress, setHasProgress] = useState(false);

  const checkProgress = useCallback(() => {
    const hasAnyProgress = lessonIds.some((lessonId) => isLessonComplete(lessonId));
    setHasProgress(hasAnyProgress);
  }, [lessonIds]);

  useEffect(() => {
    checkProgress();
  }, [checkProgress]);

  // Listen for progress updates
  useEffect(() => {
    const handleProgressUpdate = () => {
      checkProgress();
    };

    window.addEventListener("progressUpdated", handleProgressUpdate);
    return () => {
      window.removeEventListener("progressUpdated", handleProgressUpdate);
    };
  }, [checkProgress]);

  const handleReset = () => {
    if (!confirm(`Are you sure you want to reset progress for "${moduleTitle}"? This will mark all lessons in this module as incomplete.`)) {
      return;
    }

    setIsResetting(true);
    resetModuleProgress(lessonIds);
    setIsResetting(false);
    // Progress will update via the event
  };

  // Don't show button if there's no progress to reset
  if (!hasProgress) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleReset}
      disabled={isResetting}
      className="gap-2"
    >
      <RotateCcw className="h-4 w-4" />
      {isResetting ? "Resetting..." : "Reset Progress"}
    </Button>
  );
}

