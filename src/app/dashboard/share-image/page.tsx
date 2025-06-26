'use client'

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { getAuthToken } from '@/lib/auth';
import Image from 'next/image';

export default function ShareImage() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": []
    },
    maxFiles: 1
  });

  const uploadImage = async () => {
    if (!uploadedImage) return;
    
    try {
      setUploadStatus("Uploading...");
      
      const token = getAuthToken();
      if (!token) {
        setUploadStatus("Authentication required. Please log in.");
        return;
      }
      
      const formData = new FormData();
      formData.append("image", uploadedImage);
      
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setUploadStatus("Upload successful!");
        setShareLink(result.link);
      } else {
        setUploadStatus(result.error);
      }
    } catch (error) {
      setUploadStatus("Upload failed. Please try again.");
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center cursor-pointer ${
          isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        
        {imagePreview ? (
          <div className="relative h-48 w-full mx-auto mb-2">
            <Image 
              src={imagePreview}
              alt="Preview" 
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        ) : (
          <div className="text-gray-500">
            {isDragActive ? 
              <p>Drop the image here...</p> : 
              <p>Drag and drop an image here, or click to select</p>
            }
          </div>
        )}
        
        {uploadedImage && (
          <p className="mt-2 text-sm text-gray-500">
            Selected: {uploadedImage.name}
          </p>
        )}
      </div>

      <button
        onClick={uploadImage}
        disabled={!uploadedImage || uploadStatus === "Uploading..."}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {uploadStatus === "Uploading..." ? "Uploading..." : "Upload Image"}
      </button>

      {uploadStatus && (
        <div className={`mt-4 p-3 rounded-lg ${
            uploadStatus.includes("failed") 
            ? "bg-red-100 text-red-700"
            : uploadStatus.includes("successful")
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
        }`}>
          <p>{uploadStatus}</p>
          
          {shareLink && (
            <div className="mt-2">
              <p className="font-medium">Share Link:</p>
              <div className="flex mt-1">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-grow p-2 border rounded-l-lg bg-gray-50"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    setUploadStatus("Link copied to clipboard!");
                  }}
                  className="px-4 bg-gray-200 rounded-r-lg hover:bg-gray-300"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}