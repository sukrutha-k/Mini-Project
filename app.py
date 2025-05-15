from flask import Flask, request, jsonify
from pymongo import MongoClient
from pdfminer.high_level import extract_text
import os
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for handling cross-origin requests
CORS(app)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["job_scraping_db"]
resumes = db["resumes"]

# Ensure the uploads folder exists
if not os.path.exists('uploads'):
    os.makedirs('uploads')

# Route to check if app is running
@app.route('/')
def home():
    return "Flask app is running!"

# Route to get all resumes
@app.route("/resumes", methods=["GET"])
def get_resumes():
    data = list(resumes.find({}, {"_id": 0}))  # Exclude the MongoDB "_id"
    return jsonify(data)

# Route to upload a PDF resume
@app.route("/upload_resume", methods=["POST"])
def upload_resume():
    # Check if a file was uploaded
    if 'file' not in request.files:
        return jsonify({"msg": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"msg": "No selected file"}), 400

    if file and allowed_file(file.filename):
        # Save the uploaded file to the 'uploads' folder
        filename = os.path.join("uploads", file.filename)
        file.save(filename)

        try:
            # Extract text from the uploaded PDF
            text = extract_text(filename)

            # Convert extracted text to a JSON structure (you can expand this to handle specific fields)
            resume_data = {
                "filename": file.filename,
                "text": text
            }

            # Insert the resume data into MongoDB
            resumes.insert_one(resume_data)

        except Exception as e:
            return jsonify({"msg": f"Error extracting text from PDF: {str(e)}"}), 500

        finally:
            # Delete the file after processing
            os.remove(filename)

        return jsonify({"msg": "Resume uploaded and processed successfully!"}), 201
    else:
        return jsonify({"msg": "Invalid file format. Only PDFs are allowed."}), 400

# Route to update a resume
@app.route("/resumes/<id>", methods=["PUT"])
def update_resume(id):
    updated_data = request.json
    resumes.update_one({"_id": id}, {"$set": updated_data})
    return jsonify({"msg": "Resume updated successfully!"})

# Utility function to check file extension
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'pdf'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")  # To make it accessible on the local network
