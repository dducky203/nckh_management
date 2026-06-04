import { useMemo, useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Send,
  Person,
  Close,
  Refresh,
  RocketLaunch,
  ManageSearch,
  Inventory2,
  RuleFolder,
  SupportAgent,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import logo from "../../assets/logo_fita.png";
import chatbotService from "../../services/chatbotService";
import { CHAT_ASSISTANT_DISPLAY_NAME, CHAT_ASSISTANT_ROLE } from "../../constants";
import { AuthContext } from "../../context/AuthContext";

const INITIAL_MESSAGE =
  `Xin chào! Tôi là **${CHAT_ASSISTANT_DISPLAY_NAME}** (vai trò: \`${CHAT_ASSISTANT_ROLE}\`) — trợ lý NCKH trên hệ thống này.\n\nTôi ưu tiên trả lời các nội dung trong hệ thống như:\n- Định mức theo năm, quét AI, import Excel\n- Khai báo hoạt động NCKH\n- Nhóm nghiên cứu và định mức nhóm\n- Quy trình duyệt, phân quyền, thao tác theo menu\n\nBạn có thể chọn gợi ý nhanh bên dưới hoặc đặt câu hỏi trực tiếp.`;

const QUICK_ACTIONS = [
  {
    icon: Inventory2,
    label: "Định mức theo năm",
    question:
      "Hướng dẫn thao tác trang chỉnh sửa định mức theo năm, import Excel và quét AI.",
  },
  {
    icon: RuleFolder,
    label: "Khai báo NCKH",
    question:
      "Hướng dẫn khai báo hoạt động NCKH và cách nộp để admin duyệt.",
  },
  {
    icon: ManageSearch,
    label: "Nhóm nghiên cứu",
    question:
      "Cách xem định mức nhóm NCM/Xuất sắc/Tinh hoa và tính định mức cá nhân.",
  },
  {
    icon: SupportAgent,
    label: "Phân quyền",
    question:
      "Giải thích các quyền Trưởng khoa, Phó khoa, Cán bộ khoa, Sinh viên trong hệ thống.",
  },
];

const LOGIN_REQUIRED_MESSAGE =
  "Bạn cần **đăng nhập** để chat với trợ lý NCKH. Sau khi đăng nhập, mở lại cửa sổ chat để tiếp tục.";

const ChatBotWidget = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const loggedIn = isAuthenticated();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: INITIAL_MESSAGE,
      isBot: true,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const canSend = useMemo(
    () => loggedIn && inputText.trim().length > 0 && !isTyping,
    [loggedIn, inputText, isTyping]
  );

  const addBotMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        text,
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    if (!loggedIn) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isBot: false,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // Gọi API Gemini thông qua backend
      const response = await chatbotService.sendMessage(
        inputText,
        conversationId
      );

      // Cập nhật conversationId
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }

      const botMessage = {
        id: Date.now() + 1,
        text: response.response,
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot request failed:", error);
      const msg = error?.message || "";
      if (msg.toLowerCase().includes("đăng nhập")) {
        addBotMessage(LOGIN_REQUIRED_MESSAGE);
      } else {
        addBotMessage(
          "Hiện tại tôi chưa phản hồi được từ server. Bạn thử lại sau vài giây hoặc kiểm tra kết nối."
        );
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isTyping) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleClearConversation = async () => {
    if (conversationId) {
      try {
        await chatbotService.clearConversation(conversationId);
      } catch (error) {
        console.error("Error clearing conversation:", error);
      }
    }
    setConversationId(null);
    setMessages([
      {
        id: 1,
        text: INITIAL_MESSAGE,
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  return (
    <div className="fixed bottom-20 right-3 sm:right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[22rem] sm:w-[25rem] h-[560px] max-h-[78vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col animate-in slide-in-from-bottom-5 duration-300 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-mainColor to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                <img
                  className="w-7 h-7 object-contain"
                  src={logo}
                  alt="logo"
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{CHAT_ASSISTANT_DISPLAY_NAME}</h3>
                <div className="flex items-center gap-1 text-xs opacity-90 font-medium">
                  <div className="w-2 h-2 bg-emerald-300 rounded-full" />
                  <span>Online</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleClearConversation}
                className="hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                title="Xóa lịch sử"
              >
                <Refresh className="w-4 h-4" />
              </button>
              <button
                onClick={toggleChat}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Close className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                {message.isBot && (
                  <div className="flex-shrink-0 p-1 bg-gradient-to-br from-mainColor to-blue-600 text-white rounded-lg w-7 h-7 flex items-center justify-center shadow-sm">
                    <img
                      className="w-full h-full object-contain"
                      src={logo}
                      alt="logo"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[290px] px-3 py-2.5 rounded-2xl text-xs shadow-sm ${
                    message.isBot
                      ? "bg-white text-slate-800 border border-slate-200"
                      : "bg-gradient-to-r from-mainColor to-blue-600 text-white"
                  }`}
                >
                  <div className="prose prose-sm max-w-none text-xs leading-relaxed break-words">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                  <div className="text-[10px] opacity-60 mt-1.5">
                    {message.timestamp}
                  </div>
                </div>

                {!message.isBot && (
                  <div className="flex-shrink-0 p-1 bg-slate-400 text-white rounded-lg w-7 h-7 flex items-center justify-center">
                    <Person className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="flex-shrink-0 p-1.5 bg-gradient-to-br from-mainColor to-blue-600 text-white rounded-lg w-7 h-7 flex items-center justify-center">
                  <img className="w-full h-full object-contain" src={logo} alt="logo" />
                </div>
                <div className="bg-white border border-slate-200 px-3 py-2.5 rounded-2xl shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-mainColor rounded-md animate-bounce"></div>
                    <div
                      className="w-1.5 h-1.5 bg-mainColor rounded-md animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-mainColor rounded-md animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="bg-white border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowQuickActions((prev) => !prev)}
              className="w-full px-4 py-2 flex items-center justify-between text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              aria-expanded={showQuickActions}
            >
              <span>Gợi ý theo chức năng hệ thống</span>
              {showQuickActions ? (
                <ExpandLess className="w-4 h-4" />
              ) : (
                <ExpandMore className="w-4 h-4" />
              )}
            </button>

            {showQuickActions && (
              <div className="px-4 pb-3">
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_ACTIONS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        disabled={!loggedIn}
                        onClick={() => loggedIn && setInputText(item.question)}
                        className="px-2 py-1.5 text-[10px] bg-slate-50 text-slate-700 rounded-lg border border-slate-200 hover:bg-mainColor/10 hover:border-mainColor/30 hover:text-mainColor transition-all duration-200 font-semibold flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Icon fontSize="small" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            {!loggedIn && (
              <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
                <p className="mb-2">{LOGIN_REQUIRED_MESSAGE.replace(/\*\*/g, "")}</p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg bg-mainColor px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                >
                  Đăng nhập
                </Link>
              </div>
            )}
            <div className="flex gap-2 items-end">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!loggedIn}
                placeholder={
                  loggedIn
                    ? "Nhập câu hỏi về hệ thống NCKH..."
                    : "Đăng nhập để chat..."
                }
                rows={1}
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/30 focus:border-mainColor resize-none bg-slate-50 placeholder-slate-400"
                style={{ minHeight: "36px", maxHeight: "96px" }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!canSend}
                className="flex items-center px-3 py-2 bg-gradient-to-r from-mainColor to-blue-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Send fontSize="small" />
              </button>
            </div>
            <p className="mt-2 text-[10px] text-slate-400">
              Enter để gửi, Shift + Enter để xuống dòng.
            </p>
          </div>
        </div>
      )}

      {/* Floating Chat Button - Only show when chat is closed */}
      {!isOpen && (
        <button
          title={CHAT_ASSISTANT_DISPLAY_NAME}
          onClick={toggleChat}
          className="group relative border-2 border-mainColor p-2.5 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          <RocketLaunch className="w-7 h-7 text-mainColor transition-transform duration-200 group-hover:scale-110" />
        </button>
      )}

      {/* Notification Badge */}
      {!isOpen && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-mainColor text-white text-[10px] rounded-full flex items-center justify-center shadow-lg">
          <span className="font-bold">AI</span>
        </div>
      )}

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Hỗ trợ nhanh theo chức năng hệ thống
          <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-l-4 border-l-slate-900 border-y-4 border-y-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default ChatBotWidget;
