import { Quill } from "react-quill-new";
import uploadToCloudinary from "../services/uploadService";

/**
 * Custom image handler for ReactQuill
 * Upload images to Cloudinary instead of base64
 */
export const imageHandler = function () {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    const quill = this.quill;
    const range = quill.getSelection(true);

    // Show loading
    quill.insertText(range.index, "Đang tải ảnh lên...");
    quill.setSelection(range.index + 20);

    try {
      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file, "news-content");

      // Validate imageUrl
      if (!imageUrl) {
        throw new Error("Không nhận được URL ảnh từ server");
      }

      // Remove loading text
      quill.deleteText(range.index, 20);

      // Insert image with Cloudinary URL
      quill.insertEmbed(range.index, "image", imageUrl);
      quill.setSelection(range.index + 1);
    } catch (error) {
      console.error("Upload image error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        stack: error.stack,
      });

      // Remove loading text
      quill.deleteText(range.index, 20);

      const errorMessage =
        error.response?.data?.error || error.message || "Không thể upload ảnh";
      alert("Lỗi upload ảnh: " + errorMessage);
    }
  };
};

/**
 * Quill modules with custom image handler
 */
export const getQuillModules = () => ({
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
    handlers: {
      image: imageHandler,
    },
  },
});

/**
 * Quill formats
 */
export const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "script",
  "indent",
  "color",
  "background",
  "align",
  "link",
  "image",
  "video",
];
