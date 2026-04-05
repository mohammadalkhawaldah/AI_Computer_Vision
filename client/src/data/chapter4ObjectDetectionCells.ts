import { type LessonCell } from "@/data/lessonSchema";

export const chapter4ObjectDetectionVideoId = "";

export const chapter4ObjectDetectionCells: LessonCell[] = [
  {
    id: "lesson-4-text-1",
    type: "text",
    title: "Object Detection With YOLOv8",
    content: `# Object Detection With YOLOv8
**Instructor Material:** Chapter 4
**Focus:** Rock-Paper-Scissors object detection

This lesson shows a full object detection workflow using a YOLOv8 model on a small three-class dataset.

Students should pay attention to three ideas:
- the first 10-epoch training run is only a baseline
- lowering confidence to \`0.01\` makes more predicted boxes appear
- training longer for 50 epochs gives the best final result

This notebook is designed for Colab/GPU use, but the lesson platform keeps the explanation and structure easy to follow.`,
  },
  {
    id: "lesson-4-text-2",
    type: "text",
    title: "Mount Drive And Prepare The Tools",
    content:
      "The first code cell connects Colab to Google Drive, installs Ultralytics, and imports the libraries used for dataset setup, training, validation, and figure display.",
  },
  {
    id: "lesson-4-code-1",
    type: "code",
    title: "Code Cell 1",
    content: `from google.colab import drive
drive.mount('/content/drive')

!pip install -q ultralytics

import os
from pathlib import Path
import yaml
from IPython.display import Image, display
from ultralytics import YOLO

base = "/content/drive/MyDrive/rock-paper-scissor.v3-v22.yolov11"
fixed_yaml = "/content/rps_fixed.yaml"

data = {
    "path": base,
    "train": "train/images",
    "val": "valid/images",
    "test": "test/images",
    "names": ["paper", "rock", "scissor"],
}

with open(fixed_yaml, "w") as f:
    yaml.dump(data, f)

print(os.listdir(base))
print(Path(fixed_yaml).read_text())`,
  },
  {
    id: "lesson-4-text-3",
    type: "text",
    title: "Train The Baseline Model",
    content:
      "This cell trains the first YOLOv8 model for 10 epochs. It is intentionally short so students can compare the baseline result with the improved version later.",
  },
  {
    id: "lesson-4-code-2",
    type: "code",
    title: "Code Cell 2",
    content: `model = YOLO("yolov8n.pt")
results = model.train(
    data=fixed_yaml,
    epochs=10,
    imgsz=640,
    batch=16,
    project="YOLO_Demo",
    name="rps_demo"
)`,
  },
  {
    id: "lesson-4-text-4",
    type: "text",
    title: "Baseline Confusion Matrix",
    content:
      "This cell validates the 10-epoch model with the default confidence threshold and displays the confusion matrix images. It shows the starting point before any tuning.",
  },
  {
    id: "lesson-4-code-3",
    type: "code",
    title: "Code Cell 3",
    content: `best_model_10 = YOLO("/content/runs/detect/YOLO_Demo/rps_demo/weights/best.pt")
metrics_10 = best_model_10.val(data=fixed_yaml, plots=True)
val_dir_10 = Path(metrics_10.save_dir)

display(Image(filename=str(val_dir_10 / "confusion_matrix.png")))
display(Image(filename=str(val_dir_10 / "confusion_matrix_normalized.png")))`,
  },
  {
    id: "lesson-4-text-5",
    type: "text",
    title: "Why Confidence Matters",
    content:
      "Lowering the confidence threshold keeps more low-confidence predictions instead of discarding them. That usually increases recall and makes the confusion matrix look better, but it can also add a few extra false positives.",
  },
  {
    id: "lesson-4-code-4",
    type: "code",
    title: "Code Cell 4",
    content: `best_model_10 = YOLO("/content/runs/detect/YOLO_Demo/rps_demo/weights/best.pt")
metrics_10_lowconf = best_model_10.val(
    data=fixed_yaml,
    conf=0.01,
    plots=True
)
val_dir_10_low = Path(metrics_10_lowconf.save_dir)

display(Image(filename=str(val_dir_10_low / "confusion_matrix.png")))
display(Image(filename=str(val_dir_10_low / "confusion_matrix_normalized.png")))`,
  },
  {
    id: "lesson-4-text-6",
    type: "text",
    title: "Train A Stronger Model",
    content:
      "Now we train for 50 epochs. The goal is to give the detector more time to learn the dataset so the final model is more accurate than the baseline.",
  },
  {
    id: "lesson-4-code-5",
    type: "code",
    title: "Code Cell 5",
    content: `model = YOLO("yolov8n.pt")
results = model.train(
    data=fixed_yaml,
    epochs=50,
    imgsz=640,
    batch=16,
    project="YOLO_Demo",
    name="rps_demo_50ep"
)`,
  },
  {
    id: "lesson-4-text-7",
    type: "text",
    title: "Final Confusion Matrix",
    content:
      "This cell evaluates the 50-epoch model using the same low confidence threshold. It is the key comparison point that shows the stronger final result.",
  },
  {
    id: "lesson-4-code-6",
    type: "code",
    title: "Code Cell 6",
    content: `best_model_50 = YOLO("/content/runs/detect/YOLO_Demo/rps_demo_50ep/weights/best.pt")
metrics_50 = best_model_50.val(
    data=fixed_yaml,
    conf=0.01,
    plots=True
)
val_dir_50 = Path(metrics_50.save_dir)

display(Image(filename=str(val_dir_50 / "confusion_matrix.png")))
display(Image(filename=str(val_dir_50 / "confusion_matrix_normalized.png")))`,
  },
  {
    id: "lesson-4-text-8",
    type: "text",
    title: "What Students Should Remember",
    content:
      "The 10-epoch run is the baseline. Lowering `conf` to `0.01` makes more detections visible, and the 50-epoch run is the version that should be presented as the final stronger model.",
  },
];
