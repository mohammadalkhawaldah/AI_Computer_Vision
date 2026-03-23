import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";

interface JupyterEmbedProps {
  notebookCode: string;
  title: string;
}

export default function JupyterEmbed({
  notebookCode,
  title,
}: JupyterEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError("Failed to load JupyterLite environment");
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-md">
            J
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">JupyterLite</h3>
            <p className="text-xs text-gray-600">{title}</p>
          </div>
        </div>
        <a
          href="https://jupyterlite.readthedocs.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          Docs →
        </a>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative bg-gray-50">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Loading JupyterLite...
              </p>
              <p className="text-xs text-gray-500 mt-1">
                This may take a moment on first load
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
            <div className="text-center px-4">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-red-900">{error}</p>
              <p className="text-xs text-red-700 mt-2">
                Please try refreshing the page or using the code editor below
              </p>
            </div>
          </div>
        )}

        {/* JupyterLite Embed */}
        <iframe
          src="https://jupyterlite.github.io/demo/repl/index.html?kernel=python"
          width="100%"
          height="100%"
          frameBorder="0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          title="JupyterLite Python Environment"
          className="w-full h-full"
          style={{ border: "none" }}
        />
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 bg-blue-50 border-t border-gray-200 text-xs text-gray-600">
        <p>
          💡 <strong>Tip:</strong> Copy code from the editor and paste it here
          to run it interactively!
        </p>
      </div>
    </div>
  );
}
