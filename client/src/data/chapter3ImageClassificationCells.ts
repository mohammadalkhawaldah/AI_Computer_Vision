import { type LessonCell } from "@/data/lessonSchema";

export const chapter3ImageClassificationVideoId = "";

export const chapter3ImageClassificationCells: LessonCell[] = [
  {
    id: "lesson-3-text-1",
    type: "text",
    title: "Ant And Bee Image Classification",
    content: `# Ant And Bee Image Classification
**Instructor Material:** Chapter 3
**Focus:** Image classification with Ultralytics YOLO

This lesson is integrated into the platform in the same lesson format as Chapter 2.

## Important Note

This notebook is primarily **Google Colab / GPU** material.

It uses:
- \`ultralytics\`
- \`opencv-python\`
- external dataset download
- YOLO classification training

Those steps are heavier than the browser runtime used inside this platform, so students should expect to use Colab for full training runs.`,
  },
  {
    id: "lesson-3-text-2",
    type: "text",
    title: "Install Required Packages",
    content:
      "First, we need to install the `ultralytics` library, which provides the YOLOv6s model, and `opencv-python` for webcam access and video processing. We will install them using pip.",
  },
  {
    id: "lesson-3-code-1",
    type: "code",
    title: "Code Cell 1",
    content: `pip install ultralytics opencv-python`,
  },
  {
    id: "lesson-3-code-2",
    type: "code",
    title: "Code Cell 2",
    content: `import os
import shutil
import random
import zipfile
from pathlib import Path

import matplotlib.pyplot as plt
from PIL import Image
from ultralytics import YOLO`,
  },
  {
    id: "lesson-3-code-3",
    type: "code",
    title: "Code Cell 3",
    content: `!wget -O /content/hymenoptera_data.zip https://download.pytorch.org/tutorial/hymenoptera_data.zip`,
  },
  {
    id: "lesson-3-code-4",
    type: "code",
    title: "Code Cell 4",
    content: `zip_path = "/content/hymenoptera_data.zip"
extract_path = "/content"

with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall(extract_path)

print("Done")
print("Dataset folder:", "/content/hymenoptera_data")`,
  },
  {
    id: "lesson-3-code-5",
    type: "code",
    title: "Code Cell 5",
    content: `base_dir = Path("/content/hymenoptera_data")

for split in ["train", "val"]:
    print(f"\\n{split.upper()}")
    for cls in os.listdir(base_dir / split):
        n = len(os.listdir(base_dir / split / cls))
        print(f"{cls}: {n}")`,
  },
  {
    id: "lesson-3-text-3",
    type: "text",
    title: "Preview Training Images",
    content: `# Preview Training Images

The next cell samples images from the two classes:
- ants
- bees

This helps students inspect the dataset before training.`,
  },
  {
    id: "lesson-3-code-6",
    type: "code",
    title: "Code Cell 6",
    content: `classes = ["ants", "bees"]

fig, axes = plt.subplots(2, 5, figsize=(12, 6))

for row, cls in enumerate(classes):
    folder = base_dir / "train" / cls
    imgs = random.sample(os.listdir(folder), 5)

    for col, img_name in enumerate(imgs):
        img = Image.open(folder / img_name)
        axes[row, col].imshow(img)
        axes[row, col].set_title(cls)
        axes[row, col].axis("off")

plt.tight_layout()
plt.show()`,
  },
  {
    id: "lesson-3-code-7",
    type: "code",
    title: "Code Cell 7",
    content: `model = YOLO("yolo11n-cls.pt")

results = model.train(
    data="/content/hymenoptera_data",
    epochs=5,
    imgsz=224,
    batch=16
)`,
  },
  {
    id: "lesson-3-code-8",
    type: "code",
    title: "Code Cell 8",
    content: `from ultralytics import YOLO

best_model_path = "/content/runs/classify/train/weights/best.pt"

best_model = YOLO(best_model_path)`,
  },
  {
    id: "lesson-3-code-9",
    type: "code",
    title: "Code Cell 9",
    content: `metrics = best_model.val(
    data="/content/hymenoptera_data",
    plots=True
)`,
  },
  {
    id: "lesson-3-code-10",
    type: "code",
    title: "Code Cell 10",
    content: `from PIL import Image
import matplotlib.pyplot as plt

cm_path = "/content/runs/classify/val/confusion_matrix.png"

img = Image.open(cm_path)

plt.imshow(img)
plt.axis("off")
plt.title("Confusion Matrix")
plt.show()`,
  },
  {
    id: "lesson-3-code-11",
    type: "code",
    title: "Code Cell 11",
    content: `from ultralytics import YOLO

model = YOLO("yolo11n-cls.pt")

model.train(
    data="/content/hymenoptera_data",
    epochs=10,
    imgsz=224,
    batch=16
)`,
  },
  {
    id: "lesson-3-code-12",
    type: "code",
    title: "Code Cell 12",
    content: `from ultralytics import YOLO
from PIL import Image
import matplotlib.pyplot as plt
import os

# --- Load SECOND model (train2) ---
model = YOLO("/content/runs/classify/train2/weights/best.pt")

# --- Run validation and save with a clear name ---
model.val(
    data="/content/hymenoptera_data",
    plots=True,
    name="val_10epochs"
)

# --- Path to confusion matrix ---
cm_path = "/content/runs/classify/val_10epochs/confusion_matrix.png"

# --- Display it ---
img = Image.open(cm_path)

plt.imshow(img)
plt.axis("off")
plt.title("Confusion Matrix (10 Epochs)")
plt.show()`,
  },
];
