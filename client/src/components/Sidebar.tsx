import { CheckCircle2, Circle, Clock, ChevronDown } from "lucide-react";
import { Lesson } from "@/data/lessons";
import { useState } from "react";

interface SidebarProps {
  lessons: Lesson[];
  selectedLesson: Lesson | null;
  onSelectLesson: (lesson: Lesson) => void;
  isLessonComplete?: (lessonId: number) => boolean;
  showLessonOverview?: boolean;
}

export default function Sidebar({
  lessons,
  selectedLesson,
  onSelectLesson,
  isLessonComplete,
  showLessonOverview = false,
}: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>([1]);

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Group lessons by sections (every 5 lessons)
  const sections = [];
  for (let i = 0; i < lessons.length; i += 5) {
    sections.push({
      id: Math.floor(i / 5) + 1,
      title: `Section ${Math.floor(i / 5) + 1}`,
      lessons: lessons.slice(i, i + 5),
    });
  }

  const lessonCompleted = (lesson: Lesson) =>
    isLessonComplete ? isLessonComplete(lesson.id) : lesson.completed;

  const completedCount = lessons.filter((lesson) => lessonCompleted(lesson)).length;
  const progressPercentage = Math.round((completedCount / lessons.length) * 100);

  return (
    <aside className="w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-red-100">
        <h2 className="font-bold text-gray-900 text-lg">Course Content</h2>
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Progress</span>
            <span className="text-xs font-bold text-red-600">
              {completedCount}/{lessons.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">{progressPercentage}% Complete</p>
        </div>
      </div>

      {/* Lessons List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {showLessonOverview && selectedLesson ? (
            <div className="mb-3 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                Lesson Overview
              </p>
              <p className="text-sm text-gray-700 mt-2">{selectedLesson.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
                <span className="px-2 py-1 rounded-md bg-gray-100">
                  Duration: {selectedLesson.duration}
                </span>
                <span className="px-2 py-1 rounded-md bg-gray-100">
                  Python 3.11 practice
                </span>
                <span className="px-2 py-1 rounded-md bg-gray-100">
                  {lessonCompleted(selectedLesson) ? "Completed" : "In progress"}
                </span>
              </div>
            </div>
          ) : null}

          {sections.map((section) => (
            <div key={section.id} className="mb-2">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="font-semibold text-sm">{section.title}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedSections.includes(section.id) ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Lessons */}
              {expandedSections.includes(section.id) && (
                <div className="space-y-1 mt-1">
                  {section.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-200 flex items-start gap-3 group ${
                        selectedLesson?.id === lesson.id
                          ? "bg-red-50 border-l-4 border-red-600 pl-2.5"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Status Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {lessonCompleted(lesson) ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle
                            className={`w-5 h-5 ${
                              selectedLesson?.id === lesson.id
                                ? "text-red-600"
                                : "text-gray-300"
                            } group-hover:text-red-400 transition-colors`}
                          />
                        )}
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            selectedLesson?.id === lesson.id
                              ? "text-red-600"
                              : "text-gray-900 group-hover:text-red-600"
                          }`}
                        >
                          {lesson.title}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {lesson.duration}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:shadow-lg transition-all hover:from-red-700 hover:to-red-800">
          Download Certificate
        </button>
      </div>
    </aside>
  );
}
