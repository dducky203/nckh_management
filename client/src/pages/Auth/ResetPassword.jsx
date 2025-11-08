import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import logoFita from "../../assets/logo_fita.png";
import authService from "../../services/authService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const resetToken = searchParams.get("token");
    if (!resetToken) {
      setMessage("Token không hợp lệ hoặc đã hết hạn");
      return;
    }
    setToken(resetToken);
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = () => {
    if (formData.password.length < 6) {
      setMessage("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword(
        token,
        formData.password
      );

      if (response.success) {
        setMessage(response.message || "Mật khẩu đã được đổi thành công!");
        setIsSuccess(true);
       
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setMessage(response.message || "Có lỗi xảy ra, vui lòng thử lại");
      }
    } catch (error) {
      setMessage(error.message || "Có lỗi xảy ra khi đổi mật khẩu");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!token && !isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 border-2 p-8 shadow-md rounded-lg bg-gray-50 border-gray-300">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={logoFita}
              alt="FITA Logo"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Liên kết không hợp lệ
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn
            </p>
          </div>
          <div>
            <Link to="/forgot-password">
              <Button type="button" variant="contained" fullWidth>
                Yêu cầu đặt lại mật khẩu mới
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 border-2 p-8 shadow-md rounded-lg bg-gray-50 border-gray-300">
        <div>
          <img className="mx-auto h-12 w-auto" src={logoFita} alt="FITA Logo" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đặt lại mật khẩu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        {isSuccess ? (
          <div className="mt-8 space-y-6">
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {message}
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Bạn sẽ được chuyển hướng về trang đăng nhập trong giây
                    lát...
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Link to="/login">
                <Button type="button" variant="contained" fullWidth>
                  Đăng nhập ngay
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Mật khẩu mới */}
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Mật khẩu mới
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-mainColor/70" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="relative block w-full pl-5 pr-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-mainColor focus:border-mainColor focus:z-10 sm:text-sm"
                  placeholder="Mật khẩu mới"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <VisibilityOff className="h-5 w-5" />
                    ) : (
                      <Visibility className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="relative">
                <label htmlFor="confirmPassword" className="sr-only">
                  Xác nhận mật khẩu
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-mainColor/70" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="relative block w-full pl-5 pr-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-mainColor focus:border-mainColor focus:z-10 sm:text-sm"
                  placeholder="Xác nhận mật khẩu mới"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff className="h-5 w-5" />
                    ) : (
                      <Visibility className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {message && !isSuccess && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                {message}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/login"
                  className="font-medium text-mainColor hover:text-mainColor/80 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{
                  bgcolor: "mainColor",
                  "&:hover": { bgcolor: "rgba(32, 108, 158, 0.9)" },
                  py: 1,
                }}
              >
                {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
