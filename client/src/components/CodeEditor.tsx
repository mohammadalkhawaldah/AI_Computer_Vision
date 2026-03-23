import { Play, Copy, RotateCcw, Download } from "lucide-react";
import { useState } from "react";

interface CodeEditorProps {
  code: string;
  title: string;
  onCodeChange?: (code: string) => void;
}

export default function CodeEditor({
  code,
  title,
  onCodeChange,
}: CodeEditorProps) {
  const [displayCode, setDisplayCode] = useState(code);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setDisplayCode(code);
  };

  const handleCodeChange = (newCode: string) => {
    setDisplayCode(newCode);
    onCodeChange?.(newCode);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-md">
            Py
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
            <p className="text-xs text-gray-600">Interactive Python Environment</p>
          </div>
        </div>
        <button className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded hover:shadow-lg transition-all hover:from-orange-600 hover:to-orange-700">
          <Play className="w-3 h-3 inline mr-1" />
          Run
        </button>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">Python 3.11</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-600">Live Execution</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 text-gray-600 hover:bg-white rounded transition-colors"
              title="Copy code"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-gray-600 hover:bg-white rounded transition-colors"
              title="Reset code"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 text-gray-600 hover:bg-white rounded transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 overflow-hidden flex flex-col bg-gray-900">
          <textarea
            value={displayCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="flex-1 p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none border-none"
            spellCheck="false"
            style={{
              fontFamily: "'Fira Code', 'Courier New', monospace",
              lineHeight: "1.6",
            }}
          />
        </div>

        {/* Output Area */}
        <div className="h-32 border-t border-gray-200 bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-600 mb-2">Output:</p>
            <div className="bg-white rounded border border-gray-200 p-3 font-mono text-xs text-gray-700 min-h-20">
              <p className="text-gray-400">
                Click "Run" to execute the code and see the output here...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Environment Ready</span>
        </div>
        <button className="text-red-600 hover:text-red-700 font-medium">
          Clear Output
        </button>
      </div>

      {/* Copy Notification */}
      {copied && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-fade-in-out">
          ✓ Code copied to clipboard!
        </div>
      )}
    </div>
  );
}
