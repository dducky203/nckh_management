import api from "./api";

/**
 * Upload file/image to Cloudinary via backend.
 * @param {File} file
 * @param {string} folder
 * @returns {Promise<string>} URL
 */
export const uploadToCloudinary = async (file, folder = "uploads") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!response?.url) {
    throw new Error("URL not found in response: " + JSON.stringify(response));
  }

  return response.url;
};

/**
 * Upload with progress callback.
 */
export const uploadWithProgress = async (file, folder = "uploads", onProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      if (!onProgress || !progressEvent.total) return;
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );
      onProgress(percentCompleted);
    },
  });

  return response.url;
};

/**
 * Delete file from Cloudinary by URL.
 */
export const deleteFromCloudinary = async (fileUrl) => {
  await api.delete("/delete-file", {
    params: { url: fileUrl },
  });
};

export default uploadToCloudinary;
