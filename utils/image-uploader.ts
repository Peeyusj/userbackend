import axios from 'axios';
import { toast } from "sonner";

const fallbackImage = 'https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-1932.jpg?w=1380';

export const startUpload = async (file: File): Promise<string> => {
  const imageFormData = new FormData();
  imageFormData.append("file", file);

  try {
    console.log("Uploading image... ☁️");
    const response = await axios.post("/api/upload", imageFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data.url; // URL of the uploaded image
  } catch (error: any) {
    toast.error("Error uploading image: " + error.message);
    return fallbackImage; // Return fallback image on error
  }
};
