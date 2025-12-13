import { useState, useContext, useEffect } from "react";
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
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  fetchRoomsData,
  getRoomOptions,
  getRoomsDataSync,
} from "../../utils/roomsData";
import eventService from "../../services/eventService";
import Button from "../../components/common/Button";
import { EVENT_CATEGORIES, TIME_SLOTS } from "../../utils";
import { ERROR_MESSAGES } from "../../constants";

const CreateEvent = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    dateOfEvent: "",
    startTime: "",
    endTime: "",
    roomId: "",
    type: "",
  });

  // Fetch rooms khi component mount
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setRoomsLoading(true);
        await fetchRoomsData();
        setRooms(getRoomsDataSync());
      } catch (error) {
        console.error("Error loading rooms:", error);
        toast.error(ERROR_MESSAGES.LOAD_ROOM_ERROR);
      } finally {
        setRoomsLoading(false);
      }
    };

    loadRooms();
  }, [toast]);

  console.log("Rooms debug:", {
    rooms,
    roomsLength: rooms?.length,
    roomsLoading,
    getRoomOptions: getRoomOptions(),
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error(ERROR_MESSAGES.FILE_TYPE_ERROR);
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(ERROR_MESSAGES.FILE_SIZE_ERROR);
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

    if (!formData.roomId) {
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
      toast.error(ERROR_MESSAGES.FORM.CHECK_INFO);
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
      submitData.append("roomId", formData.roomId);
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
                  {EVENT_CATEGORIES.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
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
              <div className="bg-white">
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ color: [] }, { background: [] }],
                      [{ align: [] }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "list",
                    "bullet",
                    "color",
                    "background",
                    "align",
                    "link",
                    "image",
                  ]}
                  className="h-[300px]"
                  placeholder="Nhập mô tả chi tiết về sự kiện..."
                />
              </div>
              <div className="h-16"></div>
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
                    {TIME_SLOTS.map((slot) => (
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
                    {TIME_SLOTS.map((slot) => (
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

            {/* Location/Room */}
            <div>
              <label
                htmlFor="roomId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Địa điểm <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <LocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  id="roomId"
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleChange}
                  disabled={roomsLoading}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">
                    {roomsLoading ? "Đang tải..." : "Chọn địa điểm tổ chức"}
                  </option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.displayName}
                    </option>
                  ))}
                </select>
              </div>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
              {roomsLoading && (
                <p className="text-gray-500 text-sm mt-1">
                  Đang tải danh sách phòng...
                </p>
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
