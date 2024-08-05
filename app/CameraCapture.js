"use client";

import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import { Box, Button, Typography } from '@mui/material';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase';

export default function CameraCapture() {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  const handleTakePhoto = () => {
    console.log("Taking photo...");
    const photo = camera.current.takePhoto();
    if (photo) {
      console.log("Photo taken:", photo);
      setImage(photo);
    } else {
      console.error("Failed to take photo");
    }
  };

  const handleUpload = () => {
    if (image) {
      console.log("Uploading image...");
      const storageRef = ref(storage, `images/${new Date().toISOString()}.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, dataURItoBlob(image));

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrl(downloadURL);
            console.log("Image uploaded successfully. URL:", downloadURL);
          });
        }
      );
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 4,
        p: 2,
        bgcolor: '#333', // Black background
        borderRadius: '8px',
        color: '#fff',
      }}
    >
      <Typography variant="h5">Take and Upload Image</Typography>
      <Camera ref={camera} />
      <Button
        variant="contained"
        sx={{ mt: 2, backgroundColor: '#ff6f00', '&:hover': { backgroundColor: '#e64a00' } }}
        onClick={handleTakePhoto}
      >
        Take Photo
      </Button>
      {image && (
        <>
          <img src={image} alt='Taken photo' style={{ marginTop: '20px', maxHeight: '300px' }} />
          <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: '#ff6f00', '&:hover': { backgroundColor: '#e64a00' } }}
            onClick={handleUpload}
          >
            Upload
          </Button>
        </>
      )}
      {progress > 0 && <Typography>Upload Progress: {progress}%</Typography>}
      {imageUrl && <Typography>Image URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a></Typography>}
    </Box>
  );
}
