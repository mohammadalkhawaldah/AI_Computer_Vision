import { Bookmark, CheckCircle2, ExternalLink, MessageSquare, Share2 } from "lucide-react";
import { Lesson } from "@/data/lessons";

interface LessonContentProps {
  lesson: Lesson;
  isCompleted: boolean;
  onMarkComplete: () => void;
}

export default function LessonContent({
  lesson,
  isCompleted,
  onMarkComplete,
}: LessonContentProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
            <p className="text-gray-600 mt-2">{lesson.description}</p>
          </div>
          {isCompleted && (
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Completed</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Objectives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              ["Understand Core Concepts", "Master the fundamental principles"],
              ["Apply Practical Techniques", "Implement with real code examples"],
              ["Build Real Projects", "Create practical solutions"],
              ["Master Best Practices", "Learn industry standards"],
            ].map(([title, body]) => (
              <div key={title} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-red-600">OK</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{title}</p>
                  <p className="text-xs text-gray-600 mt-1">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Lesson Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600">Duration</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{lesson.duration}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Difficulty</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">Intermediate</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Language</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">Python 3.11</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Status</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {isCompleted ? "Done" : "In Progress"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onMarkComplete}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              isCompleted
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg hover:from-red-700 hover:to-red-800"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
          </button>
          <button className="flex-1 px-4 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <Bookmark className="w-4 h-4" />
            Save for Later
          </button>
          <button className="flex-1 px-4 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          {lesson.colabUrl ? (
            <a
              href={lesson.colabUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 rounded-lg font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Colab
            </a>
          ) : null}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-gray-900">Discussion</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Have questions or want to discuss this lesson? Join our community
            forum!
          </p>
          <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors">
            Join Discussion -&gt;
          </button>
        </div>
      </div>
    </div>
  );
}
