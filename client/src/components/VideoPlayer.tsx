import { Maximize2, Play, Settings, Volume2 } from "lucide-react";
import { useState } from "react";

interface VideoPlayerProps {
  videoId: string;
  title: string;
  duration: string;
}

export default function VideoPlayer({
  videoId,
  title,
  duration,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="relative bg-black aspect-video flex items-center justify-center group overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />

        {!isPlaying && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button
              onClick={() => setIsPlaying(true)}
              className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            </button>
          </div>
        )}

        <div className="absolute bottom-3 right-3 text-xs font-semibold text-white bg-black/70 px-2 py-1 rounded">
          {duration}
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2">{title}</h3>
        <p className="text-xs text-gray-600">Duration: {duration}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-2">
              What You&apos;ll Learn
            </h4>
            <ul className="text-xs text-gray-600 space-y-1.5">
              <li className="flex gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Understand core concepts and fundamentals</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Apply practical techniques with code examples</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Build real-world projects and solutions</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Master best practices and optimization</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white rounded transition-colors">
                <Volume2 className="w-4 h-4" />
                <span>Audio</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white rounded transition-colors">
                <Maximize2 className="w-4 h-4" />
                <span>Fullscreen</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white rounded transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          <button className="w-full py-2 px-3 bg-white border border-gray-200 text-gray-900 text-xs font-medium rounded hover:bg-gray-100 transition-colors">
            Show Transcript
          </button>
        </div>
      </div>
    </div>
  );
}
