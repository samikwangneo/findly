from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

NGROK_BASE_URL = 'https://09c6-32-217-55-103.ngrok-free.app'

# Use an absolute path to ensure consistency
BASE_DIR = r'C:\Users\samik\Repos\lost-found-priv\lost-found-backend'
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Creates folder if it doesn’t exist
print(f"Upload server working directory: {os.getcwd()}")
print(f"Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        print("No file part in request")
        return jsonify({'success': False, 'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        print("No selected file")
        return jsonify({'success': False, 'error': 'No selected file'}), 400
        
    # Get location data from form (optional, for debugging or future use)
    latitude = request.form.get('latitude')
    longitude = request.form.get('longitude')
    print(f"Received file: {file.filename}, Latitude: {latitude}, Longitude: {longitude}")
    
    # Save the file with the frontend-provided filename (includes coords)
    filename = file.filename  # e.g., "upload_2025-03-19_10-30-45_40.7128_-74.0060.jpg"
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    print(f"Saving file to: {os.path.abspath(file_path)}")
    
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

    return jsonify({'success': True, 'filename': filename, 'url': file_url}), 200

@app.route('/uploads/<path:filename>')
@cross_origin()  # Add CORS for image serving
def serve_uploaded_file(filename):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    print(f"Attempting to serve file: {os.path.abspath(file_path)}")
    if os.path.exists(file_path):
        print(f"File found, serving: {filename}")
        return send_from_directory(UPLOAD_FOLDER, filename)
    else:
        print(f"File not found: {filename}")
        return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)