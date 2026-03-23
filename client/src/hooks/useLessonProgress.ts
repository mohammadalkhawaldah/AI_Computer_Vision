import { useState, useEffect } from "react";
import { Lesson } from "@/data/lessons";

export function useLessonProgress(lessons: Lesson[]) {
  const [lessonProgress, setLessonProgress] = useState<Record<number, boolean>>(
    {}
  );

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("lessonProgress");
    if (saved) {
      try {
        setLessonProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load lesson progress:", e);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("lessonProgress", JSON.stringify(lessonProgress));
  }, [lessonProgress]);

  const markLessonComplete = (lessonId: number) => {
    setLessonProgress((prev) => ({
      ...prev,
      [lessonId]: true,
    }));
  };

  const markLessonIncomplete = (lessonId: number) => {
    setLessonProgress((prev) => ({
      ...prev,
      [lessonId]: false,
    }));
  };

  const getCompletedCount = () => {
    return Object.values(lessonProgress).filter(Boolean).length;
  };

  const getProgressPercentage = () => {
    if (lessons.length === 0) return 0;
    return Math.round((getCompletedCount() / lessons.length) * 100);
  };

  const isLessonComplete = (lessonId: number) => {
    return lessonProgress[lessonId] || false;
  };

  return {
    lessonProgress,
    markLessonComplete,
    markLessonIncomplete,
    getCompletedCount,
    getProgressPercentage,
    isLessonComplete,
  };
}
