import fs from "node:fs";
import path from "node:path";

function printHelp() {
  const lines = [
    "Convert a Google Colab .ipynb file into lesson cells for client/src/data/lessons.ts",
    "",
    "Usage:",
    "  npm run import:colab -- <path-to-notebook.ipynb> [options]",
    "",
    "Options:",
    "  --lesson-id <number>    Lesson id used in generated cell ids (default: 1)",
    "  --out <path>            Write output to a file (otherwise prints to terminal)",
    "  --format <ts|json>      Output format (default: ts)",
    "  --keep-empty            Keep empty markdown/code cells",
    "  --help                  Show this help",
    "",
    "Example:",
    "  npm run import:colab -- .\\content\\lesson01.ipynb --lesson-id 1 --out .\\lesson01-cells.ts",
  ];
  console.log(lines.join("\n"));
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    notebookPath: "",
    lessonId: 1,
    outPath: "",
    format: "ts",
    keepEmpty: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg.startsWith("--") && !options.notebookPath) {
      options.notebookPath = arg;
      continue;
    }

    if (arg === "--lesson-id") {
      const raw = args[i + 1];
      if (!raw) throw new Error("Missing value for --lesson-id");
      const parsed = Number(raw);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error(`Invalid lesson id: ${raw}`);
      }
      options.lessonId = Math.floor(parsed);
      i++;
      continue;
    }

    if (arg === "--out") {
      const raw = args[i + 1];
      if (!raw) throw new Error("Missing value for --out");
      options.outPath = raw;
      i++;
      continue;
    }

    if (arg === "--format") {
      const raw = args[i + 1];
      if (!raw) throw new Error("Missing value for --format");
      if (raw !== "ts" && raw !== "json") {
        throw new Error(`Invalid --format value: ${raw}`);
      }
      options.format = raw;
      i++;
      continue;
    }

    if (arg === "--keep-empty") {
      options.keepEmpty = true;
      continue;
    }

    if (arg === "--help") {
      options.help = true;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function normalizeSource(source) {
  if (Array.isArray(source)) {
    return source.join("");
  }
  return typeof source === "string" ? source : "";
}

function trimIfNeeded(content, keepEmpty) {
  return keepEmpty ? content : content.trim();
}

function extractMarkdownTitle(markdown, fallback) {
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("#")) {
      return trimmed.replace(/^#+\s*/, "").trim() || fallback;
    }

    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return trimmed.slice(2, -2).trim() || fallback;
    }

    return trimmed.slice(0, 72);
  }
  return fallback;
}

function extractCodeTitle(code, fallback) {
  const lines = code.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("#")) {
      const commentTitle = trimmed.replace(/^#+\s*/, "").trim();
      return commentTitle || fallback;
    }

    return fallback;
  }
  return fallback;
}

function escapeTemplateLiteral(text) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

function notebookToCells(notebook, lessonId, keepEmpty) {
  if (!notebook || !Array.isArray(notebook.cells)) {
    throw new Error("Invalid notebook format: missing cells array.");
  }

  let textCounter = 0;
  let codeCounter = 0;
  const cells = [];

  for (const cell of notebook.cells) {
    const cellType = cell?.cell_type;
    const contentRaw = normalizeSource(cell?.source ?? "");
    const content = trimIfNeeded(contentRaw, keepEmpty);

    if (!keepEmpty && !content) {
      continue;
    }

    if (cellType === "markdown" || cellType === "raw") {
      textCounter += 1;
      const fallbackTitle = `Text Cell ${textCounter}`;
      cells.push({
        id: `lesson-${lessonId}-text-${textCounter}`,
        type: "text",
        title: extractMarkdownTitle(content, fallbackTitle),
        content,
      });
      continue;
    }

    if (cellType === "code") {
      codeCounter += 1;
      const fallbackTitle = `Code Cell ${codeCounter}`;
      cells.push({
        id: `lesson-${lessonId}-code-${codeCounter}`,
        type: "code",
        title: extractCodeTitle(content, fallbackTitle),
        content,
      });
      continue;
    }
  }

  return cells;
}

function toTsSnippet(cells) {
  const rows = cells.map((cell) => {
    const content = escapeTemplateLiteral(cell.content);
    const title = escapeTemplateLiteral(cell.title);
    return [
      "  {",
      `    id: "${cell.id}",`,
      `    type: "${cell.type}",`,
      `    title: \`${title}\`,`,
      `    content: \`${content}\`,`,
      "  },",
    ].join("\n");
  });

  return [
    "// Paste this into a lesson object in client/src/data/lessons.ts",
    "cells: [",
    rows.join("\n"),
    "],",
    "",
  ].join("\n");
}

function toJsonSnippet(cells) {
  return `${JSON.stringify(cells, null, 2)}\n`;
}

function resolvePathFromCwd(p) {
  return path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
}

function main() {
  const options = parseArgs(process.argv);

  if (options.help || !options.notebookPath) {
    printHelp();
    return;
  }

  const notebookPath = resolvePathFromCwd(options.notebookPath);
  if (!fs.existsSync(notebookPath)) {
    throw new Error(`Notebook not found: ${notebookPath}`);
  }

  const raw = fs.readFileSync(notebookPath, "utf-8");
  const notebook = JSON.parse(raw);
  const cells = notebookToCells(notebook, options.lessonId, options.keepEmpty);
  const output =
    options.format === "json" ? toJsonSnippet(cells) : toTsSnippet(cells);

  if (options.outPath) {
    const outPath = resolvePathFromCwd(options.outPath);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, output, "utf-8");
    console.log(`Generated ${cells.length} cells -> ${outPath}`);
    return;
  }

  process.stdout.write(output);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
}
