import { CheckCircle2, Circle, Clock, BookOpen } from "lucide-react";
import { Lesson } from "@/data/lessons";

interface LessonCardProps {
  lesson: Lesson;
  isSelected: boolean;
  isCompleted: boolean;
  onSelect: (lesson: Lesson) => void;
}

export default function LessonCard({
  lesson,
  isSelected,
  isCompleted,
  onSelect,
}: LessonCardProps) {
  return (
    <button
      onClick={() => onSelect(lesson)}
      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-start gap-3 group ${
        isSelected
          ? "bg-red-50 border-l-4 border-red-600 pl-3"
          : "hover:bg-gray-50"
      }`}
    >
      {/* Status Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <Circle
            className={`w-5 h-5 ${
              isSelected ? "text-red-600" : "text-gray-300"
            } group-hover:text-red-400 transition-colors`}
          />
        )}
      </div>

      {/* Lesson Info */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold truncate ${
            isSelected ? "text-red-600" : "text-gray-900 group-hover:text-red-600"
          }`}
        >
          {lesson.title}
        </p>
        <p className="text-xs text-gray-500 line-clamp-1 mt-1">
          {lesson.description}
        </p>
        <div className="flex items-center gap-1 mt-2">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500">{lesson.duration}</span>
        </div>
      </div>
    </button>
  );
}
