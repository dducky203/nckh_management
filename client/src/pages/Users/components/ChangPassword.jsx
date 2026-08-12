import  { useState } from "react";
import { Lock } from "@mui/icons-material";
import { useToast } from "../../../context/ToastContext";
import userService from "../../../services/userService";
import Modal from "../../../components/common/Modal";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../../constants";

const ChangePassword = ({ username }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(ERROR_MESSAGES.FORM.PASSWORDS_NOT_MATCH);
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 6) {
      toast.error(ERROR_MESSAGES.FORM.PASSWORD_TOO_SHORT);
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmChangePassword = async () => {
    setIsLoading(true);
    setShowConfirmModal(false);

    try {
      const changePasswordData = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };

      await userService.changePassword(username, changePasswordData);

      toast.success(SUCCESS_MESSAGES.USER.CHANGE_PASSWORD);

      // Reset form
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
    <>
      <form onSubmit={handlePasswordSubmit} className="max-w-md mx-auto">
        <div className="space-y-4">
          {/* Current Password */}
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

          {/* New Password */}
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
                passwordData.newPassword && passwordData.newPassword.length < 6
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

          {/* Confirm Password */}
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
                passwordData.newPassword !== passwordData.confirmPassword
                  ? "border-red-300 bg-red-50"
                  : passwordData.confirmPassword &&
                    passwordData.newPassword === passwordData.confirmPassword &&
                    passwordData.newPassword.length >= 6
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300"
              }`}
              placeholder="Nhập lại mật khẩu mới"
              required
              minLength={6}
            />
            {passwordData.confirmPassword &&
              passwordData.newPassword !== passwordData.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  Mật khẩu xác nhận không khớp
                </p>
              )}
            {passwordData.confirmPassword &&
              passwordData.newPassword === passwordData.confirmPassword &&
              passwordData.newPassword.length >= 6 && (
                <p className="text-green-500 text-xs mt-1">✓ Mật khẩu khớp</p>
              )}
          </div>

          {/* Password Requirements */}
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
                    passwordData.newPassword === passwordData.confirmPassword
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <span className="mr-2">
                    {passwordData.confirmPassword &&
                    passwordData.newPassword === passwordData.confirmPassword
                      ? "✓"
                      : "○"}
                  </span>
                  Xác nhận mật khẩu khớp
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={
                isLoading ||
                !passwordData.currentPassword ||
                !passwordData.newPassword ||
                !passwordData.confirmPassword ||
                passwordData.newPassword.length < 6 ||
                passwordData.newPassword !== passwordData.confirmPassword
              }
              className="flex items-center gap-2 bg-mainColor text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmChangePassword}
        title="Xác nhận đổi mật khẩu"
        message="Bạn có chắc chắn muốn đổi mật khẩu? Hành động này không thể hoàn tác."
        confirmText="Đồng ý"
        cancelText="Hủy"
        type="warning"
      />
    </>
  );
};

export default ChangePassword;
