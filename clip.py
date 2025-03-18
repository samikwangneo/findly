import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0" 

import tensorflow as tf
tf.get_logger().setLevel("ERROR")

import glob
import matplotlib.pyplot as plt

from transformers import CLIPProcessor, CLIPModel
from PIL import Image

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

image_paths = glob.glob("found_items/*.jpg")  # Adjust extension if needed (e.g., *.png)
if not image_paths:
    print("Error: No images found in 'found_items' folder. Check the path and file extensions.")
    exit()

images = []
valid_paths = []
for path in image_paths:
    try:
        img = Image.open(path).convert("RGB")
        images.append(img)
        valid_paths.append(path)
    except Exception as e:
        print(f"Warning: Skipping {path} due to error: {e}")

if not images:
    print("Error: No valid images loaded. Check your files.")
    exit()

user_prompt = input("Enter a description of what you're looking for (e.g., 'a red backpack'): ")
text_prompts = [user_prompt]

inputs = processor(text=text_prompts, images=images, return_tensors="pt", padding=True)

outputs = model(**inputs)
logits = outputs.logits_per_image
probs = logits.softmax(dim=0) 

print("\nProbabilities for each image:")
for i, path in enumerate(valid_paths):
    print(f"{path}: {probs[i, 0]:.4f}")

best_idx = probs[:, 0].argmax()
best_image = valid_paths[best_idx]
best_prob = probs[best_idx, 0]

print(f"\nBest match: '{best_image}' with confidence {best_prob:.4f}")

plt.imshow(Image.open(best_image))
plt.title(f"Best match: {best_prob:.4f}")
plt.show()