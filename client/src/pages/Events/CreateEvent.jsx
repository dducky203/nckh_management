import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Event,
  CalendarMonth,
  LocationOn,
  Description,
  Category,
  ArrowBack,
  CloudUpload,
  AccessTime,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import eventService from "../../services/eventService";
import Button from "../../components/common/Button";

const CreateEvent = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    dateOfEvent: "",
    startTime: "",
    endTime: "",
    location: "",
    type: "",
  });

  const [errors, setErrors] = useState({});

  const eventTypes = [
    { value: "seminar", label: "Hội thảo" },
    { value: "workshop", label: "Workshop" },
    { value: "conference", label: "Hội nghị" },
    { value: "competition", label: "Cuộc thi" },
    { value: "other", label: "Khác" },
  ];

  const timeSlots = [
    { value: 1, label: "Tiết 1 (7:00 - 7:50)" },
    { value: 2, label: "Tiết 2 (8:00 - 8:50)" },
    { value: 3, label: "Tiết 3 (9:00 - 9:50)" },
    { value: 4, label: "Tiết 4 (10:00 - 10:50)" },
    { value: 5, label: "Tiết 5 (11:00 - 11:50)" },
    { value: 6, label: "Tiết 6 (13:00 - 13:50)" },
    { value: 7, label: "Tiết 7 (14:00 - 14:50)" },
    { value: 8, label: "Tiết 8 (15:00 - 15:50)" },
    { value: 9, label: "Tiết 9 (16:00 - 16:50)" },
    { value: 10, label: "Tiết 10 (17:00 - 17:50)" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file ảnh (JPG, PNG, GIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.eventName.trim()) {
      newErrors.eventName = "Tên sự kiện là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả sự kiện là bắt buộc";
    }

    if (!formData.dateOfEvent) {
      newErrors.dateOfEvent = "Ngày tổ chức là bắt buộc";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Địa điểm là bắt buộc";
    }

    if (!formData.type) {
      newErrors.type = "Loại sự kiện là bắt buộc";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Tiết bắt đầu là bắt buộc";
    }

    if (!formData.endTime) {
      newErrors.endTime = "Tiết kết thúc là bắt buộc";
    }

    if (
      formData.startTime &&
      formData.endTime &&
      parseInt(formData.endTime) < parseInt(formData.startTime)
    ) {
      newErrors.endTime = "Tiết kết thúc phải sau tiết bắt đầu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      setLoading(true);

      // Tạo FormData để gửi file và data
      const submitData = new FormData();

      // Thêm file banner nếu có
      if (imageFile) {
        submitData.append("banner", imageFile);
      }

      // Thêm các trường dữ liệu
      submitData.append("eventName", formData.eventName);
      submitData.append("dateOfEvent", formData.dateOfEvent);
      submitData.append("startTime", formData.startTime || 1);
      submitData.append("endTime", formData.endTime || 5);
      submitData.append("location", formData.location);
      submitData.append("type", formData.type);
      submitData.append("description", formData.description);
      submitData.append("creator", user?.id);

      await eventService.createEvent(submitData);

      toast.success(
        "Đăng ký sự kiện thành công! Chờ phê duyệt từ quản trị viên."
      );
      navigate("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi đăng ký sự kiện!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/events")}
            className="flex items-center text-mainColor hover:text-mainColor/80 mb-4"
          >
            <ArrowBack className="mr-2" />
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Đăng ký tổ chức sự kiện
          </h1>
          <p className="text-gray-600">
            Điền thông tin chi tiết về sự kiện của bạn. Sự kiện sẽ được xem xét
            và phê duyệt bởi quản trị viên.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="space-y-6">
            {/* Event Name */}
            <div>
              <label
                htmlFor="eventName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tên sự kiện <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Event className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor ${
                    errors.eventName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập tên sự kiện"
                />
              </div>
              {errors.eventName && (
                <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>
              )}
            </div>

            {/* Event Type */}
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Loại sự kiện <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Category className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor ${
                    errors.type ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Chọn loại sự kiện</option>
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mô tả sự kiện <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Description className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Mô tả chi tiết về sự kiện..."
                />
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Date & Time */}
            <div>
              <label
                htmlFor="dateOfEvent"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ngày tổ chức <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CalendarMonth className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  id="dateOfEvent"
                  name="dateOfEvent"
                  value={formData.dateOfEvent}
                  onChange={handleChange}
                  min={
                    new Date(Date.now() + 86400000).toISOString().split("T")[0]
                  }
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor ${
                    errors.dateOfEvent ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.dateOfEvent && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dateOfEvent}
                </p>
              )}
            </div>

            {/* Time Slots */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tiết bắt đầu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <AccessTime className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor ${
                      errors.startTime ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Chọn tiết bắt đầu</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.startTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startTime}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tiết kết thúc <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <AccessTime className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor ${
                      errors.endTime ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Chọn tiết kết thúc</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.endTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Địa điểm <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <LocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập địa điểm tổ chức"
                />
              </div>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner sự kiện
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-mainColor transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <div className="flex justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setFormData((prev) => ({ ...prev, image: "" }));
                        }}
                      >
                        Xóa ảnh
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <CloudUpload
                      className="mx-auto text-gray-400"
                      fontSize="large"
                    />
                    <p className="text-gray-600">
                      {/*{uploadingImage*/}
                      {/*  ? "Đang upload..."*/}
                      {/*  : "Click để chọn ảnh hoặc kéo thả vào đây"}*/}
                    </p>
                    <p className="text-sm text-gray-400">
                      JPG, PNG, GIF tối đa 5MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      // disabled={uploadingImage}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label htmlFor="imageUpload">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("imageUpload").click()
                        }
                        // disabled={uploadingImage}
                        className="cursor-pointer"
                      >
                        Chọn ảnh
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/events")}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-mainColor text-white hover:bg-mainColor/90"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Đăng ký sự kiện"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
