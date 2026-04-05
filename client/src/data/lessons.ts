export type {
  Course,
  Lesson,
  LessonCell,
  LessonCellType,
  LessonSlot,
} from "@/data/lessonSchema";

export {
  buildCellsFromSlots,
  codeCell,
  LESSON_SLOTS_TEMPLATE,
  textCell,
} from "@/data/lessonSchema";

import { chapter2Part1Cells, chapter2Part1VideoId } from "@/data/chapter2Part1Cells";
import {
  chapter3ImageClassificationCells,
  chapter3ImageClassificationVideoId,
} from "@/data/chapter3ImageClassificationCells";
import {
  chapter4ObjectDetectionCells,
  chapter4ObjectDetectionVideoId,
} from "@/data/chapter4ObjectDetectionCells";
import { codeCell, textCell, type Course, type Lesson, type LessonCell } from "@/data/lessonSchema";

export const coursesData: Course[] = [
  {
    id: 1,
    title: "AI Engineering Lab",
    description: "Browser-based lessons for Python, backend logic, and computer vision foundations.",
    lessons: [
      {
        id: 2,
        title: "Chapter 2 - Prerequisites For AI Computer Vision",
        description: "Imported from your Colab notebook and adapted for browser-safe student practice.",
        duration: "60 mins",
        videoId: chapter2Part1VideoId,
        colabUrl:
          "https://colab.research.google.com/drive/1VSs7DB3wytPIMCZCFG8D85vyXweSF3Y8#scrollTo=Xrto26YIenv0",
        notebookCode: "",
        cells: chapter2Part1Cells,
        completed: false,
        order: 1,
      },
      {
        id: 3,
        title: "Chapter 3 - Image Classification",
        description:
          "Imported from your ant and bee classification notebook and integrated into the lesson platform.",
        duration: "90 mins",
        videoId: chapter3ImageClassificationVideoId,
        colabUrl:
          "https://colab.research.google.com/drive/1CoV-OnYcc_ac3VTo-Kq7tzoKX_ceSYyh#scrollTo=NpJAKuT8xuXI",
        notebookCode: "",
        cells: chapter3ImageClassificationCells,
        completed: false,
        order: 2,
      },
      {
        id: 4,
        title: "Chapter 4 - Object Detection",
        description:
          "Imported from your rock-paper-scissors object detection notebook and integrated into the lesson platform.",
        duration: "90 mins",
        videoId: chapter4ObjectDetectionVideoId,
        colabUrl:
          "https://colab.research.google.com/github/mohammadalkhawaldah/AI_Computer_Vision/blob/main/Chapter4_Object_Detection.ipynb",
        notebookCode: "",
        cells: chapter4ObjectDetectionCells,
        completed: false,
        order: 3,
      },
    ],
  },
];

const numberedSectionPattern = /^#\s*\d+\.\s*(.+)$/;
const commentLinePattern = /^#\s?(.*)$/;

function trimEmptyLines(lines: string[]) {
  let start = 0;
  let end = lines.length;
  while (start < end && lines[start].trim() === "") start++;
  while (end > start && lines[end - 1].trim() === "") end--;
  return lines.slice(start, end);
}

function splitNotebookIntoCells(lesson: Lesson): LessonCell[] {
  const cells: LessonCell[] = [
    textCell(`lesson-${lesson.id}-intro`, "Lesson Overview", lesson.description),
  ];

  const lines = lesson.notebookCode.split("\n");
  const sections: Array<{ title: string; lines: string[] }> = [];
  let current: { title: string; lines: string[] } | null = null;
  const prefaceCode: string[] = [];

  for (const rawLine of lines) {
    const sectionMatch = rawLine.match(numberedSectionPattern);
    if (sectionMatch) {
      if (current) sections.push(current);
      current = { title: sectionMatch[1].trim(), lines: [] };
      continue;
    }
    if (!current) {
      const topComment = rawLine.match(commentLinePattern);
      if (!topComment) prefaceCode.push(rawLine);
      continue;
    }
    current.lines.push(rawLine);
  }

  if (current) sections.push(current);

  if (sections.length === 0) {
    const fallbackCode = trimEmptyLines(lesson.notebookCode.split("\n")).join("\n");
    if (fallbackCode) {
      cells.push(codeCell(`lesson-${lesson.id}-code-1`, "Practice", fallbackCode));
    }
    return cells;
  }

  if (trimEmptyLines(prefaceCode).length > 0) {
    cells.push(
      codeCell(
        `lesson-${lesson.id}-code-preface`,
        "Setup",
        trimEmptyLines(prefaceCode).join("\n")
      )
    );
  }

  sections.forEach((section, index) => {
    const leadingText: string[] = [];
    const codeLines: string[] = [];
    let readingLeadingText = true;

    for (const line of section.lines) {
      const commentMatch = line.match(commentLinePattern);
      const isComment = Boolean(commentMatch);
      const isBlank = line.trim() === "";

      if (readingLeadingText && (isComment || isBlank)) {
        if (isComment && commentMatch && commentMatch[1].trim() !== "") {
          leadingText.push(commentMatch[1].trim());
        }
        continue;
      }

      readingLeadingText = false;
      codeLines.push(line);
    }

    const explanation = leadingText.join("\n").trim() || section.title;
    const runnableCode = trimEmptyLines(codeLines).join("\n");

    cells.push(
      textCell(`lesson-${lesson.id}-text-${index + 1}`, section.title, explanation)
    );

    if (runnableCode) {
      cells.push(
        codeCell(`lesson-${lesson.id}-code-${index + 1}`, section.title, runnableCode)
      );
    }
  });

  return cells;
}

export function getLessonCells(lesson: Lesson): LessonCell[] {
  if (lesson.cells && lesson.cells.length > 0) return lesson.cells;
  return splitNotebookIntoCells(lesson);
}
