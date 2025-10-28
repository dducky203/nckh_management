import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { Lock, Home, ArrowBack } from '@mui/icons-material';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-red-100 p-3 rounded-full">
            <Lock className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Không có quyền truy cập</h1>
        <p className="text-gray-600">
          Bạn không có đủ quyền để truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <Button
            variant="contained"
            startIcon={<Home />}
            component={Link}
            to="/"
            sx={{
              bgcolor: 'mainColor',
              '&:hover': { bgcolor: 'rgba(32, 108, 158, 0.9)' }
            }}
          >
            Trang chủ
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => window.history.back()}
            sx={{
              color: 'mainColor',
              borderColor: 'mainColor',
              '&:hover': { borderColor: 'rgba(32, 108, 158, 0.9)' }
            }}
          >
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;