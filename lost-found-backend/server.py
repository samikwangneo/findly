from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No selected file'}), 400
        
    # Get location data from form (optional, for debugging or future use)
    latitude = request.form.get('latitude')
    longitude = request.form.get('longitude')
    print(f"Received file: {file.filename}, Latitude: {latitude}, Longitude: {longitude}")
    
    # Save the file with the frontend-provided filename (includes coords)
    filename = file.filename  # e.g., "upload_2025-03-19_10-30-45_40.7128_-74.0060.jpg"
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    
    return jsonify({'success': True, 'filename': file.filename}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)