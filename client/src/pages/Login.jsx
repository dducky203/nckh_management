import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Visibility, VisibilityOff, Person } from "@mui/icons-material";
import { Button } from "@mui/material";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Sử dụng login từ AuthContext
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        // Redirect to home or previous page
        const from = location.state?.from?.pathname || "/";
        navigate(from);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Có lỗi xảy ra khi đăng nhập");
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    {
      email: "admin@fita.com",
      password: "admin",
      role: "Admin (Quản trị)",
      power: 1,
    },
    {
      email: "manager@fita.com",
      password: "manager",
      role: "Manager (Quản lý)",
      power: 2,
    },
    {
      email: "member@fita.com",
      password: "member",
      role: "Member (Thành viên)",
      power: 3,
    },
    {
      email: "guest@fita.com",
      password: "guest",
      role: "Guest (Khách)",
      power: 4,
    },
  ];

  const selectDemoAccount = (account) => {
    setFormData({
      username: account.email,
      password: account.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/src/assets/logo_fita.png"
            alt="FITA Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Đăng nhập bằng tài khoản email hoặc mã giảng viên
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Tài khoản
              </label>
              <input
                id="username"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-mainColor focus:border-mainColor focus:z-10 sm:text-sm"
                placeholder="Tài khoản"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-mainColor focus:border-mainColor focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-mainColor hover:text-mainColor/80 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <VisibilityOff fontSize="small" />
                ) : (
                  <Visibility fontSize="small" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-mainColor hover:text-mainColor/80"
              >
                Quên mật khẩu?
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
                bgcolor: 'mainColor', 
                '&:hover': { bgcolor: 'rgba(32, 108, 158, 0.9)' },
                py: 1
              }}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </div>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Tài khoản demo
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectDemoAccount(account)}
                className="w-full flex justify-between items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainColor"
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{account.role}</span>
                  <span className="text-xs text-gray-500">{account.email}</span>
                </div>
                <div className="text-xs text-mainColor">
                  Power: {account.power}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>
              <strong>Hướng dẫn:</strong>
            </p>
            <p>• Admin/Manager có quyền quản lý toàn bộ hệ thống</p>
            <p>• Member có thể xem/tạo sự kiện</p>
            <p>• Guest có quyền hạn chế</p>
            <p>• Mỗi role sẽ hiển thị menu khác nhau</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
