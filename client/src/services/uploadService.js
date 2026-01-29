import api from "./api";

/**
 * Upload file/image to Cloudinary
 * @param {File} file - File to upload
 * @param {string} folder - Folder name in Cloudinary (default: "uploads")
 * @returns {Promise<string>} - URL of uploaded file
 */
export const uploadToCloudinary = async (file, folder = "uploads") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await api.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  console.log("Upload response:", response);

  // Response interceptor đã unwrap response.data rồi, nên response chính là data
  if (!response) {
    throw new Error("Response is undefined");
  }

  if (!response.url) {
    throw new Error("URL not found in response: " + JSON.stringify(response));
  }

  return response.url;
};

/**
 * Upload file with progress tracking
 * @param {File} file - File to upload
 * @param {string} folder - Folder name
 * @param {function} onProgress - Progress callback (progress) => {}
 * @returns {Promise<string>} - URL of uploaded file
 */
export const uploadWithProgress = async (
  file,
  folder = "uploads",
  onProgress,
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await api.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );
      if (onProgress) {
        onProgress(percentCompleted);
      }
    },
  });

  // Response interceptor đã unwrap response.data rồi
  return response.url;
};

/**
 * Delete file from Cloudinary by URL
 * @param {string} fileUrl - Cloudinary file URL to delete
 * @returns {Promise<void>}
 */
export const deleteFromCloudinary = async (fileUrl) => {
  await api.delete("/api/delete-file", {
    params: { url: fileUrl },
  });
};

export default uploadToCloudinary;
