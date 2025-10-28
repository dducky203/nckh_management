import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { Email } from "@mui/icons-material";
import logoFita from "../../assets/logo_fita.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if email exists in demo accounts
      const demoEmails = [
        "admin@fita.com",
        "manager@fita.com",
        "member@fita.com",
        "guest@fita.com",
      ];

      if (demoEmails.includes(email)) {
        // Simulate successful password reset request
        setIsSuccess(true);
        setMessage("Đường dẫn đặt lại mật khẩu đã được gửi đến email của bạn");
      } else {
        setMessage("Email không tồn tại trong hệ thống");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setMessage("Có lỗi xảy ra khi gửi yêu cầu");
    } finally {
      setIsLoading(false);
      
    }
  };

  // Redirect function not needed anymore as we use Link components

  return (
    <div  className="min-h-screen flex items-center justify-center bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 border-2 p-8 shadow-md rounded-lg bg-gray-50  border-gray-300">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src={logoFita}
            alt="FITA Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Quên mật khẩu
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nhập email của bạn để lấy lại mật khẩu
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
                  <p className="text-sm font-medium text-green-800">{message}</p>
                </div>
              </div>
            </div>
            <div>
              <Link to="/login">
                <Button
                  type="button"
                  className="w-full"
                  size="lg"
                >
                  Quay lại đăng nhập
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Email className="h-5 w-5 text-mainColor/70" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={handleChange}
                className="relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-mainColor focus:border-mainColor focus:z-10 sm:text-sm"
                placeholder="Địa chỉ email"
              />
            </div>

            {message && (
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
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
                  bgcolor: 'mainColor', 
                  '&:hover': { bgcolor: 'rgba(32, 108, 158, 0.9)' },
                  py: 1
                }}
              >
                {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;