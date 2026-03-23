// Paste this into a lesson object in client/src/data/lessons.ts
cells: [
  {
    id: "lesson-1-text-1",
    type: "text",
    title: `Chapter 0 – Prerequisites for AI Mechatronics`,
    content: `# Chapter 0 – Prerequisites for AI Mechatronics
**Course:** Special Topics in Mechatronics Engineering  
**Instructor:** Dr. Mohammad Al Khawaldah  
**Last Updated:** 2026-02-16

---

## 🎯 Goal of Chapter 0

By the end of this notebook, every student will be able to:

✔ Open Google Colab  
✔ Run Python code  
✔ Understand basic Python logic  
✔ Read an image using OpenCV  
✔ Use AI assistant (Gemini/ChatGPT) for debugging  
✔ Understand GPU vs CPU  
✔ Mount Google Drive  

👉 After finishing this chapter, you are ready for Computer Vision labs.`,
  },
  {
    id: "lesson-1-text-2",
    type: "text",
    title: `1️⃣ How to Open Google Colab`,
    content: `# 1️⃣ How to Open Google Colab

Follow these steps carefully:

1. Open **https://colab.research.google.com**
2. Login using your university email (Outlook is OK).
3. Click **File → Save a copy in Drive**
4. Rename file:
   \`STME_Chapter0_YourName.ipynb\`
5. Click **Runtime → Run all**

If a cell shows ▶ icon, click it to run.

If error happens → read error → ask AI assistant.

👉 Colab runs on **Google servers**, not your laptop.`,
  },
  {
    id: "lesson-1-text-3",
    type: "text",
    title: `2️⃣ What is CPU vs GPU`,
    content: `# 2️⃣ What is CPU vs GPU

CPU = General processor (good for logic)

GPU = Parallel processor (good for AI & images)

To enable GPU:
Runtime → Change runtime type → GPU

We will check GPU below.`,
  },
  {
    id: "lesson-1-code-1",
    type: "code",
    title: `Code Cell 1`,
    content: `import torch

if torch.cuda.is_available():
    print("GPU is available")
    print("GPU Name:", torch.cuda.get_device_name(0))
else:
    print("GPU NOT available (CPU only)")`,
  },
  {
    id: "lesson-1-text-4",
    type: "text",
    title: `3️⃣ Python Basics for Mechatronics`,
    content: `# 3️⃣ Python Basics for Mechatronics

We will learn Python using real engineering examples.`,
  },
  {
    id: "lesson-1-code-2",
    type: "code",
    title: `Code Cell 2`,
    content: `print("Hello Mechatronics Students!")`,
  },
  {
    id: "lesson-1-text-5",
    type: "text",
    title: `Variables`,
    content: `### Variables`,
  },
  {
    id: "lesson-1-code-3",
    type: "code",
    title: `Code Cell 3`,
    content: `speed = 5
distance = 10
time = distance / speed
print("Time needed =", time)`,
  },
  {
    id: "lesson-1-text-6",
    type: "text",
    title: `If Statement Example – Turn LED ON if light is low`,
    content: `### If Statement Example – Turn LED ON if light is low`,
  },
  {
    id: "lesson-1-code-4",
    type: "code",
    title: `Code Cell 4`,
    content: `light_value = 30  # pretend sensor value

if light_value < 50:
    print("LED ON")
else:
    print("LED OFF")`,
  },
  {
    id: "lesson-1-text-7",
    type: "text",
    title: `Loops Example – Scan 5 camera frames`,
    content: `### Loops Example – Scan 5 camera frames`,
  },
  {
    id: "lesson-1-code-5",
    type: "code",
    title: `Code Cell 5`,
    content: `for i in range(5):
    print("Processing frame", i)`,
  },
  {
    id: "lesson-1-text-8",
    type: "text",
    title: `Functions Example – Detect if truck is overloaded`,
    content: `### Functions Example – Detect if truck is overloaded`,
  },
  {
    id: "lesson-1-code-6",
    type: "code",
    title: `Code Cell 6`,
    content: `def is_overloaded(weight, limit):
    return weight > limit

print(is_overloaded(12,10))
print(is_overloaded(5,10))`,
  },
  {
    id: "lesson-1-text-9",
    type: "text",
    title: `✅ Exercise 1`,
    content: `## ✅ Exercise 1

Change the function so it prints:

"SAFE" if weight ≤ limit  
"OVERLOAD" if weight > limit`,
  },
  {
    id: "lesson-1-code-7",
    type: "code",
    title: `Code Cell 7`,
    content: `def check_truck(weight, limit):
    # TODO: write your code
    pass

print(check_truck(15,10))`,
  },
  {
    id: "lesson-1-text-10",
    type: "text",
    title: `Lists and Dictionaries (important for AI results)`,
    content: `### Lists and Dictionaries (important for AI results)`,
  },
  {
    id: "lesson-1-code-8",
    type: "code",
    title: `Code Cell 8`,
    content: `detections = ["truck", "person", "helmet"]
for d in detections:
    print("Detected:", d)

truck_info = {"plate":"12345", "load":"sand", "covered":False}
print(truck_info["plate"])`,
  },
  {
    id: "lesson-1-text-11",
    type: "text",
    title: `4️⃣ First Computer Vision Example`,
    content: `# 4️⃣ First Computer Vision Example

We will read an image using OpenCV.`,
  },
  {
    id: "lesson-1-code-9",
    type: "code",
    title: `Code Cell 9`,
    content: `!pip -q install opencv-python matplotlib`,
  },
  {
    id: "lesson-1-code-10",
    type: "code",
    title: `Code Cell 10`,
    content: `import cv2
import numpy as np
from matplotlib import pyplot as plt

# Create fake image
img = np.zeros((200,200,3), dtype=np.uint8)
img[50:150, 50:150] = (0,255,0)

plt.imshow(img)
plt.title("Synthetic Image")
plt.axis("off")`,
  },
  {
    id: "lesson-1-text-12",
    type: "text",
    title: `Exercise 2`,
    content: `## Exercise 2

Modify the code to create a RED square instead of GREEN.`,
  },
  {
    id: "lesson-1-text-13",
    type: "text",
    title: `5️⃣ Mount Google Drive`,
    content: `# 5️⃣ Mount Google Drive

We store datasets here.`,
  },
  {
    id: "lesson-1-code-11",
    type: "code",
    title: `Code Cell 11`,
    content: `from google.colab import drive
drive.mount('/content/drive')`,
  },
  {
    id: "lesson-1-text-14",
    type: "text",
    title: `After mounting, your files appear in \`/content/drive/MyDrive\``,
    content: `After mounting, your files appear in \`/content/drive/MyDrive\``,
  },
  {
    id: "lesson-1-text-15",
    type: "text",
    title: `6️⃣ Using AI Assistant (Gemini / ChatGPT)`,
    content: `# 6️⃣ Using AI Assistant (Gemini / ChatGPT)

When code fails:

1. Copy error message
2. Ask AI assistant:
   "Explain this Python error"

3. Ask:
   "Rewrite code for Google Colab"

AI tools are part of engineering workflow.`,
  },
  {
    id: "lesson-1-text-16",
    type: "text",
    title: `7️⃣ Mini Project – Brightness Detector`,
    content: `# 7️⃣ Mini Project – Brightness Detector

We simulate camera brightness and decide if light should turn ON.`,
  },
  {
    id: "lesson-1-code-12",
    type: "code",
    title: `Code Cell 12`,
    content: `import random

def decide_light():
    brightness = random.randint(0,100)
    print("Brightness =", brightness)
    if brightness < 40:
        print("Turn LED ON")
    else:
        print("Turn LED OFF")

for i in range(5):
    decide_light()`,
  },
  {
    id: "lesson-1-text-17",
    type: "text",
    title: `Exercise 3`,
    content: `## Exercise 3

Modify the code so LED turns ON only if brightness < 30.`,
  },
  {
    id: "lesson-1-text-18",
    type: "text",
    title: `🎯 What You Learned`,
    content: `# 🎯 What You Learned

You can now:

✔ Run Colab  
✔ Use Python basics  
✔ Understand CPU vs GPU  
✔ Read images  
✔ Use AI assistant  
✔ Mount Drive  

👉 Next Chapter: Introduction to Computer Vision.`,
  },
],
