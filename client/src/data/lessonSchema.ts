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

export interface LessonSlot {
  title: string;
  text: string;
  code: string;
}

export function textCell(id: string, title: string, content: string): LessonCell {
  return { id, type: "text", title, content };
}

export function codeCell(id: string, title: string, content: string): LessonCell {
  return { id, type: "code", title, content };
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
