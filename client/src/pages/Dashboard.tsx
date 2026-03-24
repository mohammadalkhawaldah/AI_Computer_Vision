import Header from "@/components/Header";
import { coursesData } from "@/data/lessons";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import {
  Award,
  BarChart3,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const course = coursesData[0];
  const { getCompletedCount, getProgressPercentage, isLessonComplete } =
    useLessonProgress(course.lessons);

  const completedCount = getCompletedCount();
  const progressPercentage = getProgressPercentage();
  const totalLessons = course.lessons.length;
  const remainingLessons = totalLessons - completedCount;

  const totalDuration = course.lessons.reduce((acc, lesson) => {
    const minutes = parseInt(lesson.duration.split(" ")[0]);
    return acc + minutes;
  }, 0);

  const completedDuration = course.lessons.reduce((acc, lesson) => {
    if (isLessonComplete(lesson.id)) {
      const minutes = parseInt(lesson.duration.split(" ")[0]);
      return acc + minutes;
    }
    return acc;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header platformName={course.title} />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-600">
            Keep up the great work! You&apos;re making excellent progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Overall Progress</h3>
              <TrendingUp className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {progressPercentage}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {completedCount} of {totalLessons} lessons completed
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Lessons Completed</h3>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{completedCount}</p>
            <p className="text-xs text-gray-500">
              {remainingLessons} lessons remaining
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Time Spent Learning</h3>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{completedDuration}</p>
            <p className="text-xs text-gray-500">of {totalDuration} total minutes</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Current Streak</h3>
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">7</p>
            <p className="text-xs text-gray-500">days in a row</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Learning Progress</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-3">
              {course.lessons.map((lesson) => {
                const isComplete = isLessonComplete(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {isComplete ? (
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          isComplete ? "text-gray-600" : "text-gray-900"
                        }`}
                      >
                        {lesson.title}
                      </p>
                      <p className="text-xs text-gray-500">{lesson.duration}</p>
                    </div>
                    <button
                      onClick={() => setLocation("/lesson")}
                      className="px-3 py-1 text-xs font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
                    >
                      {isComplete ? "Review" : "Start"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Achievements</h2>

            <div className="space-y-4">
              <div className="p-4 border-2 border-yellow-300 rounded-lg bg-yellow-50">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-yellow-700 uppercase">
                    Trophy
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Quick Learner</p>
                    <p className="text-xs text-gray-600">Complete 5 lessons</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-2 border-gray-300 rounded-lg bg-gray-50 opacity-50">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-gray-700 uppercase">Star</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Star Student</p>
                    <p className="text-xs text-gray-600">Complete 10 lessons</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-2 border-gray-300 rounded-lg bg-gray-50 opacity-50">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-gray-700 uppercase">
                    Graduate
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Course Master</p>
                    <p className="text-xs text-gray-600">Complete all lessons</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-2 border-gray-300 rounded-lg bg-gray-50 opacity-50">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-gray-700 uppercase">Streak</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">On Fire</p>
                    <p className="text-xs text-gray-600">7-day learning streak</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Keep the Momentum Going!</h3>
          <p className="mb-6 text-red-100">
            You&apos;re {progressPercentage}% done. Complete the remaining lessons to
            get your certificate.
          </p>
          <button
            onClick={() => setLocation("/lesson")}
            className="px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:shadow-lg transition-all inline-block"
          >
            Continue Learning -&gt;
          </button>
        </div>
      </div>
    </div>
  );
}
