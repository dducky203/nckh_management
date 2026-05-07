import { useState, useEffect } from "react";
import { Close, Save, Upload } from "@mui/icons-material";
import { useToast } from "../../../context/ToastContext";
import { ERROR_MESSAGES } from "../../../constants";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { getQuillModules, quillFormats } from "../../../utils/quillConfig";
import "./EventFormModal.css";

const EventFormModal = ({ isOpen, onClose, onSave, event, currentUser }) => {
  const toast = useToast();

  const toTimeInputValue = (value) => {
    if (!value) return "";
    if (typeof value === "string") {
      // ISO LocalDateTime: 2026-01-11T09:00:00
      if (value.includes("T")) return value.split("T")[1].slice(0, 5);
      // LocalTime: 09:00:00 or 09:00
      if (value.includes(":")) return value.slice(0, 5);
      return "";
    }
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toTimeString().slice(0, 5);
    }
    return "";
  };

  const timeToMinutes = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string" || !timeStr.includes(":")) {
      return null;
    }
    const [h, m] = timeStr.split(":");
    const hh = h;
    const mm = m;
    if (isNaN(hh) || isNaN(mm)) return null;
    return hh * 60 + mm;
  };

  const [formData, setFormData] = useState({
    title: "",
    type: "Hội thảo",
    date: "",
    startTime: "08:00",
    endTime: "10:00",
    location: "",
    description: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quill config with Cloudinary upload
  const quillModules = getQuillModules();

  const EVENT_TYPES = ["Hội thảo", "Workshop", "Cuộc thi", "Seminar", "Khác"];

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        type: event.type || "Hội thảo",
        date: event.date || "",
        startTime: toTimeInputValue(event.startTime) || "08:00",
        endTime: toTimeInputValue(event.endTime) || "10:00",
        location: event.location || "",
        description: event.description || "",
        image: null,
      });
    } else {
      setFormData({
        title: "",
        type: "Hội thảo",
        date: "",
        startTime: "08:00",
        endTime: "10:00",
        location: "",
        description: "",
        image: null,
      });
    }
    setErrors({});
  }, [event, currentUser, isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Xử lý thay đổi cho rich text editor
  const handleRichTextChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề sự kiện là bắt buộc";
    }

    if (!formData.date) {
      newErrors.date = "Ngày tổ chức là bắt buộc";
    } else {
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (eventDate < today) {
        newErrors.date = "Ngày tổ chức không thể là ngày trong quá khứ";
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = "Địa điểm tổ chức là bắt buộc";
    }

    if (!formData.description || !formData.description.trim()) {
      newErrors.description = "Mô tả sự kiện là bắt buộc";
    }

    if (formData.startTime && formData.endTime) {
      const startMinutes = timeToMinutes(formData.startTime);
      const endMinutes = timeToMinutes(formData.endTime);
      if (
        startMinutes !== null &&
        endMinutes !== null &&
        endMinutes <= startMinutes
      ) {
        newErrors.endTime = "Giờ kết thúc phải sau giờ bắt đầu";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(formData);
    } catch (err) {
      console.error("Error saving event:", err);
      toast.error(ERROR_MESSAGES.SAVE_EVENT_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {event ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Close />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tiêu đề */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề sự kiện <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập tiêu đề sự kiện"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Loại sự kiện */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại sự kiện <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Ngày tổ chức */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày tổ chức <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.date ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            {/* Giờ bắt đầu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giờ bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Giờ kết thúc */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giờ kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Địa điểm */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa điểm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập địa điểm tổ chức"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            {/* Mô tả */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả sự kiện <span className="text-red-500">*</span>
              </label>
              <div className="bg-white">
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(value) =>
                    handleRichTextChange("description", value || "")
                  }
                  modules={quillModules}
                  formats={quillFormats}
                  className="h-[200px]"
                  placeholder="Mô tả chi tiết về sự kiện..."
                />
              </div>
              <div className="h-16"></div>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Upload ảnh banner */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh đại diện sự kiện
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto text-gray-400 mb-2" />
                <div className="text-sm text-gray-600 mb-2">
                  Kéo thả ảnh vào đây hoặc click để chọn
                </div>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  Chọn ảnh
                </label>
                {formData.image && (
                  <div className="mt-2 text-sm text-green-600">
                    Đã chọn: {formData.image.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center space-x-2 px-6 py-2 rounded-md transition-colors ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              <Save />
              <span>
                {isSubmitting
                  ? "Đang lưu..."
                  : event
                  ? "Cập nhật"
                  : "Tạo sự kiện"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EventFormModal;
