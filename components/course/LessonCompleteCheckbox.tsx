"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useProgress } from "@/hooks/useProgress";

interface LessonCompleteCheckboxProps {
  lessonId: string;
}

export function LessonCompleteCheckbox({ lessonId }: LessonCompleteCheckboxProps) {
  const { checkComplete, completeLesson, incompleteLesson } = useProgress();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setIsComplete(checkComplete(lessonId));
  }, [lessonId, checkComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked) {
      completeLesson(lessonId);
    } else {
      incompleteLesson(lessonId);
    }
    setIsComplete(checked);
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <Checkbox checked={isComplete} onChange={handleChange} />
      <span className="text-sm">Mark as complete</span>
    </label>
  );
}

