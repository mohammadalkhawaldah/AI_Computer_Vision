import { BookOpen, PlayCircle } from "lucide-react";

export default function VideoPlayer({
  videoId,
  title,
  duration,
}: {
  videoId: string;
  title: string;
  duration: string;
}) {
  return (
    <div className="lesson-video">
      {videoId ? (
        <div className="video-frame">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="notebook-art">
          <div className="vision-box">
            <BookOpen size={32} strokeWidth={1.3} />
          </div>
          <span>READ. RUN. DISCOVER.</span>
        </div>
      )}
      <div className="video-caption">
        <span className="eyebrow">
          {videoId ? (
            <>
              <PlayCircle size={13} />
              VIDEO LESSON
            </>
          ) : (
            "GUIDED NOTEBOOK"
          )}
        </span>
        <h3>{title.replace(/^Chapter\s+\d+\s*-\s*/, "")}</h3>
        <p>{duration} · Self-paced learning</p>
      </div>
    </div>
  );
}
