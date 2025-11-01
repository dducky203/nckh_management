import { Link } from "react-router-dom";
import Button from "../components/common/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Trang không tồn tại
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có
            thể trang đã được di chuyển hoặc không còn tồn tại.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/">
            <Button size="lg" className="w-full">
              Về trang chủ
            </Button>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Quay lại trang trước
          </button>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>
            Nếu bạn nghĩ đây là lỗi, vui lòng{" "}
            <Link to="/contact" className="text-blue-600 hover:underline">
              liên hệ với chúng tôi
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
