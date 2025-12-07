import { useState, useRef, useEffect } from "react";
import { Send, SmartToy, Person, Close } from "@mui/icons-material";
import logo from "../../assets/logo_fita.png";
import { getBotResponse } from "../../utils/chatbotData";

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi là chatbot hỗ trợ hệ thống quản lý NCKH. Tôi có thể giúp bạn:\n\n• Hướng dẫn tạo sự kiện mới\n• Xem các sự kiện sắp diễn ra\n• Cách tham gia sự kiện\n• Tìm hiểu về các bài báo nghiên cứu\n\nHãy hỏi tôi bất cứ điều gì bạn muốn biết!",
      isBot: true,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = getBotResponse(inputText);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
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
            <button
              onClick={toggleChat}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Close className="w-4 h-4" />
            </button>
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
                  <div className="whitespace-pre-line leading-relaxed">
                    {message.text}
                  </div>
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
          <div className="px-4 py-3 bg-white border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setInputText("Làm sao để tạo sự kiện mới?")}
                className="px-2.5 py-2 text-[10px] bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-mainColor/10 hover:border-mainColor/30 hover:text-mainColor transition-all duration-200 font-medium"
              >
                💡 Tạo sự kiện
              </button>
              <button
                onClick={() => setInputText("Sự kiện nào sắp diễn ra?")}
                className="px-2.5 py-2 text-[10px] bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-mainColor/10 hover:border-mainColor/30 hover:text-mainColor transition-all duration-200 font-medium"
              >
                📅 Sự kiện
              </button>
              <button
                onClick={() => setInputText("Cách tham gia sự kiện?")}
                className="px-2.5 py-2 text-[10px] bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-mainColor/10 hover:border-mainColor/30 hover:text-mainColor transition-all duration-200 font-medium"
              >
                ✅ Tham gia
              </button>
              <button
                onClick={() => setInputText("Xem bài báo nghiên cứu?")}
                className="px-2.5 py-2 text-[10px] bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-mainColor/10 hover:border-mainColor/30 hover:text-mainColor transition-all duration-200 font-medium"
              >
                📚 Bài báo
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2 items-end">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi..."
                rows="1"
                className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/50 focus:border-mainColor resize-none bg-gray-50 placeholder-gray-500"
                style={{ minHeight: "32px", maxHeight: "80px" }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
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
