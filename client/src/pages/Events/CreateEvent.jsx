import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Event,
  CalendarMonth,
  LocationOn,
  Person,
  Description,
  Link as LinkIcon,
  Email,
  Phone,
  Category,
  People,
  AttachMoney,
  ArrowBack,
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
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    dateOfEvent: "",
    endDate: "",
    location: "",
    organizer: user?.name || "",
    type: "",
    contactEmail: user?.email || "",
    contactPhone: "",
    registrationLink: "",
    maxParticipants: "",
    fee: "",
    image: "",
  });

  const [errors, setErrors] = useState({});

  const eventTypes = [
    { value: "seminar", label: "Hội thảo" },
    { value: "workshop", label: "Workshop" },
    { value: "conference", label: "Hội nghị" },
    { value: "competition", label: "Cuộc thi" },
    { value: "other", label: "Khác" },
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

    if (!formData.organizer.trim()) {
      newErrors.organizer = "Đơn vị tổ chức là bắt buộc";
    }

    if (!formData.type) {
      newErrors.type = "Loại sự kiện là bắt buộc";
    }

    if (
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.dateOfEvent)
    ) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    if (
      formData.contactEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)
    ) {
      newErrors.contactEmail = "Email không hợp lệ";
    }

    if (
      formData.contactPhone &&
      !/^[0-9]{10,11}$/.test(formData.contactPhone)
    ) {
      newErrors.contactPhone = "Số điện thoại không hợp lệ";
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

      // Prepare data for API
      const eventData = {
        ...formData,
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : null,
        fee: formData.fee ? parseFloat(formData.fee) : 0,
        status: "pending", // Default status
        isEvent: 1, // Mark as event (not research activity)
      };

      await eventService.createEvent(eventData);

      toast.success(
        "Đăng ký sự kiện thành công! Chờ phê duyệt từ quản trị viên."
      );
      navigate("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error.message || "Có lỗi xảy ra khi đăng ký sự kiện!");
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
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="dateOfEvent"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CalendarMonth className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="datetime-local"
                    id="dateOfEvent"
                    name="dateOfEvent"
                    value={formData.dateOfEvent}
                    onChange={handleChange}
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

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ngày kết thúc
                </label>
                <div className="relative">
                  <CalendarMonth className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="datetime-local"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor ${
                      errors.endDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Location & Organizer */}
            <div className="grid md:grid-cols-2 gap-4">
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

              <div>
                <label
                  htmlFor="organizer"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Đơn vị tổ chức <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Person className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="organizer"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor ${
                      errors.organizer ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập đơn vị tổ chức"
                  />
                </div>
                {errors.organizer && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.organizer}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contactEmail"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email liên hệ
                </label>
                <div className="relative">
                  <Email className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor ${
                      errors.contactEmail ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="email@example.com"
                  />
                </div>
                {errors.contactEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contactEmail}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contactPhone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Số điện thoại liên hệ
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor ${
                      errors.contactPhone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0123456789"
                  />
                </div>
                {errors.contactPhone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contactPhone}
                  </p>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="maxParticipants"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Số lượng tham gia tối đa
                </label>
                <div className="relative">
                  <People className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    id="maxParticipants"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    min="1"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                    placeholder="Số lượng người tham gia"
                  />
                </div>
              </div>

             
            </div>

            {/* Registration Link */}
            <div>
              <label
                htmlFor="registrationLink"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Link đăng ký
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  id="registrationLink"
                  name="registrationLink"
                  value={formData.registrationLink}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                  placeholder="https://example.com/register"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Link ảnh sự kiện
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                placeholder="https://example.com/image.jpg"
              />
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
