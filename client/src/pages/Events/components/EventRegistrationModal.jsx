import { useState } from "react";
import {
  Close,
  Person,
  Email,
  Phone,
  School,
  CheckCircle,
} from "@mui/icons-material";
import Button from "../../../components/common/Button";
import { useToast } from "../../../context/ToastContext";

const EventRegistrationModal = ({
  isOpen,
  onClose,
  event,
  user,
  onConfirm,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    organization: user?.title || "",
    note: "",
  });
  const [errors, setErrors] = useState({});

  if (!isOpen || !event) return null;

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

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ tên là bắt buộc";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
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

      // Call parent's onConfirm if provided
      if (onConfirm) {
        await onConfirm(formData);
        onClose();
      } else {
        // Fallback: simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success("Đăng ký tham gia sự kiện thành công!");
        onClose();
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      // Don't close modal on error
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-mainColor to-[#154c6e] text-white p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <Close />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-yellow-300" fontSize="large" />
              <h2 className="text-2xl font-bold">Đăng ký tham gia sự kiện</h2>
            </div>
            <p className="text-white/90">
              Điền thông tin của bạn để đăng ký tham gia sự kiện
            </p>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
            {/* Event Info */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-gray-800 mb-2">
                {event.eventName}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Thời gian:</strong> {formatDate(event.dateOfEvent)}{" "}
                  lúc {formatTime(event.dateOfEvent)}
                </p>
                {event.location && (
                  <p>
                    <strong>Địa điểm:</strong> {event.location}
                  </p>
                )}

                {event.maxParticipants && (
                  <p>
                    <strong>Số lượng:</strong> Tối đa {event.maxParticipants}{" "}
                    người
                  </p>
                )}
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Person className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Email className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0123456789"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Organization */}
              <div>
                <label
                  htmlFor="organization"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Đơn vị/Trường học
                </label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                    placeholder="Nhập tên đơn vị hoặc trường học"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label
                  htmlFor="note"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ghi chú
                </label>
                <textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor resize-none"
                  placeholder="Ghi chú hoặc câu hỏi (nếu có)"
                />
              </div>

              {/* Terms */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Bằng việc đăng ký, bạn đồng ý với các điều khoản và điều kiện
                  của sự kiện. Thông tin của bạn sẽ được sử dụng để liên lạc và
                  gửi thông tin liên quan đến sự kiện.
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t bg-white p-4">
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-mainColor text-white hover:bg-mainColor/90"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Xác nhận đăng ký"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationModal;
