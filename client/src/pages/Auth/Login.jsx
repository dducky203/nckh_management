import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { Visibility, VisibilityOff, Person } from "@mui/icons-material";
import { Button } from "@mui/material";
import logoFita from "../../assets/logo_fita.png";

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

    // Validation
    const username = formData.username.trim();
    const password = formData.password.trim();

    // Kiểm tra username và password không được trống
    if (!username) {
      setError("Tên đăng nhập không được để trống");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Mật khẩu không được để trống");
      setIsLoading(false);
      return;
    }

    // Kiểm tra username phải nhiều hơn 5 ký tự
    if (username.length <= 4) {
      setError("Tên đăng nhập phải có nhiều hơn 5 ký tự");
      setIsLoading(false);
      return;
    }

    try {
      // Sử dụng login từ AuthContext với dữ liệu đã trim
      const result = await login(username, password);

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
      email: "admin",
      password: "admin123",
      role: "Admin (Quản trị)",
      power: 1,
    },
    {
      email: "manager456",
      password: "manager789",
      role: "Manager (Quản lý)",
      power: 2,
    },
    {
      email: "anthu@gmail.com",
      password: "Userfita@12345",
      role: "Member (Thành viên)",
      power: 3,
    },
    {
      email: "user38@example.com",
      password: "Userfita@12345",
      role: " Sinh viên",
      power: 4,
    }
  ];

  const selectDemoAccount = (account) => {
    setFormData({
      username: account.email,
      password: account.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8  border-2 p-8 shadow-md rounded-lg  bg-gray-50 border-gray-300">
        <div>
          <img className="mx-auto h-12 w-auto" src={logoFita} alt="FITA Logo" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Đăng nhập bằng tài khoản email hoặc mã giảng viên
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tài khoản
              </label>
              <input
                id="username"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className={`relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-mainColor sm:text-sm ${
                  formData.username.trim() &&
                  formData.username.trim().length <= 4
                    ? "border-red-300 bg-red-50"
                    : formData.username.trim() &&
                        formData.password.trim() &&
                        formData.username.trim().toLowerCase() ===
                          formData.password.trim().toLowerCase()
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                }`}
                placeholder="Nhập tên đăng nhập"
              />
              {formData.username.trim() &&
                formData.username.trim().length <= 4 && (
                  <p className="text-red-500 text-xs mt-1">
                    Tên đăng nhập phải có nhiều hơn 5 ký tự
                  </p>
                )}
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className={`relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-mainColor pr-10 sm:text-sm ${
                  formData.username.trim() &&
                  formData.password.trim() &&
                  formData.username.trim().toLowerCase() ===
                    formData.password.trim().toLowerCase()
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-mainColor hover:text-mainColor/80 focus:outline-none"
                style={{ top: "24px" }}
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
              disabled={
                isLoading ||
                !formData.username.trim() ||
                !formData.password.trim() ||
                formData.username.trim().length <= 4 ||
                formData.username.trim().toLowerCase() ===
                  formData.password.trim().toLowerCase()
              }
              sx={{
                bgcolor: "mainColor",
                "&:hover": { bgcolor: "rgba(32, 108, 158, 0.9)" },
                "&:disabled": { bgcolor: "rgba(156, 163, 175, 0.5)" },
                py: 1,
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
                  <span className="text-xs text-gray-500">
                    User: {account.email}
                  </span>
                </div>
                <div className="text-xs text-mainColor">
                  Power: {account.power}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
