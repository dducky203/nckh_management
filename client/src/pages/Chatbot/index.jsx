import {
  AdminPanelSettings,
  ChatBubble,
  Info,
  Psychology,
  RuleFolder,
  TableChart,
  Groups,
} from "@mui/icons-material";
import { CHAT_ASSISTANT_DISPLAY_NAME, CHAT_ASSISTANT_ROLE } from "../../constants";

const ChatBot = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100/70 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-mainColor to-blue-600 rounded-md flex items-center justify-center mb-6 shadow-lg">
            <ChatBubble className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {CHAT_ASSISTANT_DISPLAY_NAME}
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            <strong>{CHAT_ASSISTANT_DISPLAY_NAME}</strong> (vai trò:{" "}
            <code className="text-sm bg-slate-100 px-1 rounded">{CHAT_ASSISTANT_ROLE}</code>)
            {" "}            được tích hợp dưới dạng widget nổi và tối ưu cho các nghiệp
            vụ trong hệ thống. Bạn cần <strong>đăng nhập</strong> trước khi chat.
            Sau khi đăng nhập, mở widget bằng cách nhấp vào
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
              Tính năng theo module hệ thống
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <TableChart className="w-6 h-6 text-mainColor mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">
                    Định mức theo năm
                  </h3>
                  <p className="text-sm text-gray-600">
                    Hướng dẫn lọc năm, import Excel, quét AI và xử lý lỗi dữ liệu
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RuleFolder className="w-6 h-6 text-mainColor mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">
                    Khai báo hoạt động NCKH
                  </h3>
                  <p className="text-sm text-gray-600">
                    Hỏi nhanh quy trình khai báo, nộp minh chứng và duyệt hồ sơ
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Groups className="w-6 h-6 text-mainColor mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">
                    Nhóm nghiên cứu
                  </h3>
                  <p className="text-sm text-gray-600">
                    Giải thích định mức nhóm NCM / Xuất sắc / Tinh hoa
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AdminPanelSettings className="w-6 h-6 text-mainColor mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Phân quyền hệ thống</h3>
                  <p className="text-sm text-gray-600">
                    Giải thích quyền Trưởng khoa, Phó khoa, Cán bộ khoa, Sinh viên
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              <span className="inline-flex items-center gap-2 text-blue-800">
                <Psychology className="w-5 h-5" />
                Cách hoạt động thông minh
              </span>
            </h3>
            <div className="text-left space-y-2 text-blue-900">
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-200 rounded-md flex items-center justify-center text-xs font-bold">
                  1
                </span>
                {CHAT_ASSISTANT_DISPLAY_NAME} ưu tiên trả lời bằng tri thức nội bộ hệ thống để phản hồi nhanh
              </p>
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-200 rounded-md flex items-center justify-center text-xs font-bold">
                  2
                </span>
                Câu hỏi ngoài phạm vi hệ thống sẽ được tự động chuyển sang AI Gemini
              </p>
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-200 rounded-md flex items-center justify-center text-xs font-bold">
                  3
                </span>
                Bạn nên hỏi rõ theo module: định mức, khai báo, nhóm nghiên cứu, phân quyền
              </p>
              <p className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-200 rounded-md flex items-center justify-center text-xs font-bold">
                  4
                </span>
                Dùng gợi ý nhanh trong widget để thao tác nhanh hơn
              </p>
            </div>
          </div>

          {/* Try Now Button */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mainColor to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <ChatBubble className="w-5 h-5" />
              <span className="font-medium">
                Trợ lý luôn sẵn sàng hỗ trợ thao tác hệ thống!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
