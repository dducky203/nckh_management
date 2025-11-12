import { ChatBubble, Info } from "@mui/icons-material";

const ChatBot = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-mainColor to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <ChatBubble className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Chatbot Hỗ trợ NCKH
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Chatbot đã được tích hợp vào hệ thống dưới dạng widget nổi. Bạn có
            thể truy cập chatbot từ bất kỳ trang nào bằng cách nhấp vào
            <span className="inline-flex items-center mx-2 px-2 py-1 bg-mainColor/10 text-mainColor rounded-lg text-sm font-medium">
              <ChatBubble className="w-4 h-4 mr-1" />
              biểu tượng chat
            </span>
            ở góc dưới bên phải màn hình.
          </p>

          {/* Features */}
          <div className="bg-gradient-to-r from-mainColor/5 to-blue-50 rounded-xl p-6 mb-8 border border-mainColor/10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-mainColor" />
              Tính năng Chatbot
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Hướng dẫn tạo sự kiện
                  </h3>
                  <p className="text-sm text-gray-600">
                    Từng bước chi tiết để tạo sự kiện mới
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Xem sự kiện sắp tới
                  </h3>
                  <p className="text-sm text-gray-600">
                    Tìm hiểu các sự kiện sắp diễn ra
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Tham gia sự kiện
                  </h3>
                  <p className="text-sm text-gray-600">
                    Hướng dẫn đăng ký và tham gia
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <h3 className="font-medium text-gray-800">Xem bài báo</h3>
                  <p className="text-sm text-gray-600">
                    Tìm kiếm và truy cập nghiên cứu
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              💡 Hướng dẫn sử dụng
            </h3>
            <div className="text-left space-y-2 text-yellow-800">
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </span>
                Tìm biểu tượng <ChatBubble className="w-4 h-4 inline mx-1" /> ở
                góc dưới bên phải
              </p>
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </span>
                Nhấp vào biểu tượng để mở chatbot
              </p>
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </span>
                Đặt câu hỏi hoặc chọn gợi ý nhanh
              </p>
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </span>
                Nhận hướng dẫn chi tiết từ chatbot
              </p>
            </div>
          </div>

          {/* Try Now Button */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mainColor to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <ChatBubble className="w-5 h-5" />
              <span className="font-medium">
                Chatbot luôn sẵn sàng hỗ trợ bạn!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
