// cloudinary.js (or whatever your file name is)

export const uploadToCloudinary = async (file) => {
  if (!file) return null;
  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUD_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const resourceType = file.type.startsWith("video") ? "video" : "image";

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      { method: "POST", body: formData }
    );
if (!response.ok) return null;

    const data = await response.json();

    // THIS IS THE UPDATED RETURN BLOCK
    return { 
      url: data.secure_url, 
      publicId: data.public_id, // This is what the backend needs to delete it later
      type: resourceType 
    };
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};

// ADD THIS HERE
export const handleForceDownload = async (url, filename) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Force download failed, falling back to new tab:", error);
    window.open(url, '_blank');
  }
};