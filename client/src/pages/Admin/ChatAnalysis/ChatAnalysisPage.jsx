import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Person,
  Chat,
  Psychology,
  Lightbulb,
  Warning,
  Message,
  SmartToy,
  Refresh,
  ArrowForward,
  ArrowBack,
  AutoAwesome,
  TrendingUp,
  Groups,
  QuestionAnswer,
  BugReport,
  BuildCircle,
  BarChart,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

const HISTORY_PAGE_SIZE = 15;

const formatCount = (n) => {
  if (n == null || Number.isNaN(n)) return "0";
  return Number(n).toLocaleString("vi-VN");
};
import chatAnalysisService from "../../../services/chatAnalysisService";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import noAvatarImg from "../../../assets/no-avatar-user.png";

// ─── Shared sub-components ────────────────────────────────────────────────────

const StatBadge = ({ icon: Icon, value, label, color }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${color}`}>
    <Icon sx={{ fontSize: 14 }} />
    <span>{value} {label}</span>
  </div>
);

const SectionCard = ({ icon: Icon, iconColor, bgColor, borderColor, label, content }) => (
  <div className={`${bgColor} border ${borderColor} rounded-xl p-4`}>
    <div className="flex items-center gap-1.5 mb-2.5">
      <Icon sx={{ fontSize: 16 }} className={iconColor} />
      <span className={`text-xs font-bold uppercase tracking-wide ${iconColor}`}>{label}</span>
    </div>
    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
  </div>
);

// ─── User card ────────────────────────────────────────────────────────────────

const UserCard = ({ user, isSelected, onClick }) => (
  <button
    id={`user-card-${user.id}`}
    onClick={() => onClick(user)}
    className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${isSelected
        ? "border-mainColor bg-purple-50 shadow-md"
        : "border-gray-100 bg-white hover:border-purple-200"
      }`}
  >
    <div className="relative flex-shrink-0">
      <img
        src={user.avatar || noAvatarImg}
        alt={user.name}
        className="w-11 h-11 rounded-full object-cover border-2 border-white shadow"
      />
      <span className="absolute -bottom-1 -right-1 bg-green-400 rounded-full w-3.5 h-3.5 border-2 border-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
      <p className="text-xs text-gray-400 truncate">{user.username}</p>
      {user.title && (
        <p className="text-xs text-purple-600 font-medium truncate">{user.title}</p>
      )}
    </div>
    <div className="flex flex-col items-end gap-1 flex-shrink-0">
      <span className="text-xs bg-mainColor/10 text-mainColor font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
        {user.totalMessages} tin
      </span>
      {isSelected && <ArrowForward sx={{ fontSize: 16 }} className="text-mainColor" />}
    </div>
  </button>
);

// ─── Chat bubble ──────────────────────────────────────────────────────────────

const ChatBubble = ({ item }) => {
  const date = item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "";
  return (
    <div className="space-y-1.5 mb-4">
      <div className="flex items-end gap-2 justify-end">
        <div className="max-w-[75%] bg-mainColor text-white text-sm rounded-2xl rounded-br-sm px-3.5 py-2 shadow-sm">
          <p className="leading-relaxed whitespace-pre-wrap">{item.userMessage}</p>
        </div>
        <div className="w-7 h-7 rounded-full bg-mainColor/15 flex items-center justify-center flex-shrink-0 mb-0.5">
          <Person sx={{ fontSize: 15 }} className="text-mainColor" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mb-0.5">
          <SmartToy sx={{ fontSize: 15 }} className="text-indigo-600" />
        </div>
        <div className="max-w-[75%] bg-white border border-gray-200 text-gray-800 text-sm rounded-2xl rounded-bl-sm px-3.5 py-2 shadow-sm">
          <p className="leading-relaxed whitespace-pre-wrap">{item.botResponse}</p>
          {date && <p className="text-[10px] text-gray-400 mt-1 text-right">{date}</p>}
        </div>
      </div>
    </div>
  );
};

// ─── Individual analysis result ───────────────────────────────────────────────

const IndividualAnalysisResult = ({ result, onClose }) => (
  <div id="analysis-result-panel" className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-5 shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <AutoAwesome sx={{ fontSize: 16 }} className="text-white" />
        </div>
        <span className="font-bold text-gray-800 text-sm">Kết quả phân tích cá nhân</span>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1 rounded hover:bg-gray-100 transition-colors">
        Ẩn
      </button>
    </div>
    <div className="grid gap-3">
      <SectionCard icon={BugReport} iconColor="text-orange-600" bgColor="bg-orange-50" borderColor="border-orange-200" label="Vấn đề phát hiện" content={result.identifiedProblems} />
      <SectionCard icon={Lightbulb} iconColor="text-green-600" bgColor="bg-green-50" borderColor="border-green-200" label="Đề xuất giải pháp" content={result.suggestedSolutions} />
    </div>
  </div>
);

// ─── Global analysis result ───────────────────────────────────────────────────

const GlobalAnalysisResult = ({ result, onClose }) => (
  <div id="global-analysis-result" className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
          <BarChart sx={{ fontSize: 20 }} className="text-white" />
        </div>
        <div>
          <span className="font-bold text-gray-800 block">Báo cáo phân tích tổng quan hệ thống</span>
          <div className="flex items-center gap-3 mt-0.5">
            {result.totalUsers && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Groups sx={{ fontSize: 13 }} />{result.totalUsers} người dùng
              </span>
            )}
            {result.totalMessages && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Chat sx={{ fontSize: 13 }} />{result.totalMessages} tin nhắn
              </span>
            )}
            {result.analyzedSample && (
              <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
                Phân tích {result.analyzedSample} mẫu
              </span>
            )}
          </div>
        </div>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xs px-2 py-1 rounded hover:bg-gray-100 transition-colors">
        Ẩn
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <SectionCard icon={TrendingUp} iconColor="text-indigo-600" bgColor="bg-indigo-50" borderColor="border-indigo-200" label="Chủ đề được hỏi nhiều nhất" content={result.topTopics} />
      <SectionCard icon={BugReport} iconColor="text-red-600" bgColor="bg-red-50" borderColor="border-red-200" label="Vấn đề phổ biến (đa số gặp)" content={result.commonPainPoints} />
      <SectionCard icon={QuestionAnswer} iconColor="text-amber-600" bgColor="bg-amber-50" borderColor="border-amber-200" label="Câu hỏi điển hình" content={result.topQuestions} />
      <SectionCard icon={BarChart} iconColor="text-blue-600" bgColor="bg-blue-50" borderColor="border-blue-200" label="Xu hướng sử dụng" content={result.usageTrends} />
    </div>

    <div className="mt-3">
      <SectionCard icon={BuildCircle} iconColor="text-green-600" bgColor="bg-green-50" borderColor="border-green-200" label="Đề xuất cải thiện hệ thống" content={result.systemRecommendations} />
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const ChatAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState("individual"); // "individual" | "global"

  // ── Left panel — user list ─────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPage, setUsersPage] = useState(0);
  const [usersTotalPages, setUsersTotalPages] = useState(0);
  const [usersTotalItems, setUsersTotalItems] = useState(0);

  // ── Right panel — individual ───────────────────────────────────────────────
  const [selectedUser, setSelectedUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(0);
  const [historyTotalPages, setHistoryTotalPages] = useState(0);
  const [historyTotalItems, setHistoryTotalItems] = useState(0);
  const [historyHasNext, setHistoryHasNext] = useState(false);
  const [historyHasPrevious, setHistoryHasPrevious] = useState(false);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const chatScrollRef = useRef(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  // ── Global analysis ────────────────────────────────────────────────────────
  const [globalResult, setGlobalResult] = useState(null);
  const [globalAnalyzing, setGlobalAnalyzing] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  // ── Fetch users ────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const res = await chatAnalysisService.getUsersWithChatHistory(search, usersPage, 10);
      const data = res?.data;
      setUsers(data?.users || []);
      setUsersTotalPages(data?.totalPages || 0);
      setUsersTotalItems(data?.totalItems || 0);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setUsersLoading(false);
    }
  }, [search, usersPage]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchUsers, search]);

  const scrollChat = useCallback((toBottom) => {
    const el = chatScrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = toBottom ? el.scrollHeight : 0;
    });
  }, []);

  /** Gọi BE với page/size — FE chỉ hiển thị response, không phân trang client. */
  const loadChatHistory = useCallback(
    async (page = 0) => {
      if (!selectedUser) return;
      try {
        setHistoryLoading(true);
        const res = await chatAnalysisService.getUserChatHistory(
          selectedUser.id,
          page,
          HISTORY_PAGE_SIZE
        );
        const data = res?.data;
        const currentPage = data?.currentPage ?? 0;

        setHistory(data?.history || []);
        setHistoryPage(currentPage);
        setHistoryTotalPages(data?.totalPages ?? 0);
        setHistoryTotalItems(data?.totalItems ?? 0);
        setHistoryHasNext(Boolean(data?.hasNext));
        setHistoryHasPrevious(Boolean(data?.hasPrevious));

        scrollChat(currentPage === 0);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setHistoryLoading(false);
      }
    },
    [selectedUser, scrollChat]
  );

  useEffect(() => {
    if (selectedUser) loadChatHistory(0);
  }, [selectedUser, loadChatHistory]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setHistory([]);
    setHistoryPage(0);
    setHistoryTotalPages(0);
    setHistoryTotalItems(0);
    setHistoryHasNext(false);
    setHistoryHasPrevious(false);
    setAnalysisResult(null);
    setAnalysisError(null);
    setShowAnalysisPanel(true);
    setActiveTab("individual");
  };

  const handleAnalyzeIndividual = async () => {
    if (!selectedUser) return;
    try {
      setAnalyzing(true);
      setAnalysisError(null);
      setAnalysisResult(null);
      const res = await chatAnalysisService.analyzeUser(selectedUser.id);
      setAnalysisResult(res?.data);
    } catch (err) {
      setAnalysisError(err.message || "Không thể phân tích lúc này.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAnalyzeAll = async () => {
    try {
      setGlobalAnalyzing(true);
      setGlobalError(null);
      setGlobalResult(null);
      const res = await chatAnalysisService.analyzeAll();
      setGlobalResult(res?.data);
    } catch (err) {
      setGlobalError(err.message || "Không thể thực hiện phân tích tổng quan.");
    } finally {
      setGlobalAnalyzing(false);
    }
  };

  // ── Tabs config ────────────────────────────────────────────────────────────
  const tabs = [
    { id: "individual", label: "Phân tích cá nhân", icon: Person },
    { id: "global", label: "Phân tích tổng quan", icon: Groups },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-[#f4f6fb] px-4 py-3 md:px-5">
      {/* ── Page Header ── */}
      <div className="shrink-0 mb-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-mainColor to-indigo-600 flex items-center justify-center shadow">
            <Psychology className="text-white" sx={{ fontSize: 20 }} />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800">Phân tích & Cá nhân hóa người dùng</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Phân tích hành vi từ lịch sử chat với chatbot AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <StatBadge icon={Person} value={usersTotalItems} label="người dùng có chat" color="bg-blue-50 text-blue-700" />
          {selectedUser && activeTab === "individual" && (
            <StatBadge icon={Message} value={historyTotalItems} label={`tin nhắn của ${selectedUser.name}`} color="bg-purple-50 text-purple-700" />
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="shrink-0 flex gap-1 mb-2 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === tab.id
                  ? "bg-gradient-to-r from-mainColor to-indigo-600 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`}
            >
              <Icon sx={{ fontSize: 17 }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
        {/* ── LEFT PANEL: User list (always visible) ── */}
        <div className="w-72 lg:w-80 flex-shrink-0 flex flex-col gap-3 min-h-0 h-full">
          {/* Search */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" sx={{ fontSize: 18 }} />
              <input
                id="user-search-input"
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setUsersPage(0); }}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <Chat sx={{ fontSize: 14 }} />Người dùng
              </span>
              {usersLoading && <div className="w-4 h-4 border-2 border-mainColor border-t-transparent rounded-full animate-spin" />}
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {usersLoading && users.length === 0 ? (
                <div className="flex justify-center py-8"><LoadingSpinner /></div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Chat sx={{ fontSize: 40 }} className="opacity-30 mb-2" />
                  <p className="text-sm">Không tìm thấy người dùng</p>
                </div>
              ) : (
                users.map((u) => (
                  <UserCard key={u.id} user={u} isSelected={selectedUser?.id === u.id} onClick={handleSelectUser} />
                ))
              )}
            </div>
            {usersTotalPages > 1 && (
              <div className="border-t border-gray-100 px-4 py-2 flex items-center justify-between">
                <button id="users-prev-btn" disabled={usersPage === 0} onClick={() => setUsersPage((p) => Math.max(0, p - 1))} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <ArrowBack sx={{ fontSize: 16 }} />
                </button>
                <span className="text-xs text-gray-500">{usersPage + 1} / {usersTotalPages}</span>
                <button id="users-next-btn" disabled={usersPage >= usersTotalPages - 1} onClick={() => setUsersPage((p) => p + 1)} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <ArrowForward sx={{ fontSize: 16 }} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full overflow-hidden">

          {/* ════════ TAB: CÁ NHÂN ════════ */}
          {activeTab === "individual" && (
            !selectedUser ? (
              <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center p-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mb-4">
                  <Psychology sx={{ fontSize: 40 }} className="text-mainColor opacity-60" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Chọn người dùng để phân tích</h3>
                <p className="text-sm text-gray-400 max-w-xs">
                  Hãy chọn một người dùng từ danh sách bên trái để xem lịch sử chat và phân tích hành vi bằng AI.
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-full min-h-0 gap-2 overflow-hidden">
                {/* User profile header */}
                <div className="shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 p-2.5 md:p-3">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={selectedUser.avatar || noAvatarImg} alt={selectedUser.name} className="w-11 h-11 rounded-xl object-cover border-2 border-purple-200 shadow" />
                      <div className="min-w-0">
                        <h2 className="font-bold text-gray-800 truncate">{selectedUser.name}</h2>
                        <p className="text-sm text-gray-500 truncate">@{selectedUser.username}</p>
                        {selectedUser.title && (
                          <span className="text-xs bg-purple-100 text-purple-700 font-medium px-2 py-0.5 rounded-full">{selectedUser.title}</span>
                        )}
                      </div>
                    </div>
                    <button
                      id="btn-analyze-user"
                      onClick={handleAnalyzeIndividual}
                      disabled={analyzing}
                      className="flex items-center gap-2 bg-gradient-to-r from-mainColor to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                    >
                      {analyzing ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Đang phân tích...</>
                      ) : (
                        <><AutoAwesome sx={{ fontSize: 18 }} />Phân tích AI</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Individual result — collapsible, không đẩy dài trang */}
                {(analysisResult || analysisError) && (
                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowAnalysisPanel((v) => !v)}
                      className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <span className="flex items-center gap-2">
                        <AutoAwesome sx={{ fontSize: 16 }} className="text-mainColor" />
                        Kết quả phân tích AI
                      </span>
                      {showAnalysisPanel ? <ExpandLess sx={{ fontSize: 20 }} /> : <ExpandMore sx={{ fontSize: 20 }} />}
                    </button>
                    {showAnalysisPanel && (
                      <div className="mt-2 max-h-36 overflow-y-auto space-y-2">
                        {analysisResult && <IndividualAnalysisResult result={analysisResult} onClose={() => setAnalysisResult(null)} />}
                        {analysisError && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-700 text-sm">
                            <Warning sx={{ fontSize: 18 }} />{analysisError}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Chat history — cao, scroll trong khung, phân trang rõ */}
                <div className="flex-1 min-h-[min(720px,calc(100vh-12rem))] flex flex-col bg-[#e5e7eb] rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="shrink-0 px-4 py-2 bg-white border-b border-gray-200 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Chat sx={{ fontSize: 16 }} className="text-mainColor" />
                        <span className="text-sm font-semibold text-gray-800">Lịch sử chat</span>
                      </div>

                    </div>
                    <button
                      id="btn-refresh-history"
                      onClick={() => loadChatHistory(historyPage)}
                      disabled={historyLoading}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 shrink-0"
                      title="Tải lại"
                    >
                      <Refresh sx={{ fontSize: 18 }} className={historyLoading ? "animate-spin" : ""} />
                    </button>
                  </div>

                  <div
                    ref={chatScrollRef}
                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-4 relative"
                  >
                    {historyLoading && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                        <LoadingSpinner />
                      </div>
                    )}
                    {!historyLoading && history.length === 0 ? (
                      <div className="text-center py-16 text-gray-500">
                        <SmartToy sx={{ fontSize: 48 }} className="opacity-30 mb-2" />
                        <p className="text-sm">Chưa có lịch sử chat</p>
                      </div>
                    ) : (
                      history.map((item) => <ChatBubble key={`${item.id}-${item.createdAt}`} item={item} />)
                    )}
                  </div>

                  <div className="shrink-0 px-3 py-2.5 bg-white border-t border-gray-200 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      disabled={historyLoading || !historyHasPrevious}
                      onClick={() => loadChatHistory(historyPage - 1)}
                      className="flex items-center gap-0.5 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-gray-600"
                    >
                      <ArrowBack sx={{ fontSize: 14 }} /> Mới hơn
                    </button>
                    <span className="text-xs text-gray-500 text-center">
                      Trang <strong>{historyPage + 1}</strong> / {formatCount(Math.max(historyTotalPages, 1))}
                    </span>
                    <button
                      type="button"
                      disabled={historyLoading || !historyHasNext}
                      onClick={() => loadChatHistory(historyPage + 1)}
                      className="flex items-center gap-0.5 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-gray-600"
                    >
                      Cũ hơn <ArrowForward sx={{ fontSize: 14 }} />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}

          {/* ════════ TAB: TỔNG QUAN ════════ */}
          {activeTab === "global" && (
            <div className="h-full min-h-0 overflow-y-auto flex flex-col gap-4 pr-1">
              {/* Call-to-action card */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Groups sx={{ fontSize: 26 }} />
                      <h2 className="text-xl font-bold">Phân tích tổng quan hệ thống</h2>
                    </div>
                    <p className="text-indigo-100 text-sm max-w-lg leading-relaxed">
                      AI sẽ phân tích <strong>toàn bộ lịch sử chat</strong> của tất cả người dùng để tìm ra
                      chủ đề phổ biến nhất, vấn đề đa số gặp phải, xu hướng sử dụng và đề xuất cải thiện hệ thống.
                    </p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span className="bg-white/20 text-xs px-2.5 py-1 rounded-full font-medium">📊 Chủ đề phổ biến</span>
                      <span className="bg-white/20 text-xs px-2.5 py-1 rounded-full font-medium">🔥 Vấn đề đa số gặp</span>
                      <span className="bg-white/20 text-xs px-2.5 py-1 rounded-full font-medium">📈 Xu hướng</span>
                      <span className="bg-white/20 text-xs px-2.5 py-1 rounded-full font-medium">💡 Đề xuất cải thiện</span>
                    </div>
                  </div>
                  <button
                    id="btn-analyze-all"
                    onClick={handleAnalyzeAll}
                    disabled={globalAnalyzing}
                    className="flex items-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 whitespace-nowrap"
                  >
                    {globalAnalyzing ? (
                      <><div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />Đang phân tích AI...</>
                    ) : (
                      <><AutoAwesome sx={{ fontSize: 18 }} className="text-indigo-600" />Phân tích ngay</>
                    )}
                  </button>
                </div>
              </div>

              {/* Loading state */}
              {globalAnalyzing && (
                <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center gap-3 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                    <AutoAwesome sx={{ fontSize: 28 }} className="text-indigo-500 animate-pulse" />
                  </div>
                  <p className="text-gray-700 font-semibold">AI đang phân tích toàn bộ lịch sử chat...</p>
                  <p className="text-gray-400 text-sm">Quá trình này có thể mất 15-30 giây</p>
                  <LoadingSpinner />
                </div>
              )}

              {/* Error */}
              {globalError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-2 text-red-700 text-sm">
                  <Warning sx={{ fontSize: 18 }} />{globalError}
                </div>
              )}

              {/* Global result */}
              {globalResult && <GlobalAnalysisResult result={globalResult} onClose={() => setGlobalResult(null)} />}

              {/* Empty state when no analysis yet */}
              {!globalAnalyzing && !globalResult && !globalError && (
                <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center text-center shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                    <TrendingUp sx={{ fontSize: 32 }} className="text-indigo-400" />
                  </div>
                  <h3 className="text-gray-700 font-semibold mb-2">Chưa có báo cáo tổng quan</h3>
                  <p className="text-sm text-gray-400 max-w-sm">
                    Nhấn <strong>"Phân tích ngay"</strong> ở trên để AI phân tích toàn bộ lịch sử chat của hệ thống và đưa ra báo cáo chi tiết.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatAnalysisPage;
