import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  PhotoCamera
} from '@mui/icons-material';
// import { AuthContext } from '../../context/AuthContext';


import { useToast } from '../../context/ToastContext';
// import {userAPI} from '../../services/apiService';

import noAvatarImg from '../../assets/no-avatar-user.png';
// import { getUserInfo, setUserInfo } from '../../utils/cookieUtils';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    username: '',
    title: '',
    avatar: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  // Load user data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        title: user.title || '',
        avatar: user.avatar || '',
      });
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset editing state when changing tabs
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset to original data when starting to edit
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        title: user.title || '',
        avatar: user.avatar || '',
      });
      setAvatarPreview(null);
      setAvatarFile(null);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
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
      // Create form data for multipart/form-data (for avatar upload)
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        if (key !== 'avatar') {
          formData.append(key, profileData[key]);
        }
      });
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      // Call API to update profile
      const response = await authAPI.updateProfile(formData);
      
      if (response.success) {
        // Update user in context and cookie
        updateUser({
          ...user,
          ...response.userData
        });
        
        toast.success('Cập nhật thông tin thành công!');
        setIsEditing(false);
      } else {
        toast.error('Cập nhật thông tin thất bại!');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật thông tin!');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp!');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call API to change password
      const response = await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        toast.success('Đổi mật khẩu thành công!');
        // Reset form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(response.message || 'Đổi mật khẩu thất bại!');
      }
    } catch (error) {
      console.error('Change password error:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi đổi mật khẩu!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => handleTabChange('info')}
            className={`flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === 'info' 
                ? 'text-mainColor border-b-2 border-mainColor'
                : 'text-gray-500 hover:text-mainColor'
            }`}
          >
            <AccountCircle className="w-5 h-5 mr-2" />
            Thông tin cá nhân
          </button>
          <button
            onClick={() => handleTabChange('password')}
            className={`flex items-center px-6 py-3 text-sm font-medium ${
              activeTab === 'password' 
                ? 'text-mainColor border-b-2 border-mainColor'
                : 'text-gray-500 hover:text-mainColor'
            }`}
          >
            <Lock className="w-5 h-5 mr-2" />
            Đổi mật khẩu
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'info' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Thông tin cá nhân</h2>
                <button
                  onClick={handleEditToggle}
                  className={`flex items-center px-4 py-2 rounded-md text-sm ${
                    isEditing
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-mainColor text-white'
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
                {/* Avatar Section */}
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
                    <p className="text-sm text-gray-500">{user?.title}</p>
                  </div>
                </div>

                {/* Form Section */}
                <div className="flex-1">
                  <form onSubmit={handleProfileSubmit}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
                          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
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
                              disabled={true} // Username usually can't be changed
                              className="w-full py-2 px-3 outline-none disabled:bg-gray-50"
                              placeholder="Mã số"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                            disabled={!isEditing}
                            className="w-full py-2 px-3 outline-none disabled:bg-gray-50"
                            placeholder="Email"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
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
                            disabled={!isEditing}
                            className="w-full py-2 px-3 outline-none disabled:bg-gray-50"
                            placeholder="Chức danh"
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
                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Đổi mật khẩu</h2>
              <form onSubmit={handlePasswordSubmit} className="max-w-md mx-auto">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
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
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                      placeholder="Nhập mật khẩu mới"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                      placeholder="Nhập lại mật khẩu mới"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-mainColor hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors disabled:bg-gray-400"
                    >
                      {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
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