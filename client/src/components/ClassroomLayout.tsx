import LessonNotebook from "@/components/LessonNotebook";
import Sidebar from "@/components/Sidebar";
import VideoPlayer from "@/components/VideoPlayer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { coursesData, getLessonCells, type Lesson } from "@/data/lessons";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  PanelLeft,
  PanelRight,
  RotateCcw,
  Maximize2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ImperativePanelGroupHandle } from "react-resizable-panels";

export default function ClassroomLayout({
  showLessonPager = false,
}: {
  showLessonPager?: boolean;
}) {
  const course = coursesData[0];
  const [currentLesson, setCurrentLesson] = useState(course.lessons[0]);
  const [showCourse, setShowCourse] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [mobilePanel, setMobilePanel] = useState<"course" | "details" | null>(
    null
  );
  const [desktop, setDesktop] = useState(
    () => window.matchMedia("(min-width: 1100px)").matches
  );
  const panelGroup = useRef<ImperativePanelGroupHandle>(null);
  const { isLessonComplete, markLessonComplete, markLessonIncomplete } =
    useLessonProgress(course.lessons);
  const currentIndex = course.lessons.findIndex(
    lesson => lesson.id === currentLesson.id
  );
  const cells = getLessonCells(currentLesson);
  const completed = isLessonComplete(currentLesson.id);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1100px)");
    const update = () => setDesktop(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const selectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setMobilePanel(null);
  };
  const toggleComplete = () =>
    completed
      ? markLessonIncomplete(currentLesson.id)
      : markLessonComplete(currentLesson.id);
  const resetLayout = () => {
    if (showCourse && showDetails) panelGroup.current?.setLayout([21, 56, 23]);
    else {
      setShowCourse(true);
      setShowDetails(true);
      requestAnimationFrame(() => panelGroup.current?.setLayout([21, 56, 23]));
    }
  };
  const courseContent = (
    <Sidebar
      lessons={course.lessons}
      selectedLesson={currentLesson}
      onSelectLesson={selectLesson}
      isLessonComplete={isLessonComplete}
    />
  );
  const details = (
    <aside className="lesson-details">
      <div className="panel-heading">
        <span className="eyebrow">YOUR LEARNING COMPANION</span>
        <h2>Lesson guide</h2>
      </div>
      <VideoPlayer
        videoId={currentLesson.videoId}
        title={currentLesson.title}
        duration={currentLesson.duration}
      />
      <div className="guide-section">
        <span className="eyebrow">IN THIS NOTEBOOK</span>
        <h3>{cells.filter(c => c.type === "code").length} code exercises</h3>
        <p>Read each explanation, then work through the code in order.</p>
      </div>
      <div className="guide-section">
        <span className="eyebrow">YOUR WORKSPACE</span>
        <h3>Make room to explore.</h3>
        <p>
          Drag the dividers to resize each panel. Hide the side panels for a
          focused reading view. Your panel widths are saved on this browser.
        </p>
        <p className="keyboard-tip">
          Keyboard: focus a divider and use the arrow keys.
        </p>
      </div>
      <button
        className={`lab-button complete-button ${completed ? "is-complete" : ""}`}
        onClick={toggleComplete}
      >
        <Check size={16} />
        {completed ? "Completed · mark incomplete" : "Mark lesson complete"}
      </button>
    </aside>
  );
  const notebook = (
    <main className="lesson-main">
      <div className="lesson-heading">
        <div className="lesson-heading-top">
          <span className="eyebrow">
            COMPUTER VISION / CHAPTER {currentLesson.id}
          </span>
          <span className="lesson-duration">{currentLesson.duration}</span>
        </div>
        <h1>{currentLesson.title.replace(/^Chapter\s+\d+\s*-\s*/, "")}</h1>
        <div className="lesson-heading-bottom">
          <p>Learn the concepts. Experiment with code.</p>
          {currentLesson.colabUrl && (
            <a
              className="lab-button colab-button"
              href={currentLesson.colabUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Colab <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
      <div className="notebook-container">
        <LessonNotebook lesson={currentLesson} />
      </div>
      {showLessonPager && (
        <footer className="lesson-pager">
          <button
            className="lab-button"
            disabled={currentIndex === 0}
            onClick={() => selectLesson(course.lessons[currentIndex - 1])}
          >
            <ChevronLeft size={15} />
            Previous
          </button>
          <span>
            {String(currentIndex + 1).padStart(2, "0")}{" "}
            <span className="muted">
              / {String(course.lessons.length).padStart(2, "0")} lessons
            </span>
          </span>
          <button
            className="lab-button"
            disabled={currentIndex === course.lessons.length - 1}
            onClick={() => selectLesson(course.lessons[currentIndex + 1])}
          >
            Next lesson
            <ChevronRight size={15} />
          </button>
        </footer>
      )}
    </main>
  );

  return (
    <div className="classroom-workspace">
      <div className="workspace-toolbar">
        <div className="workspace-label">
          <span className="status-dot" />
          Learning workspace
          <span className="toolbar-hint">Drag dividers to resize</span>
        </div>
        <div className="workspace-actions">
          <button
            className="lab-button"
            aria-pressed={desktop ? showCourse : mobilePanel === "course"}
            onClick={() =>
              desktop
                ? setShowCourse(!showCourse)
                : setMobilePanel(mobilePanel === "course" ? null : "course")
            }
          >
            <PanelLeft size={15} />
            Course
          </button>
          <button
            className="lab-button"
            aria-pressed={desktop ? showDetails : mobilePanel === "details"}
            onClick={() =>
              desktop
                ? setShowDetails(!showDetails)
                : setMobilePanel(mobilePanel === "details" ? null : "details")
            }
          >
            <PanelRight size={15} />
            Guide
          </button>
          {desktop && (
            <>
              <button
                className="lab-button icon-button"
                title="Focus mode"
                aria-label="Focus mode"
                aria-pressed={!showCourse && !showDetails}
                onClick={() => {
                  const focus = showCourse || showDetails;
                  setShowCourse(!focus);
                  setShowDetails(!focus);
                }}
              >
                <Maximize2 size={15} />
              </button>
              <button
                className="lab-button icon-button"
                title="Reset panel widths"
                aria-label="Reset panel widths"
                onClick={resetLayout}
              >
                <RotateCcw size={15} />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="workspace-panels">
        {desktop ? (
          <ResizablePanelGroup
            ref={panelGroup}
            direction="horizontal"
            autoSaveId={`lab-v2-${showCourse}-${showDetails}`}
          >
            {showCourse && (
              <>
                <ResizablePanel
                  id="course"
                  order={1}
                  defaultSize={21}
                  minSize={16}
                  maxSize={34}
                >
                  {courseContent}
                </ResizablePanel>
                <ResizableHandle
                  className="lab-divider"
                  withHandle
                  aria-label="Resize course panel"
                />
              </>
            )}
            <ResizablePanel
              id="notebook"
              order={2}
              defaultSize={showCourse && showDetails ? 56 : 77}
              minSize={35}
            >
              {notebook}
            </ResizablePanel>
            {showDetails && (
              <>
                <ResizableHandle
                  className="lab-divider"
                  withHandle
                  aria-label="Resize lesson guide"
                />
                <ResizablePanel
                  id="guide"
                  order={3}
                  defaultSize={23}
                  minSize={17}
                  maxSize={36}
                >
                  {details}
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        ) : (
          <>
            <div
              className={
                mobilePanel ? "mobile-notebook-hidden" : "mobile-notebook"
              }
            >
              {notebook}
            </div>
            {mobilePanel && (
              <section className="mobile-panel">
                <button
                  className="lab-button mobile-back"
                  onClick={() => setMobilePanel(null)}
                >
                  <ChevronLeft size={16} />
                  Back to notebook
                </button>
                {mobilePanel === "course" ? courseContent : details}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
