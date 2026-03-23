import { ArrowRight, Code2, BookOpen, Zap, Users, Award, Star } from "lucide-react";
import { useLocation } from "wouter";
import { coursesData, getLessonCells } from "@/data/lessons";

export default function Landing() {
  const [, setLocation] = useLocation();
  const course = coursesData[0];
  const lessonCount = course.lessons.length;
  const codeExampleCount = course.lessons.reduce(
    (count, lesson) =>
      count + getLessonCells(lesson).filter((cell) => cell.type === "code").length,
    0
  );

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Engineering AI Lab</h1>
            </div>
            <button
              onClick={() => setLocation("/lesson")}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:shadow-lg transition-all"
            >
              Enter Classroom
            </button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-br from-white via-red-50 to-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-red-100 rounded-full mb-6">
                <span className="text-sm font-semibold text-red-700">
                  Browser-based Python and computer vision practice
                </span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Train Students From Python Basics To YOLO Logic
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Students can open the platform, edit Python code directly in the
                notebook cells, and run lessons that cover backend logic,
                classification, image arrays, and detection workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setLocation("/lesson")}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                >
                  Start Learning Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setLocation("/dashboard")}
                  className="px-8 py-4 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
                >
                  View Student Progress
                </button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{lessonCount}</p>
                  <p className="text-sm text-gray-600 mt-1">Lessons</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{codeExampleCount}</p>
                  <p className="text-sm text-gray-600 mt-1">Code Examples</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600 mt-1">Passwords Needed</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-700/10 rounded-2xl blur-3xl" />
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
                <div className="space-y-3">
                  <div className="h-3 bg-gray-700 rounded w-1/3" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                  <div className="h-3 bg-gray-700 rounded w-2/3" />
                  <div className="pt-4 space-y-2">
                    <div className="h-2 bg-red-600/30 rounded w-full" />
                    <div className="h-2 bg-red-600/30 rounded w-5/6" />
                    <div className="h-2 bg-red-600/30 rounded w-4/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Engineering AI Lab?
            </h3>
            <p className="text-xl text-gray-600">
              A student-ready workspace for classroom computer vision training
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Interactive Coding</h4>
              <p className="text-gray-600">
                Students can edit and execute Python directly in the browser lesson notebook
              </p>
            </div>

            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Structured Curriculum</h4>
              <p className="text-gray-600">
                Lessons move from Python basics to backend classes, image arrays, and YOLO logic
              </p>
            </div>

            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Fast Practice Loops</h4>
              <p className="text-gray-600">
                Students can run examples repeatedly, change values, and inspect outputs immediately
              </p>
            </div>

            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Backend First</h4>
              <p className="text-gray-600">
                The material emphasizes functions, classes, validation, and model-ready data structures
              </p>
            </div>

            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Instructor Friendly</h4>
              <p className="text-gray-600">
                Built for teacher-led labs, demonstrations, homework practice, and classroom repetition
              </p>
            </div>

            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">No Login Friction</h4>
              <p className="text-gray-600">
                Students can enter the classroom directly without passwords or account setup for now
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32 bg-gradient-to-r from-red-600 to-red-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Ready To Start The Lab?</h3>
          <p className="text-xl text-red-100 mb-8">
            Open the classroom and let students begin coding from the first lesson
          </p>
          <button
            onClick={() => setLocation("/lesson")}
            className="px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:shadow-xl transition-all inline-flex items-center gap-2 group"
          >
            Open Classroom
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
