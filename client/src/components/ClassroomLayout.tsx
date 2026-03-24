import LessonNotebook from "@/components/LessonNotebook";
import Sidebar from "@/components/Sidebar";
import VideoPlayer from "@/components/VideoPlayer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { coursesData, Lesson } from "@/data/lessons";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ClassroomLayoutProps {
  showLessonPager?: boolean;
}

export default function ClassroomLayout({
  showLessonPager = false,
}: ClassroomLayoutProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarHidden, setSidebarHidden] = useState(false);

  const course = coursesData[0];
  const { isLessonComplete, markLessonComplete, markLessonIncomplete } =
    useLessonProgress(course.lessons);

  useEffect(() => {
    if (course.lessons.length > 0 && !selectedLesson) {
      setSelectedLesson(course.lessons[0]);
    }
  }, [course.lessons, selectedLesson]);

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleMarkComplete = () => {
    if (!selectedLesson) return;

    if (isLessonComplete(selectedLesson.id)) {
      markLessonIncomplete(selectedLesson.id);
    } else {
      markLessonComplete(selectedLesson.id);
    }
  };

  const currentLesson = selectedLesson || course.lessons[0];
  const currentIndex = course.lessons.findIndex(
    (lesson) => lesson.id === currentLesson.id
  );
  const completedCount = course.lessons.filter((lesson) =>
    isLessonComplete(lesson.id)
  ).length;
  const progressPercentage = Math.round(
    (completedCount / Math.max(course.lessons.length, 1)) * 100
  );

  const handleNextLesson = () => {
    if (currentIndex < course.lessons.length - 1) {
      handleSelectLesson(course.lessons[currentIndex + 1]);
    }
  };

  const handlePreviousLesson = () => {
    if (currentIndex > 0) {
      handleSelectLesson(course.lessons[currentIndex - 1]);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-hidden">
        <div className="hidden lg:block h-full relative">
          {sidebarHidden ? (
            <button
              onClick={() => setSidebarHidden(false)}
              className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <PanelLeftOpen className="h-4 w-4" />
              Show Course Content
            </button>
          ) : null}

          <ResizablePanelGroup
            direction="horizontal"
            autoSaveId={
              sidebarHidden
                ? `classroom-layout-${showLessonPager ? "lesson" : "home"}-collapsed`
                : `classroom-layout-${showLessonPager ? "lesson" : "home"}`
            }
          >
            {!sidebarHidden ? (
              <>
                <ResizablePanel defaultSize={20} minSize={14} className="min-w-0">
                  <Sidebar
                    lessons={course.lessons}
                    selectedLesson={currentLesson}
                    onSelectLesson={handleSelectLesson}
                    isLessonComplete={isLessonComplete}
                    showLessonOverview
                  />
                </ResizablePanel>

                <ResizableHandle withHandle />
              </>
            ) : null}

            <ResizablePanel
              defaultSize={sidebarHidden ? 68 : 52}
              minSize={28}
              className="min-w-0"
            >
              <div className="h-full overflow-hidden flex flex-col min-h-0">
                <div className="px-6 py-3 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-900">
                      {currentLesson.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                      {currentLesson.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    {!sidebarHidden ? (
                      <button
                        onClick={() => setSidebarHidden(true)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-white transition-colors whitespace-nowrap"
                      >
                        <PanelLeftClose className="w-4 h-4" />
                        Hide Course Content
                      </button>
                    ) : null}
                    {currentLesson.colabUrl ? (
                      <a
                        href={currentLesson.colabUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in Colab
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="flex-1 overflow-hidden p-6 min-h-0">
                  <div className="h-full min-h-0 overflow-hidden">
                    <LessonNotebook lesson={currentLesson} />
                  </div>
                </div>

                {showLessonPager ? (
                  <div className="px-6 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <button
                      onClick={handlePreviousLesson}
                      disabled={currentIndex === 0}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="text-xs text-gray-600">
                      Lesson {currentIndex + 1} of {course.lessons.length}
                    </div>

                    <button
                      onClick={handleNextLesson}
                      disabled={currentIndex === course.lessons.length - 1}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : null}
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel
              defaultSize={sidebarHidden ? 32 : 28}
              minSize={18}
              className="min-w-0"
            >
              <div className="h-full overflow-y-auto p-6">
                <VideoPlayer
                  videoId={currentLesson.videoId}
                  title={currentLesson.title}
                  duration={currentLesson.duration}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <div className="lg:hidden h-full flex overflow-hidden">
          <div
            className={`${
              sidebarOpen ? "block" : "hidden"
            } w-80 border-r border-gray-200 overflow-hidden`}
          >
            <Sidebar
              lessons={course.lessons}
              selectedLesson={currentLesson}
              onSelectLesson={handleSelectLesson}
              isLessonComplete={isLessonComplete}
            />
          </div>

          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="px-6 py-3 border-b border-gray-200 bg-gradient-to-r from-red-50 to-white flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900">
                  {currentLesson.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                  {currentLesson.description}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-hidden p-4 min-h-0">
              <div className="h-full min-h-0 overflow-hidden flex flex-col gap-4">
                <div className="flex-1 min-h-0 overflow-hidden">
                  <LessonNotebook lesson={currentLesson} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-2">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex-1 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          {sidebarOpen ? "Hide" : "Show"} Content
        </button>
        {currentLesson.colabUrl ? (
          <a
            href={currentLesson.colabUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-2 text-center text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Open Colab
          </a>
        ) : null}
        <button
          onClick={handleMarkComplete}
          className="flex-1 px-3 py-2 text-xs font-medium bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all"
        >
          {isLessonComplete(currentLesson.id) ? "Done" : "Mark Complete"}
        </button>
      </div>
    </>
  );
}
