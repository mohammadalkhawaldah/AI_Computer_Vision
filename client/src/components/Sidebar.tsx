import { ArrowUpRight, Check, Clock, BookOpen } from "lucide-react";
import type { Lesson } from "@/data/lessons";

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
}: SidebarProps) {
  const done = (lesson: Lesson) =>
    isLessonComplete ? isLessonComplete(lesson.id) : lesson.completed;
  const count = lessons.filter(done).length;
  const progress = Math.round((count / Math.max(lessons.length, 1)) * 100);
  return (
    <aside className="course-sidebar">
      <div className="panel-heading">
        <span className="eyebrow">THE LEARNING PATH</span>
        <h2>Computer vision</h2>
        <p>From foundations to intelligent systems.</p>
      </div>
      <div className="course-progress">
        <div>
          <span>Your progress</span>
          <strong>{progress}%</strong>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Course progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
        <p>
          {count} of {lessons.length} lessons completed
        </p>
      </div>
      <nav className="course-lessons" aria-label="Course lessons">
        <span className="eyebrow">COURSE CONTENT</span>
        {lessons.map(lesson => (
          <button
            key={lesson.id}
            className={`course-lesson ${selectedLesson?.id === lesson.id ? "is-active" : ""}`}
            aria-current={selectedLesson?.id === lesson.id ? "page" : undefined}
            onClick={() => onSelectLesson(lesson)}
          >
            <span className={`chapter-number ${done(lesson) ? "is-done" : ""}`}>
              {done(lesson) ? (
                <Check size={16} />
              ) : (
                String(lesson.id).padStart(2, "0")
              )}
            </span>
            <span className="chapter-info">
              <span className="chapter-kicker">CHAPTER {lesson.id}</span>
              <strong>
                {lesson.title.replace(/^Chapter\s+\d+\s*-\s*/, "")}
              </strong>
              <span className="chapter-time">
                <Clock size={12} />
                {lesson.duration}
              </span>
            </span>
            {selectedLesson?.id === lesson.id && (
              <ArrowUpRight className="lesson-arrow" size={16} />
            )}
          </button>
        ))}
      </nav>
      <div className="sidebar-note">
        <BookOpen size={19} />
        <div>
          <strong>Learn by doing</strong>
          <p>Small experiments. Lasting understanding.</p>
        </div>
      </div>
    </aside>
  );
}
