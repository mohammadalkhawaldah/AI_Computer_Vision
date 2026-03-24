import { getLessonCells, type Lesson } from "@/data/lessons";
import { Copy, Eraser, Loader2, Play, RotateCcw } from "lucide-react";
import { Fragment, type ReactNode, useEffect, useMemo, useRef, useState } from "react";

interface LessonNotebookProps {
  lesson: Lesson;
}

interface CellOutput {
  text: string;
  images: string[];
}

interface PyodideGlobals {
  set: (key: string, value: unknown) => void;
  delete?: (key: string) => void;
}

interface PyodideRuntime {
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: PyodideGlobals;
  loadPackage?: (packages: string | string[]) => Promise<unknown>;
}

declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<PyodideRuntime>;
  }
}

const PYODIDE_VERSION = "0.27.2";
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const PYODIDE_SCRIPT_URL = `${PYODIDE_INDEX_URL}pyodide.js`;
const BROWSER_UNSUPPORTED_PACKAGES = new Set([
  "torch",
  "torchvision",
  "torchaudio",
  "opencv-python",
  "opencv-contrib-python",
  "tensorflow",
]);

let pyodideScriptPromise: Promise<void> | null = null;
let pyodideRuntimePromise: Promise<PyodideRuntime> | null = null;
const installedPackages = new Set<string>();

function tokenizeCommand(command: string) {
  const matches = command.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? [];
  return matches.map((token) => token.replace(/^['"]|['"]$/g, ""));
}

function extractPackagesFromPipArgs(args: string) {
  const tokens = tokenizeCommand(args);
  const installIndex = tokens.indexOf("install");
  if (installIndex < 0) return [];

  return tokens
    .slice(installIndex + 1)
    .filter((token) => token && !token.startsWith("-"));
}

function parseInstallDirectives(code: string) {
  const packages = new Set<string>();
  const runnableLines: string[] = [];

  for (const line of code.split("\n")) {
    const trimmed = line.trim();

    if (trimmed.startsWith("# install:")) {
      const rawPackages = trimmed.slice("# install:".length).trim();
      rawPackages
        .split(/[,\s]+/)
        .map((pkg) => pkg.trim())
        .filter(Boolean)
        .forEach((pkg) => packages.add(pkg));
      continue;
    }

    if (trimmed.startsWith("!pip ") || trimmed.startsWith("%pip ")) {
      const pipArgs = trimmed.replace(/^(!|%)pip\s+/, "");
      extractPackagesFromPipArgs(pipArgs).forEach((pkg) => packages.add(pkg));
      continue;
    }

    runnableLines.push(line);
  }

  return {
    packages: Array.from(packages),
    runnableCode: runnableLines.join("\n"),
  };
}

function formatInstallSummary(
  installed: string[],
  failed: Array<{ name: string; reason: string }>
) {
  const lines: string[] = [];

  if (installed.length > 0) {
    lines.push(`Installed packages: ${installed.join(", ")}`);
  }

  if (failed.length > 0) {
    lines.push(
      `Failed packages: ${failed.map((pkg) => `${pkg.name} (${pkg.reason})`).join(", ")}`
    );
  }

  return lines.join("\n");
}

async function installPackages(pyodide: PyodideRuntime, packages: string[]) {
  const installed: string[] = [];
  const failed: Array<{ name: string; reason: string }> = [];

  if (packages.length === 0) {
    return { installed, failed };
  }

  let micropipReady = false;
  try {
    await pyodide.runPythonAsync("import micropip");
    micropipReady = true;
  } catch {
    if (pyodide.loadPackage) {
      try {
        await pyodide.loadPackage("micropip");
        await pyodide.runPythonAsync("import micropip");
        micropipReady = true;
      } catch {
        micropipReady = false;
      }
    }
  }

  for (const name of packages) {
    const pkgName = name.trim();
    if (!pkgName) continue;
    if (installedPackages.has(pkgName)) continue;

    if (BROWSER_UNSUPPORTED_PACKAGES.has(pkgName)) {
      failed.push({
        name: pkgName,
        reason: "Not supported in browser runtime. Use Google Colab (GPU/CPU).",
      });
      continue;
    }

    let done = false;

    if (pyodide.loadPackage) {
      try {
        await pyodide.loadPackage(pkgName);
        installedPackages.add(pkgName);
        installed.push(pkgName);
        done = true;
      } catch {
        // Fall back to micropip install below.
      }
    }

    if (done) continue;

    if (!micropipReady) {
      failed.push({
        name: pkgName,
        reason:
          "micropip is unavailable in this runtime, so pip install cannot run here.",
      });
      continue;
    }

    try {
      pyodide.globals.set("__pkg_name", pkgName);
      await pyodide.runPythonAsync("await micropip.install(__pkg_name)");
      pyodide.globals.delete?.("__pkg_name");
      installedPackages.add(pkgName);
      installed.push(pkgName);
    } catch (error) {
      pyodide.globals.delete?.("__pkg_name");
      const reason = error instanceof Error ? error.message : String(error);
      failed.push({ name: pkgName, reason });
    }
  }

  return { installed, failed };
}

function loadPyodideScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Pyodide can only run in the browser."));
  }

  if (window.loadPyodide) {
    return Promise.resolve();
  }

  if (pyodideScriptPromise) {
    return pyodideScriptPromise;
  }

  pyodideScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${PYODIDE_SCRIPT_URL}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Pyodide runtime script.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = PYODIDE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Pyodide runtime script."));
    document.head.appendChild(script);
  });

  return pyodideScriptPromise;
}

async function getPyodideRuntime() {
  if (!pyodideRuntimePromise) {
    await loadPyodideScript();
    if (!window.loadPyodide) {
      throw new Error("Pyodide runtime was not initialized.");
    }
    pyodideRuntimePromise = window.loadPyodide({ indexURL: PYODIDE_INDEX_URL });
  }

  return pyodideRuntimePromise;
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-[#202124]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
  });
}

function renderTextCellContent(content: string) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let paragraphLines: string[] = [];
  let bulletItems: string[] = [];
  let numberedItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    const text = paragraphLines.join(" ").trim();
    if (!text) {
      paragraphLines = [];
      return;
    }

    blocks.push(
      <p key={`paragraph-${blocks.length}`} className="text-[15px] leading-8 text-[#334155]">
        {renderInlineMarkdown(text)}
      </p>
    );
    paragraphLines = [];
  };

  const flushBullets = () => {
    if (bulletItems.length === 0) return;
    blocks.push(
      <ul key={`bullets-${blocks.length}`} className="space-y-2 pl-1">
        {bulletItems.map((item, index) => (
          <li key={`${item}-${index}`} className="flex items-start gap-3 text-[15px] leading-7 text-[#334155]">
            <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#1a73e8]" />
            <span>{renderInlineMarkdown(item)}</span>
          </li>
        ))}
      </ul>
    );
    bulletItems = [];
  };

  const flushNumbered = () => {
    if (numberedItems.length === 0) return;
    blocks.push(
      <ol key={`numbered-${blocks.length}`} className="space-y-3 pl-1">
        {numberedItems.map((item, index) => (
          <li key={`${item}-${index}`} className="flex items-start gap-3 text-[15px] leading-7 text-[#334155]">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#e8f0fe] text-xs font-semibold text-[#1967d2]">
              {index + 1}
            </span>
            <span>{renderInlineMarkdown(item)}</span>
          </li>
        ))}
      </ol>
    );
    numberedItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushBullets();
      flushNumbered();
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushBullets();
      flushNumbered();

      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const classes =
        level === 1
          ? "text-2xl font-semibold tracking-tight text-[#0f172a]"
          : level === 2
            ? "text-lg font-semibold text-[#0f172a]"
            : "text-sm font-semibold uppercase tracking-[0.16em] text-[#1967d2]";

      blocks.push(
        <h5 key={`heading-${blocks.length}`} className={classes}>
          {renderInlineMarkdown(text)}
        </h5>
      );
      continue;
    }

    const bulletMatch = line.match(/^-\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      flushNumbered();
      bulletItems.push(bulletMatch[1].trim());
      continue;
    }

    const numberedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (numberedMatch) {
      flushParagraph();
      flushBullets();
      numberedItems.push(numberedMatch[1].trim());
      continue;
    }

    paragraphLines.push(line);
  }

  flushParagraph();
  flushBullets();
  flushNumbered();

  return blocks;
}

export default function LessonNotebook({ lesson }: LessonNotebookProps) {
  const cells = useMemo(() => getLessonCells(lesson), [lesson]);
  const codeCellIds = useMemo(
    () => cells.filter((cell) => cell.type === "code").map((cell) => cell.id),
    [cells]
  );

  const [editableCodeByCell, setEditableCodeByCell] = useState<
    Record<string, string>
  >({});
  const [outputByCell, setOutputByCell] = useState<Record<string, CellOutput>>({});
  const [runningCellId, setRunningCellId] = useState<string | null>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [isRuntimeLoading, setIsRuntimeLoading] = useState(false);
  const [isRunningAllCells, setIsRunningAllCells] = useState(false);
  const [copiedCellId, setCopiedCellId] = useState<string | null>(null);
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const resizeTextarea = (cellId: string) => {
    const textarea = textareaRefs.current[cellId];
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    const initialCodeByCell = cells
      .filter((cell) => cell.type === "code")
      .reduce<Record<string, string>>((acc, cell) => {
        acc[cell.id] = cell.content;
        return acc;
      }, {});

    setEditableCodeByCell(initialCodeByCell);
    setOutputByCell({});
    setRunningCellId(null);
    setRuntimeError(null);
    setIsRunningAllCells(false);
    setCopiedCellId(null);
  }, [cells]);

  useEffect(() => {
    codeCellIds.forEach((cellId) => resizeTextarea(cellId));
  }, [codeCellIds, editableCodeByCell]);

  const handleCodeChange = (cellId: string, newCode: string) => {
    setEditableCodeByCell((prev) => ({
      ...prev,
      [cellId]: newCode,
    }));
    window.setTimeout(() => resizeTextarea(cellId), 0);
  };

  const handleResetCode = (cellId: string) => {
    const original = cells.find((cell) => cell.id === cellId && cell.type === "code");
    if (!original) return;

    setEditableCodeByCell((prev) => ({
      ...prev,
      [cellId]: original.content,
    }));
  };

  const handleCopyCode = async (cellId: string) => {
    const code = editableCodeByCell[cellId] ?? "";
    await navigator.clipboard.writeText(code);
    setCopiedCellId(cellId);
    setTimeout(() => {
      setCopiedCellId((prev) => (prev === cellId ? null : prev));
    }, 1200);
  };

  const handleClearOutput = (cellId: string) => {
    setOutputByCell((prev) => {
      if (!(cellId in prev)) return prev;
      const next = { ...prev };
      delete next[cellId];
      return next;
    });
  };

  const focusNextCodeCell = (cellId: string) => {
    const currentIndex = codeCellIds.indexOf(cellId);
    const nextCellId = codeCellIds[currentIndex + 1];
    if (!nextCellId) return;

    window.setTimeout(() => {
      const textarea = textareaRefs.current[nextCellId];
      if (!textarea) return;
      textarea.focus();
      const end = textarea.value.length;
      textarea.setSelectionRange(end, end);
    }, 0);
  };

  const executeCodeCell = async (cellId: string) => {
    const code = editableCodeByCell[cellId] ?? "";
    const parsedCell = parseInstallDirectives(code);
    const runnableCode = parsedCell.runnableCode;

    if (!code.trim()) {
      setOutputByCell((prev) => ({
        ...prev,
        [cellId]: { text: "This cell is empty.", images: [] },
      }));
      return true;
    }

    setRunningCellId(cellId);
    setRuntimeError(null);

    try {
      if (!pyodideRuntimePromise) {
        setIsRuntimeLoading(true);
      }
      const pyodide = await getPyodideRuntime();
      const installation = await installPackages(pyodide, parsedCell.packages);
      const installSummary = formatInstallSummary(
        installation.installed,
        installation.failed
      );

      if (!runnableCode.trim()) {
        const onlyInstallMessage = installSummary
          ? `${installSummary}\n\nNo Python statements to execute in this cell.`
          : "No Python statements to execute in this cell.";
        setOutputByCell((prev) => ({
          ...prev,
          [cellId]: { text: onlyInstallMessage, images: [] },
        }));
        return true;
      }

      pyodide.globals.set("__cell_code", runnableCode);

      const result = await pyodide.runPythonAsync(`
import io
import traceback
import json
import base64
from contextlib import redirect_stdout, redirect_stderr

_buffer = io.StringIO()
_images = []
try:
    try:
        import matplotlib
        matplotlib.use("AGG")
        import matplotlib.pyplot as plt
        plt.close("all")
    except Exception:
        plt = None
    with redirect_stdout(_buffer), redirect_stderr(_buffer):
        exec(__cell_code, globals())

    if plt is not None:
        for _fig_num in plt.get_fignums():
            _fig = plt.figure(_fig_num)
            _img_buffer = io.BytesIO()
            _fig.savefig(_img_buffer, format="png", bbox_inches="tight")
            _images.append(base64.b64encode(_img_buffer.getvalue()).decode("ascii"))
            _img_buffer.close()
        plt.close("all")

    _output = _buffer.getvalue()
except Exception:
    try:
        if plt is not None:
            plt.close("all")
    except Exception:
        pass
    _output = _buffer.getvalue() + traceback.format_exc()

json.dumps({"text": _output, "images": _images})
      `);

      pyodide.globals.delete?.("__cell_code");

      const parsedResult = JSON.parse(String(result ?? "{}")) as CellOutput;
      const output = parsedResult.text.trim();
      const finalOutput = [installSummary, output || "Code executed successfully."]
        .filter(Boolean)
        .join("\n\n");
      setOutputByCell((prev) => ({
        ...prev,
        [cellId]: {
          text: finalOutput,
          images: parsedResult.images ?? [],
        },
      }));
      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to execute this cell in browser runtime.";

      setRuntimeError(message);
      setOutputByCell((prev) => ({
        ...prev,
        [cellId]: { text: `Runtime error: ${message}`, images: [] },
      }));
      return false;
    } finally {
      setIsRuntimeLoading(false);
      setRunningCellId(null);
    }
  };

  const runCodeCell = async (cellId: string) => {
    await executeCodeCell(cellId);
  };

  const runAllCodeCells = async () => {
    if (isRunningAllCells || codeCellIds.length === 0) return;

    setIsRunningAllCells(true);
    setRuntimeError(null);

    try {
      for (const cellId of codeCellIds) {
        const succeeded = await executeCodeCell(cellId);
        if (!succeeded) {
          break;
        }
      }
    } finally {
      setIsRunningAllCells(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa] rounded-xl border border-[#dadce0] shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-[#dadce0] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-[#202124] text-sm">Notebook</h3>
            <p className="text-xs text-[#5f6368] mt-1">
              Colab-style practice area for lightweight browser execution.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
            <button
              onClick={() => void runAllCodeCells()}
              disabled={isRunningAllCells || Boolean(runningCellId)}
              className="inline-flex items-center gap-2 rounded-full border border-[#c9d2e3] bg-white px-3 py-1.5 text-xs font-semibold text-[#1f4db8] transition-all hover:bg-[#eef4ff] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRunningAllCells ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Running all cells
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  Run all code cells
                </>
              )}
            </button>
            <span className="px-2.5 py-1 rounded-full bg-[#e8f0fe] text-[#1967d2] font-medium">
              Browser runtime
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#f1f3f4] text-[#5f6368] font-medium">
              Python cells
            </span>
          </div>
        </div>
      </div>

      {runtimeError && (
        <div className="mx-4 mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {runtimeError}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa]">
        {cells.map((cell, index) => {
          if (cell.type === "text") {
            return (
              <section key={cell.id} className="grid grid-cols-[56px_minmax(0,1fr)] gap-3">
                <div className="flex flex-col items-center pt-4 text-[#9aa0a6]">
                  <div className="w-9 h-9 rounded-full border border-[#d6e2ff] bg-[#edf4ff] flex items-center justify-center text-[11px] font-semibold text-[#1967d2]">
                    md
                  </div>
                </div>
                <div className="overflow-hidden rounded-3xl border border-[#dbe6fb] bg-gradient-to-br from-white via-[#fcfdff] to-[#f6f9ff] shadow-[0_14px_40px_rgba(30,64,175,0.08)]">
                  <div className="border-b border-[#e8eefc] bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_100%)] px-5 py-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#5f6368] font-semibold">
                      Text cell {index + 1}
                    </p>
                    <h4 className="mt-2 text-base font-semibold text-[#0f172a]">
                      {cell.title}
                    </h4>
                  </div>
                  <div className="px-5 py-5">
                    <div className="space-y-5">
                      {renderTextCellContent(cell.content)}
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          const cellCode = editableCodeByCell[cell.id] ?? cell.content;
          const isRunning = runningCellId === cell.id;
          const output = outputByCell[cell.id];

          return (
            <section key={cell.id} className="grid grid-cols-[56px_minmax(0,1fr)] gap-3">
              <div className="flex flex-col items-center pt-5 text-[#5f6368]">
                <button
                  onClick={() => runCodeCell(cell.id)}
                  disabled={isRunning || isRunningAllCells}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d7dce3] bg-white text-[#1967d2] shadow-sm transition-colors hover:bg-[#eef4ff] disabled:cursor-not-allowed disabled:opacity-60"
                  title="Run cell"
                >
                  {isRunning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>
                <span className="mt-3 font-mono text-[11px] text-[#6b7280]">In [{index + 1}]</span>
              </div>
              <div className="overflow-hidden rounded-[22px] border border-[#d9dee7] bg-white shadow-[0_10px_26px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between gap-2 border-b border-[#edf1f5] bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-4 py-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b7280]">
                      Code cell {index + 1}
                    </p>
                    <h4 className="mt-1 text-sm font-semibold text-[#111827]">
                      {cell.title}
                    </h4>
                    <p className="mt-1 font-mono text-[11px] text-[#6b7280]">
                      In&nbsp;[{index + 1}]
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyCode(cell.id)}
                      className="rounded-md p-2 text-[#6b7280] transition-colors hover:bg-[#f3f4f6]"
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleResetCode(cell.id)}
                      className="rounded-md p-2 text-[#6b7280] transition-colors hover:bg-[#f3f4f6]"
                      title="Reset code"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleClearOutput(cell.id)}
                      className="rounded-md p-2 text-[#6b7280] transition-colors hover:bg-[#f3f4f6]"
                      title="Clear output"
                    >
                      <Eraser className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => runCodeCell(cell.id)}
                      disabled={isRunning || isRunningAllCells}
                      className="rounded-md border border-[#c9d2e3] bg-white px-3 py-1.5 text-xs font-semibold text-[#1f4db8] transition-all hover:bg-[#eef4ff] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isRunning ? (
                        <span className="inline-flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Running
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          Run
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-[84px_minmax(0,1fr)] bg-[#fbfcfe]">
                  <div className="border-r border-[#e7ebf0] bg-[linear-gradient(180deg,#f8fbff_0%,#f2f6fc_100%)] px-3 py-4 text-right font-mono text-[13px] text-[#365fc9]">
                    In&nbsp;[{index + 1}]:
                  </div>
                  <div className="p-3">
                    <textarea
                      ref={(element) => {
                        textareaRefs.current[cell.id] = element;
                        if (element) {
                          element.style.height = "0px";
                          element.style.height = `${element.scrollHeight}px`;
                        }
                      }}
                      value={cellCode}
                      onChange={(event) => handleCodeChange(cell.id, event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && event.shiftKey) {
                          event.preventDefault();
                          void runCodeCell(cell.id);
                          focusNextCodeCell(cell.id);
                        }
                      }}
                      className="w-full overflow-hidden rounded-xl border border-[#d7dee8] bg-white px-4 py-3 font-mono text-[17px] text-[#b42318] shadow-inner focus:border-[#9cb6ff] focus:outline-none focus:ring-2 focus:ring-[#d9e5ff]"
                      rows={Math.max(cellCode.split("\n").length, 1)}
                      spellCheck={false}
                      style={{ lineHeight: "1.9" }}
                    />
                  </div>
                </div>

                <div className="border-t border-[#edf1f5] bg-[#fafbfc] px-4 py-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[#6b7280]">Output</p>
                    <span className="font-mono text-[11px] text-[#6b7280]">
                      Out[{index + 1}]
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-[#d7dee8] bg-white shadow-inner">
                    <pre className="min-h-16 whitespace-pre-wrap p-3 font-mono text-[15px] leading-8 text-[#1f2937]">
                      {output?.text || "Run this cell to see output."}
                    </pre>
                    {output?.images && output.images.length > 0 ? (
                      <div className="border-t border-[#edf1f5] bg-[#fcfdff] px-3 py-3 space-y-3">
                        {output.images.map((image, imageIndex) => (
                          <img
                            key={`${cell.id}-output-${imageIndex}`}
                            src={`data:image/png;base64,${image}`}
                            alt={`Cell output ${imageIndex + 1}`}
                            className="max-w-full rounded-lg border border-[#d7dee8] bg-white"
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                {copiedCellId === cell.id && (
                  <div className="px-4 pb-3 text-xs font-medium text-green-700">
                    Code copied.
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <div className="px-4 py-1.5 border-t border-[#dadce0] bg-white text-[11px] text-[#5f6368]">
        {isRuntimeLoading ? (
          <span className="inline-flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            Initializing Python runtime...
          </span>
        ) : (
          " "
        )}
      </div>
    </div>
  );
}
