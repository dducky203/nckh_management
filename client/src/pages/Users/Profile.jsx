import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AccountCircle,
  Lock,
  Edit,
  Save,
  Cancel,
  School,
  Badge,
  Email,
  Person,
  PhotoCamera,
  Phone,
  LocationOn,
  Cake,
} from "@mui/icons-material";

import { useToast } from "../../context/ToastContext";
import userService from "../../services/userService";
import noAvatarImg from "../../assets/no-avatar-user.png";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    username: "",
    title: "",
    avatar: "",
    phone: "",
    address: "",
    birthday: "",
  });

  console.log({ user });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
        title: user.title || "",
        avatar: user.avatar || "",
        phone: user.phone || "",
        address: user.address || "",
        birthday: user.birthday ? user.birthday.split("T")[0] : "",
      });
    } else navigate("/login");
  }, [user, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
        title: user.title || "",
        avatar: user.avatar || "",
      });
      setAvatarPreview(null);
      setAvatarFile(null);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        birthday: profileData.birthday,
      };

      const response = await userService.updateUser(user.id, updateData);

      if (response.success) {
        updateUser({
          ...user,
          ...response.data,
        });

        toast.success("Cập nhật thông tin thành công!");
        setIsEditing(false);
      } else {
        toast.error(response.message || "Cập nhật thông tin thất bại!");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin!");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      toast.success("Đổi mật khẩu thành công!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi đổi mật khẩu!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => handleTabChange("info")}
            className={`flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === "info"
                ? "text-mainColor border-b-2 border-mainColor"
                : "text-gray-500 hover:text-mainColor"
            }`}
          >
            <AccountCircle className="w-5 h-5 mr-2" />
            Thông tin cá nhân
          </button>
          <button
            onClick={() => handleTabChange("password")}
            className={`flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === "password"
                ? "text-mainColor border-b-2 border-mainColor"
                : "text-gray-500 hover:text-mainColor"
            }`}
          >
            <Lock className="w-5 h-5 mr-2" />
            Đổi mật khẩu
          </button>
        </div>

        <div className="p-6">
          {activeTab === "info" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Thông tin cá nhân
                </h2>
                <button
                  onClick={handleEditToggle}
                  className={`flex items-center px-4 py-2 rounded-md text-sm ${
                    isEditing
                      ? "bg-gray-200 text-gray-700"
                      : "bg-mainColor text-white"
                  }`}
                  disabled={isLoading}
                >
                  {isEditing ? (
                    <>
                      <Cancel className="w-4 h-4 mr-1" />
                      Hủy
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-1" />
                      Chỉnh sửa
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <img
                      src={avatarPreview || profileData.avatar || noAvatarImg}
                      alt="Avatar"
                      className="w-40 h-40 rounded-full object-cover border-4 border-gray-100 shadow-md"
                    />
                    {isEditing && (
                      <label className="absolute bottom-2 right-2 bg-mainColor text-white p-2 rounded-full cursor-pointer">
                        <PhotoCamera className="w-5 h-5" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{user?.name}</h3>
                    <p className="text-sm font-bold text-gray-500">
                      {user?.title}
                    </p>
                    <div className="flex flex-col gap-1 mt-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                        {user?.role === "admin"
                          ? "Quản trị viên"
                          : "Người dùng"}
                      </span>
                    </div>
                  </div>
                </div>

               
                <div className="flex-1">
                  <form onSubmit={handleProfileSubmit}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Họ và tên
                          </label>
                          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <span className="px-3 py-2 bg-gray-100">
                              <Person className="w-5 h-5 text-gray-500" />
                            </span>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={profileData.name}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              className="w-full py-2 px-3 outline-none disabled:bg-gray-50"
                              placeholder="Họ và tên"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Tên đăng nhập
                          </label>
                          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <span className="px-3 py-2 bg-gray-100">
                              <Badge className="w-5 h-5 text-gray-500" />
                            </span>
                            <input
                              type="text"
                              id="username"
                              name="username"
                              value={profileData.username}
                              onChange={handleProfileChange}
                              disabled={true}
                              className="w-full py-2 px-3 outline-none disabled:bg-gray-50"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                          <span className="px-3 py-2 bg-gray-100">
                            <Email className="w-5 h-5 text-gray-500" />
                          </span>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            disabled={isEditing ? !(user?.role === "admin") : true}
                            className="w-full py-2 px-3 outline-none disabled:bg-gray-50"
                            placeholder="Email"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Chức danh
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                          <span className="px-3 py-2 bg-gray-100">
                            <School className="w-5 h-5 text-gray-500" />
                          </span>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            value={profileData.title}
                            onChange={handleProfileChange}
                            disabled={isEditing ? !(user?.role === "admin") : true}
                            className="w-full py-2 px-3 outline-none disabled:bg-gray-50"
                            placeholder="Chức danh"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Số điện thoại
                          </label>
                          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <span className="px-3 py-2 bg-gray-100">
                              <Phone className="w-5 h-5 text-gray-500" />
                            </span>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={profileData.phone}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              className="w-full py-2 px-3 outline-none disabled:bg-gray-50"
                              placeholder="Số điện thoại"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="birthday"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Ngày sinh
                          </label>
                          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <span className="px-3 py-2 bg-gray-100">
                              <Cake className="w-5 h-5 text-gray-500" />
                            </span>
                            <input
                              type="date"
                              id="birthday"
                              name="birthday"
                              value={profileData.birthday}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              className="w-full py-2 px-3 outline-none disabled:bg-gray-50"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Địa chỉ
                        </label>
                        <div className="flex items-start border border-gray-300 rounded-md overflow-hidden">
                          <span className="px-3 py-2 bg-gray-100">
                            <LocationOn className="w-5 h-5 text-gray-500" />
                          </span>
                          <textarea
                            id="address"
                            name="address"
                            value={profileData.address}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            rows={3}
                            className="w-full py-2 px-3 outline-none disabled:bg-gray-50 resize-none"
                            placeholder="Địa chỉ"
                          />
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex justify-end pt-4">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center bg-mainColor hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-400"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Đổi mật khẩu
              </h2>
              <form
                onSubmit={handlePasswordSubmit}
                className="max-w-md mx-auto"
              >
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                      placeholder="Nhập mật khẩu hiện tại"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`w-full py-2 px-3 border rounded-md outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent ${
                        passwordData.newPassword &&
                        passwordData.newPassword.length < 6
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Nhập mật khẩu mới"
                      required
                      minLength={6}
                    />
                    {passwordData.newPassword &&
                      passwordData.newPassword.length < 6 && (
                        <p className="text-red-500 text-xs mt-1">
                          Mật khẩu phải có ít nhất 6 ký tự
                        </p>
                      )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full py-2 px-3 border rounded-md outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent ${
                        passwordData.confirmPassword &&
                        passwordData.newPassword !==
                          passwordData.confirmPassword
                          ? "border-red-300 bg-red-50"
                          : passwordData.confirmPassword &&
                            passwordData.newPassword ===
                              passwordData.confirmPassword &&
                            passwordData.newPassword.length >= 6
                          ? "border-green-300 bg-green-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Nhập lại mật khẩu mới"
                      required
                      minLength={6}
                    />
                    {passwordData.confirmPassword &&
                      passwordData.newPassword !==
                        passwordData.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          Mật khẩu xác nhận không khớp
                        </p>
                      )}
                    {passwordData.confirmPassword &&
                      passwordData.newPassword ===
                        passwordData.confirmPassword &&
                      passwordData.newPassword.length >= 6 && (
                        <p className="text-green-500 text-xs mt-1">
                          ✓ Mật khẩu khớp
                        </p>
                      )}
                  </div>

                  {/* Password strength indicator */}
                  {passwordData.newPassword && (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Yêu cầu mật khẩu:
                      </h4>
                      <div className="space-y-1">
                        <div
                          className={`flex items-center text-xs ${
                            passwordData.newPassword.length >= 6
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          <span className="mr-2">
                            {passwordData.newPassword.length >= 6 ? "✓" : "○"}
                          </span>
                          Ít nhất 6 ký tự
                        </div>
                        <div
                          className={`flex items-center text-xs ${
                            passwordData.confirmPassword &&
                            passwordData.newPassword ===
                              passwordData.confirmPassword
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          <span className="mr-2">
                            {passwordData.confirmPassword &&
                            passwordData.newPassword ===
                              passwordData.confirmPassword
                              ? "✓"
                              : "○"}
                          </span>
                          Xác nhận mật khẩu khớp
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={
                        isLoading ||
                        !passwordData.currentPassword ||
                        !passwordData.newPassword ||
                        !passwordData.confirmPassword ||
                        passwordData.newPassword.length < 6 ||
                        passwordData.newPassword !==
                          passwordData.confirmPassword
                      }
                      className="bg-mainColor hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
