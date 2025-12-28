import { useState, useRef, useEffect } from "react";
import {
  Send,
  SmartToy,
  Person,
  Close,
  Refresh,
  Event,
  MenuBook,
  Groups,
  Newspaper,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import logo from "../../assets/logo_fita.png";
import chatbotService from "../../services/chatbotService";

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi là trợ lý AI của hệ thống NCKH. Tôi có thể giúp bạn:\n\n• Hướng dẫn sử dụng hệ thống\n• Giải thích các chức năng\n• Tạo sự kiện, nhóm nghiên cứu\n• Quản lý hoạt động NCKH\n\nHãy hỏi tôi bất cứ điều gì bạn muốn biết!",
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

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

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
      const errorMessage = {
        id: Date.now() + 1,
        text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
        text: "Xin chào! Tôi là trợ lý AI của hệ thống NCKH. Hãy hỏi tôi bất cứ điều gì!",
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  return (
    <div className="fixed bottom-20 right-3 sm:right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[480px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col animate-in slide-in-from-bottom-5 duration-300 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-mainColor to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 ">
                <img
                  className="w-full h-full object-contain"
                  src={logo}
                  alt="logo"
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Trợ lý NCKH</h3>
                <div className="flex items-center gap-1 text-xs opacity-90">
                  <div className="w-2 h-2 bg-green-400 rounded-md"></div>
                  <span>Đang hoạt động</span>
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
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30 backdrop-blur-sm">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                {message.isBot && (
                  <div className="flex-shrink-0 p-1 bg-gradient-to-br from-mainColor to-blue-600 text-white rounded w-7 h-7 flex items-center justify-center shadow-sm">
                    <img
                      className="w-full h-full object-contain"
                      src={logo}
                      alt="logo"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[260px] px-3 py-2.5 rounded-2xl text-xs shadow-sm ${
                    message.isBot
                      ? "bg-white text-gray-800 border border-gray-100"
                      : "bg-gradient-to-r from-mainColor to-blue-600 text-white"
                  }`}
                >
                  <div
                    className="whitespace-pre-line leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: message.text
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\n/g, "<br />"),
                    }}
                  />
                  <div className="text-[10px] opacity-60 mt-1.5">
                    {message.timestamp}
                  </div>
                </div>

                {!message.isBot && (
                  <div className="flex-shrink-0 p-1 bg-gray-400 text-white rounded w-7 h-7 flex items-center justify-center">
                    <Person className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="flex-shrink-0 p-1.5 bg-gradient-to-br from-mainColor to-blue-600 text-white rounded-xl w-7 h-7 flex items-center justify-center">
                  <SmartToy className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-gray-100 px-3 py-2.5 rounded-2xl shadow-sm">
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
              className="w-full px-4 py-2 flex items-center justify-between text-[11px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              aria-expanded={showQuickActions}
            >
              <span>Gợi ý nhanh</span>
              {showQuickActions ? (
                <ExpandLess className="w-4 h-4" />
              ) : (
                <ExpandMore className="w-4 h-4" />
              )}
            </button>

            {showQuickActions && (
              <div className="px-4 pb-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      setInputText("Hướng dẫn tạo sự kiện mới như thế nào?")
                    }
                    className="px-2 py-1.5 text-[10px] bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-mainColor/10 hover:border-mainColor/30 hover:text-mainColor transition-all duration-200 font-medium flex items-center justify-center gap-1"
                  >
                    <Event fontSize="small" />
                    <span>Tạo sự kiện</span>
                  </button>
                  <button
                    onClick={() =>
                      setInputText("Các chức năng chính của hệ thống là gì?")
                    }
                    className="px-2 py-1.5 text-[10px] bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-mainColor/10 hover:border-mainColor/30 hover:text-mainColor transition-all duration-200 font-medium flex items-center justify-center gap-1"
                  >
                    <MenuBook fontSize="small" />
                    <span>Chức năng</span>
                  </button>
                  <button
                    onClick={() =>
                      setInputText("Làm thế nào để tạo nhóm nghiên cứu?")
                    }
                    className="px-2 py-1.5 text-[10px] bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-mainColor/10 hover:border-mainColor/30 hover:text-mainColor transition-all duration-200 font-medium flex items-center justify-center gap-1"
                  >
                    <Groups fontSize="small" />
                    <span>Nhóm NC</span>
                  </button>
                  <button
                    onClick={() => setInputText("Xem tin tức mới nhất")}
                    className="px-2 py-1.5 text-[10px] bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-mainColor/10 hover:border-mainColor/30 hover:text-mainColor transition-all duration-200 font-medium flex items-center justify-center gap-1"
                  >
                    <Newspaper fontSize="small" />
                    <span>Tin tức</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2 items-end">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                rows="1"
                className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/50 focus:border-mainColor resize-none bg-gray-50 placeholder-gray-500"
                style={{ minHeight: "32px", maxHeight: "80px" }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="flex items-center px-3 py-2 bg-gradient-to-r from-mainColor to-blue-600 text-white rounded-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                <Send fontSize="sm" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button - Only show when chat is closed */}
      {!isOpen && (
        <button
          title="Chatbot"
          onClick={toggleChat}
          className=" group relative border-2 border-mainColor   p-2 bg-gray-100  rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 animate-pulse"
        >
          <img
            src="https://freesvg.org/img/1538298822.png"
            className="w-8 h-8 transition-transform duration-200 group-hover:scale-110"
            alt=""
          />
        </button>
      )}

      {/* Notification Badge */}
      {!isOpen && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-md flex items-center justify-center animate-bounce shadow-lg">
          <span className="font-bold">1</span>
        </div>
      )}

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Cần hỗ trợ? Chat với tôi!
          <div className="absolute top-1/2 left-full transform -translate-y-1/2 border-l-4 border-l-gray-900 border-y-4 border-y-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default ChatBotWidget;
