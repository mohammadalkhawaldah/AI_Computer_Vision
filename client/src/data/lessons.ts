export type LessonCellType = "text" | "code";

export interface LessonCell {
  id: string;
  type: LessonCellType;
  title: string;
  content: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoId: string;
  colabUrl?: string;
  notebookCode: string;
  cells?: LessonCell[];
  completed: boolean;
  order: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export function textCell(id: string, title: string, content: string): LessonCell {
  return { id, type: "text", title, content };
}

export function codeCell(id: string, title: string, content: string): LessonCell {
  return { id, type: "code", title, content };
}

export interface LessonSlot {
  title: string;
  text: string;
  code: string;
}

export function buildCellsFromSlots(lessonId: number, slots: LessonSlot[]) {
  return slots.flatMap((slot, index) => [
    textCell(`lesson-${lessonId}-text-${index + 1}`, slot.title, slot.text),
    codeCell(`lesson-${lessonId}-code-${index + 1}`, slot.title, slot.code),
  ]);
}

export const LESSON_SLOTS_TEMPLATE: LessonSlot[] = [
  {
    title: "Step 1 - Explain The Concept",
    text: "Paste teacher explanation text here.",
    code: "print('Paste runnable code for step 1 here')",
  },
  {
    title: "Step 2 - Practice",
    text: "Paste the next explanation text here.",
    code: "print('Paste runnable code for step 2 here')",
  },
];

const videoId = "oaIPQkKR9RU";

const chapter2Part1Cells: LessonCell[] = [
  textCell(
    "lesson-5-text-1",
    "Prerequisites For AI Computer Vision",
    `# Prerequisites For AI Computer Vision
**Instructor:** Dr. Mohammad Al Khawaldah
**Last Updated:** 2026-02-16

## Goal Of Chapter 2

By the end of this chapter, students should be able to:
- open Google Colab
- understand CPU vs GPU
- write simple Python statements
- use basic loops and functions
- work with simple image arrays
- understand when to switch from browser practice to Colab`
  ),
  textCell(
    "lesson-5-text-2",
    "How To Open Google Colab",
    `# How To Open Google Colab

1. Open **https://colab.research.google.com**
2. Sign in with your Google account
3. Click **File -> Save a copy in Drive**
4. Rename the notebook with your name
5. Click **Runtime -> Run all**

Colab is recommended when you need GPU support or packages that are too heavy for the browser runtime.`
  ),
  textCell(
    "lesson-5-text-3",
    "CPU Vs GPU",
    `# CPU Vs GPU

CPU is good for general logic and control flow.

GPU is good for parallel workloads such as deep learning and image processing.

In this browser platform, we focus on code understanding and lightweight exercises. For GPU work, move to Colab.`
  ),
  codeCell(
    "lesson-5-code-1",
    "GPU Check",
    `try:
    import torch
    if torch.cuda.is_available():
        print("GPU is available")
        print("GPU Name:", torch.cuda.get_device_name(0))
    else:
        print("GPU NOT available (CPU only)")
except ModuleNotFoundError:
    print("torch is not available in this browser runtime.")
    print("Run this check in Google Colab when you need GPU support.")`
  ),
  textCell(
    "lesson-5-text-4",
    "Python Basics For Computer Vision",
    `# Python Basics For Computer Vision

We use simple engineering examples so students can practice the Python syntax they will later need for computer vision projects.`
  ),
  codeCell(
    "lesson-5-code-2",
    "Hello Python",
    `print("Hello Mechatronics Students, welcome to Chapter 2!")`
  ),
  textCell("lesson-5-text-5", "Variables", "### Variables"),
  codeCell(
    "lesson-5-code-3",
    "Variables Example",
    `speed = 5
distance = 100
time = distance / speed
print("Time needed =", time)`
  ),
  textCell(
    "lesson-5-text-6",
    "If Statement Example",
    "### If Statement Example - Turn LED ON if light is low"
  ),
  codeCell(
    "lesson-5-code-4",
    "If Statement Practice",
    `light_value = 45

if light_value < 50:
    print("it is too dark")
    print("LED ON")
else:
    print("LED OFF")`
  ),
  textCell(
    "lesson-5-text-7",
    "Loops Example",
    "### Loops Example - Scan 5 camera frames"
  ),
  codeCell(
    "lesson-5-code-5",
    "Loop Practice",
    `for i in range(5):
    print("Processing frame", i)`
  ),
  textCell(
    "lesson-5-text-8",
    "Functions Example",
    "### Functions Example - Detect if truck is overloaded"
  ),
  codeCell(
    "lesson-5-code-6",
    "Function Practice",
    `def is_overloaded(weight, limit):
    return weight > limit

print(is_overloaded(10, 10))
print(is_overloaded(5, 10))`
  ),
  textCell(
    "lesson-5-text-9",
    "Exercise 1",
    `## Exercise 1

Change the function so it prints:
- "SAFE" if weight <= limit
- "OVERLOAD" if weight > limit`
  ),
  codeCell(
    "lesson-5-code-7",
    "Exercise Cell 1",
    `def check_truck(weight, limit):
    if weight > limit:
        return "OVERLOAD"
    return "SAFE"

print(check_truck(15, 10))`
  ),
  textCell(
    "lesson-5-text-10",
    "Lists And Dictionaries",
    "### Lists and dictionaries are important for AI prediction results."
  ),
  codeCell(
    "lesson-5-code-8",
    "Predictions As Data",
    `detections = ["truck", "person", "helmet"]
for item in detections:
    print("Detected:", item)

truck_info = {"plate": "12345", "load": "sand", "covered": False}
print(truck_info["plate"])`
  ),
  textCell(
    "lesson-5-text-11",
    "First Computer Vision Example",
    `# First Computer Vision Example

This browser version uses NumPy and Matplotlib so students can run it here without OpenCV installation issues.`
  ),
  codeCell(
    "lesson-5-code-9",
    "Install Browser-Friendly Packages",
    `# install: numpy matplotlib
import numpy as np
from matplotlib import pyplot as plt

print("NumPy version loaded.")
print("Matplotlib is ready for plotting in the next cell.")`
  ),
  codeCell(
    "lesson-5-code-10",
    "Synthetic Image Example",
    `# install: numpy matplotlib
import numpy as np
from matplotlib import pyplot as plt

img = np.zeros((200, 200, 3), dtype=np.uint8)
img[50:150, 50:150] = (0, 255, 0)

plt.imshow(img)
plt.title("Synthetic Image")
plt.axis("off")
plt.show()`
  ),
  textCell(
    "lesson-5-text-12",
    "Exercise 2",
    "## Exercise 2\n\nModify the code to create a RED square instead of GREEN."
  ),
  textCell(
    "lesson-5-text-13",
    "Google Drive In Colab",
    `# Mount Google Drive

Mounting Google Drive is useful in Colab, not in this browser runtime.`
  ),
  codeCell(
    "lesson-5-code-11",
    "Colab Only Cell",
    `print("Google Drive mounting is a Colab-only step.")
print("Use this browser platform for lightweight coding practice.")`
  ),
  textCell(
    "lesson-5-text-14",
    "Using AI Tools",
    `# Using AI Assistant

When code fails:
1. copy the error
2. explain it with an AI assistant
3. ask for a clearer or browser-friendly version

AI tools are part of the engineering workflow.`
  ),
  textCell(
    "lesson-5-text-15",
    "Mini Project",
    `# Mini Project - Brightness Detector

We simulate brightness values and decide whether a light should turn on.`
  ),
  codeCell(
    "lesson-5-code-12",
    "Brightness Detector",
    `import random

def decide_light():
    brightness = random.randint(0, 100)
    print("Brightness =", brightness)
    if brightness < 40:
        print("Turn LED ON")
    else:
        print("Turn LED OFF")

for _ in range(5):
    decide_light()`
  ),
  textCell(
    "lesson-5-text-16",
    "What You Learned",
    `# What You Learned

You can now:
- run Python basics
- understand CPU vs GPU
- use simple functions and loops
- create a synthetic image with NumPy
- know when to switch to Colab for heavier workflows`
  ),
];

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
        videoId,
        colabUrl:
          "https://colab.research.google.com/drive/1VSs7DB3wytPIMCZCFG8D85vyXweSF3Y8#scrollTo=Xrto26YIenv0",
        notebookCode: "",
        cells: chapter2Part1Cells,
        completed: false,
        order: 1,
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
