import React, { useState } from 'react';
import axios from 'axios';

// Define the response type interface
interface UploadResponse {
  msg: string;
}

const UploadResume: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        // Specify the response type here
        const response = await axios.post<UploadResponse>('http://localhost:5000/upload_resume', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert(response.data.msg); // Handle the response (e.g., show success message)
      } catch (error) {
        console.error('There was an error uploading the resume!', error);
      }
    }
  };

  return (
    <div>
      <h2>Upload Resume</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadResume;

export {};
