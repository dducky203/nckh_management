import { useState, useEffect } from "react";
import { Close, Save, Visibility, VisibilityOff } from "@mui/icons-material";
import { useToast } from "../../../context/ToastContext";
import { roleStringToInt, titleStringToInt } from "../../../utils/helpers";
import { formatDateForInput } from "../../../utils/dateHelpers";

const UserFormModal = ({ isOpen, onClose, onSave, user }) => {
  const toast = useToast();

  const [formData, setFormData] = useState({
    id: "",
    username: "",
    name: "",
    email: "",
    phone: "",
    birthday: "",
    address: "",
    power: 4,
    idRole: 2,
    idTitle: 5,
    inActive: 0,
  });

  // Helper function to normalize inActive value
  const normalizeInActiveValue = (value) => {
    if (value === true || value === 1 || value === "1") return 1;
    if (value === false || value === 0 || value === "0") return 0;
    return 0;
  };


  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        birthday: formatDateForInput(user.birthday),
        address: user.address || "",
        power: user.power,
        idRole: roleStringToInt(user.role),
        idTitle: titleStringToInt(user.title),
        inActive: normalizeInActiveValue(user.inActive),
      });
    } else {
      setFormData({
        username: "",
        name: "",
        email: "",
        phone: "",
        birthday: "",
        address: "",
        power: 4,
        idRole: 2,
        idTitle: 5,
        inActive: 0,
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.name || !formData.email) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    const success = await onSave(formData);
    if (success) {
      onClose();
    }
  };

  console.log({ formData });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
          <h3 className="text-base font-semibold">
            {user ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Close className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Mã người dùng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                placeholder="Nhập mã người dùng"
                disabled={!!user}
                required
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                placeholder="Nhập email"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* Birthday */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) =>
                  setFormData({ ...formData, birthday: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
              />
            </div>
            {/* InActive Toggle */}
            {user && (
              <div className="mt-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Trạng thái hoạt động
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-semibold ${
                        normalizeInActiveValue(formData.inActive) === 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {normalizeInActiveValue(formData.inActive) === 0
                        ? "Hoạt động"
                        : "Không hoạt động"}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          normalizeInActiveValue(formData.inActive) === 0
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            inActive: e.target.checked ? 0 : 1,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div
                        className={`w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-1 transition-all duration-300 shadow-inner ${
                          normalizeInActiveValue(formData.inActive) === 0
                            ? "bg-green-500 peer-focus:ring-green-300"
                            : "bg-red-500 peer-focus:ring-red-300"
                        } peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300 after:shadow-md`}
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                placeholder="Nhập địa chỉ"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-3">
            {/* Role */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.idRole}
                onChange={(e) =>
                  setFormData({ ...formData, idRole: parseInt(e.target.value) })
                }
                className="w-full font-bold px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                required
              >
                <option value={1}>ROLE ADMIN</option>
                <option value={2}>ROLE USER</option>
              </select>
            </div>

            {/* Power */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Vai trò <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.power}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    power: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                required
              >
                <option value={1}>Trưởng khoa</option>
                <option value={2}>Phó khoa</option>
                <option value={3}>Cán bộ</option>
                <option value={4}>Sinh viên</option>
              </select>
            </div>

            {/* idTitle */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Học vị <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.idTitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    idTitle: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
                required
              >
                <option value={1}>GS/PGS</option>
                <option value={2}>TS</option>
                <option value={3}>THS</option>
                <option value={4}>KS/CN</option>
                <option value={5}>Sinh viên</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm bg-mainColor text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              <Save className="w-4 h-4" />
              {user ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
