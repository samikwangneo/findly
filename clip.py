from flask import Flask, request, jsonify
import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
import tensorflow as tf
tf.get_logger().setLevel("ERROR")
import glob
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
from flask import send_from_directory

BASE_URL = 'https://09c6-32-217-55-103.ngrok-free.app'

UPLOAD_FOLDER = 'lost-found-backend/uploads'  # Must match the upload server's folder for local testing
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
print(f"Model server working directory: {os.getcwd()}")
print(f"Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")

app = Flask(__name__)
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

@app.route('/match', methods=['POST'])
def find_match():
    data = request.get_json()
    user_prompt = data.get('description', '')
    if not user_prompt:
        return jsonify({'error': 'No description provided'}), 400

    # Load images from the found_items folder
    image_paths = glob.glob(f"{UPLOAD_FOLDER}/*.jpg")
    if not image_paths:
        return jsonify({'error': 'No images found'}), 404

    images = []
    valid_paths = []
    for path in image_paths:
        try:
            img = Image.open(path).convert("RGB")
            images.append(img)
            valid_paths.append(path)
        except Exception as e:
            print(f"Skipping {path}: {e}")

    if not images:
        return jsonify({'error': 'No valid images loaded'}), 500

    # Process with CLIP
    text_prompts = [user_prompt]
    inputs = processor(text=text_prompts, images=images, return_tensors="pt", padding=True)
    outputs = model(**inputs)
    logits = outputs.logits_per_image
    probs = logits.softmax(dim=0)

    # Find best match
    best_idx = probs[:, 0].argmax()
    best_image_path = valid_paths[best_idx]
    best_prob = probs[best_idx, 0].item()

    best_image_filename = os.path.basename(best_image_path)
    best_image_url = f"{BASE_URL}/uploads/{best_image_filename}"
    print(f"Returning best match URL: {best_image_url}")

    return jsonify({
        'best_match': best_image_url,
        'confidence': best_prob
    }), 200

@app.route('/lost-found-backend/uploads/<path:filename>')
def serve_uploaded_file(filename):
    return send_from_directory('lost-found-backend/uploads', filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5100, debug=True)