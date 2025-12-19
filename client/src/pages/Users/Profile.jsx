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
import researchGroupService from "../../services/researchGroupService";
import noAvatarImg from "../../assets/no-avatar-user.png";
import { AuthContext } from "../../context/AuthContext";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../constants";
import Modal from "../../components/common/Modal";
import ChangePassword from "./components/ChangPassword.jsx";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email || "",
    username: user.username,
    title: user.title || "",
    researchGroup: user.researchGroup || "",
    // avatar: user.avatar || "",
    phone: user.phone || "",
    address: user.address || "",
    birthday: user.birthday ? user.birthday.split("T")[0] : "",
    power: user.power || "",
    inActive: user.inActive,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  // const [avatarFile, setAvatarFile] = useState(null);
  const [showProfileConfirmModal, setShowProfileConfirmModal] = useState(false);
  const [userResearchGroup, setUserResearchGroup] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchUserResearchGroup();
    }
  }, [user, navigate]);

  const fetchUserResearchGroup = async () => {
    try {
      const response = await researchGroupService.getMyGroups();
      const groups = response.data || response;
      
      if (groups && groups.length > 0) {
        // Lấy nhóm đầu tiên (hoặc có thể lấy nhóm active)
        const group = Array.isArray(groups) ? groups[0] : groups;
        const groupName = group.groupName || group.name || "";
        setUserResearchGroup(groupName);
        
        // Cập nhật vào profileData
        setProfileData((prev) => ({
          ...prev,
          researchGroup: groupName,
        }));
      }
    } catch (error) {
      console.error("Error fetching user research group:", error);
      // Không hiển thị lỗi nếu không tìm thấy nhóm
    }
  };

  console.log({ profileData });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setProfileData({
        ...profileData,
        name: user.name,
        email: user.email,
        title: user.title,
        researchGroup: user.researchGroup || "",
      });
      setAvatarPreview(null);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleAvatarChange = (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];
  //     setAvatarFile(file);

  //     // Create preview
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setAvatarPreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!profileData.name || !profileData.email) {
      toast.error(ERROR_MESSAGES.VALIDATION_ERROR);
      return;
    }

    // Show confirmation modal
    setShowProfileConfirmModal(true);
  };

  const handleConfirmUpdateProfile = async () => {
    setIsLoading(true);
    setShowProfileConfirmModal(false);

    try {
      const response = await userService.updateProfile(profileData);

      if (response.success) {
        updateUser({
          ...user,
          ...response.data,
        });

        toast.success(SUCCESS_MESSAGES.UPDATE_PROFILE);
        setIsEditing(false);
      } else {
        toast.error(response.message || ERROR_MESSAGES.SERVER_ERROR);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật thông tin!");
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
                  className={`flex items-center gap-1 px-4 py-2 rounded-md text-sm ${
                    isEditing
                      ? "bg-gray-200 text-gray-700"
                      : "bg-mainColor text-white"
                  }`}
                  disabled={isLoading}
                >
                  {isEditing ? (
                    <>
                      <Cancel />
                      Hủy
                    </>
                  ) : (
                    <>
                      <Edit />
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
                      className="w-40 h-40 rounded-full object-cover border-2 border-gray-300 shadow-md"
                    />
                    {isEditing && (
                      <label
                        title="Đổi avatar"
                        className="absolute bottom-2 right-2 bg-mainColor flex items-center text-white p-2 rounded-md cursor-pointer"
                      >
                        <PhotoCamera fontSize="small" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          // onChange={handleAvatarChange}
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
                            <span className="px-3 py-2 border-r border-gray-300 bg-gray-100">
                              <Person className="w-5 h-5 text-gray-500" />
                            </span>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={profileData.name}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              className="w-full py-2 px-3 border-0 outline-none disabled:bg-gray-50"
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
                            <span className="px-3 py-2 border-r border-gray-300 bg-gray-100">
                              <Badge className="w-5 h-5 text-gray-500" />
                            </span>
                            <input
                              type="text"
                              id="username"
                              name="username"
                              value={profileData.username}
                              onChange={handleProfileChange}
                              disabled={true}
                              className="w-full border-0 py-2 px-3 outline-none disabled:bg-gray-50"
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
                          <span className="px-3 py-2 border-r border-gray-300 bg-gray-100">
                            <Email className="w-5 h-5 text-gray-500" />
                          </span>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            disabled={
                              isEditing ? !(user?.role === "admin") : true
                            }
                            className="w-full border-0 py-2 px-3 outline-none disabled:bg-gray-50"
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
                          <span className="px-3 py-2 border-r border-gray-300 bg-gray-100">
                            <School className="w-5 h-5 text-gray-500" />
                          </span>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            value={profileData.title}
                            onChange={handleProfileChange}
                            disabled={
                              isEditing ? !(user?.role === "admin") : true
                            }
                            className="w-full  py-2 px-3 border-0 outline-none disabled:bg-gray-50"
                            placeholder="Chức danh"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="researchGroup"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nhóm Nghiên Cứu
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                          <span className="px-3 py-2 border-r border-gray-300 bg-gray-100">
                            <School className="w-5 h-5 text-gray-500" />
                          </span>
                          <input
                            type="text"
                            id="researchGroup"
                            name="researchGroup"
                            value={userResearchGroup || profileData.researchGroup}
                            onChange={handleProfileChange}
                            disabled={true}
                            className="w-full py-2 px-3 border-0 outline-none disabled:bg-gray-50"
                            placeholder="Chưa có nhóm nghiên cứu"
                            readOnly
                          />
                        </div>
                        {!userResearchGroup && (
                          <p className="text-xs text-gray-500 mt-1">
                            Nhóm nghiên cứu sẽ tự động hiển thị khi bạn tham gia nhóm hoặc được phân công hướng dẫn
                          </p>
                        )}
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
                            <span className="px-3 py-2 border-r border-gray-300 bg-gray-100">
                              <Phone className="w-5 h-5 text-gray-500" />
                            </span>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={profileData.phone}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              className="w-full border-0 py-2 px-3 outline-none disabled:bg-gray-50"
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
                            <span className="px-3 py-2 border-r border-gray-300 bg-gray-100">
                              <Cake className=" text-gray-500" />
                            </span>
                            <input
                              type="date"
                              id="birthday"
                              name="birthday"
                              value={profileData.birthday}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              className="w-full py-2 px-3 border-0 outline-none disabled:bg-gray-50"
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
                          <span className="border-r border-gray-300 px-3 py-2 bg-gray-100">
                            <LocationOn className=" text-gray-500" />
                          </span>
                          <textarea
                            id="address"
                            name="address"
                            value={profileData.address}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            rows={3}
                            className="w-full py-2 border-0 px-3 outline-none disabled:bg-gray-50 resize-none"
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
              <ChangePassword username={profileData.username} />
            </div>
          )}
        </div>
      </div>

      {/* Modal xác nhận cập nhật thông tin */}
      <Modal
        isOpen={showProfileConfirmModal}
        onClose={() => setShowProfileConfirmModal(false)}
        onConfirm={handleConfirmUpdateProfile}
        title="Xác nhận cập nhật thông tin"
        message="Bạn có chắc chắn muốn cập nhật thông tin cá nhân?"
        confirmText="Cập nhật"
        cancelText="Hủy"
        type="info"
      />
    </div>
  );
};

export default Profile;
