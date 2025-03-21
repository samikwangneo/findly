from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
import tensorflow as tf
tf.get_logger().setLevel("ERROR")
import glob
from transformers import CLIPProcessor, CLIPModel
from PIL import Image

app = Flask(__name__)
CORS(app)

NGROK_BASE_URL = 'https://5fb8-2600-387-15-3d10-00-2.ngrok-free.app'
BASE_DIR = r'C:\Users\samik\Repos\lost-found-priv\lost-found-backend'
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
print(f"Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        print("No file part in request")
        return jsonify({'success': False, 'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        print("No selected file")
        return jsonify({'success': False, 'error': 'No selected file'}), 400
    
    latitude = request.form.get('latitude')
    longitude = request.form.get('longitude')
    lost_location = request.form.get('lostLocation', 'Unknown')
    print(f"Received file: {file.filename}, Latitude: {latitude}, Longitude: {longitude}, Lost Location: {lost_location}")
    
    filename_parts = file.filename.rsplit('.', 1)
    filename = f"{filename_parts[0]}__{lost_location.replace(' ', '_')}.{filename_parts[1]}"
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    
    try:
        file.save(file_path)
        if os.path.exists(file_path):
            print(f"File saved successfully: {file_path}")
        else:
            print(f"File save failed: {file_path}")
            return jsonify({'success': False, 'error': 'File not saved to disk'}), 500
    except Exception as e:
        print(f"Error saving file: {e}")
        return jsonify({'success': False, 'error': f"Failed to save file: {e}"}), 500
    
    file_url = f"{NGROK_BASE_URL}/uploads/{filename}"
    print(f"Uploaded file URL: {file_url}")
    return jsonify({'success': True, 'filename': filename, 'url': file_url, 'lostLocation': lost_location}), 200

@app.route('/match', methods=['POST'])
@cross_origin()
def find_match():
    data = request.get_json()
    user_prompt = data.get('description', '')
    lost_location = data.get('lostLocation', 'Unknown')  # Get lostLocation from request
    if not user_prompt:
        return jsonify({'error': 'No description provided'}), 400

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

    text_prompts = [user_prompt]
    inputs = processor(text=text_prompts, images=images, return_tensors="pt", padding=True)
    outputs = model(**inputs)
    logits = outputs.logits_per_image
    probs = logits.softmax(dim=0)

    best_idx = probs[:, 0].argmax()
    best_image_path = valid_paths[best_idx]
    best_prob = probs[best_idx, 0].item()

    best_image_filename = os.path.basename(best_image_path)
    best_image_url = f"{NGROK_BASE_URL}/uploads/{best_image_filename}"
    best_lost_location = best_image_filename.split('__')[1].rsplit('.', 1)[0].replace('_', ' ') if '__' in best_image_filename else 'Unknown'
    print(f"Returning best match URL: {best_image_url}, Location: {best_lost_location}")

    return jsonify({
        'best_match': best_image_url,
        'confidence': best_prob,
        'lostLocation': best_lost_location  # Return the stored lostLocation
    }), 200

@app.route('/uploads/<path:filename>')
@cross_origin()
def serve_uploaded_file(filename):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(file_path):
        print(f"File found, serving: {filename}")
        return send_from_directory(UPLOAD_FOLDER, filename)
    else:
        print(f"File not found: {filename}")
        return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)