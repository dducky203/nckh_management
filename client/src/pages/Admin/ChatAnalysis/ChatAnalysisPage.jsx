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
    className={`w-full text-left flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${isSelected
        ? "border-mainColor bg-mainColor/5 shadow-md"
        : "border-transparent bg-white hover:border-mainColor/20 shadow-sm"
      }`}
  >
    <div className="relative flex-shrink-0">
      <img
        src={user.avatar || noAvatarImg}
        alt={user.name}
        className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
      />
      <span className="absolute -bottom-1 -right-1 bg-green-400 rounded-full w-3.5 h-3.5 border-2 border-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-gray-800 text-[14px] truncate">{user.name}</p>
      <p className="text-xs text-slate-500 font-medium truncate">{user.username}</p>
      {user.title && (
        <p className="text-[11px] text-mainColor font-bold truncate mt-0.5">{user.title}</p>
      )}
    </div>
    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
      <span className="text-[10px] bg-mainColor/10 text-mainColor font-extrabold px-2.5 py-0.5 rounded-md whitespace-nowrap uppercase tracking-wide border border-mainColor/20">
        {user.totalMessages} tin
      </span>
      {isSelected && <ArrowForward sx={{ fontSize: 16 }} className="text-mainColor animate-pulse" />}
    </div>
  </button>
);

// ─── Chat bubble ──────────────────────────────────────────────────────────────

const ChatBubble = ({ item }) => {
  const date = item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "";
  return (
    <div className="space-y-2 mb-5">
      <div className="flex items-end gap-2.5 justify-end">
        <div className="max-w-[75%] bg-mainColor text-white text-sm rounded-2xl rounded-br-sm px-4 py-2.5 shadow-sm">
          <p className="leading-relaxed whitespace-pre-wrap">{item.userMessage}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-mainColor/10 flex items-center justify-center flex-shrink-0 mb-0.5">
          <Person sx={{ fontSize: 16 }} className="text-mainColor" />
        </div>
      </div>
      <div className="flex items-end gap-2.5">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mb-0.5 border border-slate-200">
          <SmartToy sx={{ fontSize: 16 }} className="text-slate-600" />
        </div>
        <div className="max-w-[75%] bg-white border border-slate-200 text-slate-800 text-sm rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
          <p className="leading-relaxed whitespace-pre-wrap">{item.botResponse}</p>
          {date && <p className="text-[10px] text-slate-400 mt-1.5 text-right font-medium">{date}</p>}
        </div>
      </div>
    </div>
  );
};

// ─── Individual analysis result ───────────────────────────────────────────────

const IndividualAnalysisResult = ({ result, onClose }) => (
  <div id="analysis-result-panel" className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm relative overflow-hidden">
    <div className="absolute top-0 left-0 w-1 h-full bg-mainColor" />
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-mainColor/10 flex items-center justify-center">
          <AutoAwesome sx={{ fontSize: 16 }} className="text-mainColor" />
        </div>
        <span className="font-extrabold text-slate-800 text-[15px]">Kết quả phân tích AI</span>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xs px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors font-semibold">
        Thu gọn
      </button>
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <SectionCard icon={BugReport} iconColor="text-orange-600" bgColor="bg-orange-50/50" borderColor="border-orange-100" label="Vấn đề phát hiện" content={result.identifiedProblems} />
      <SectionCard icon={Lightbulb} iconColor="text-emerald-600" bgColor="bg-emerald-50/50" borderColor="border-emerald-100" label="Đề xuất giải pháp" content={result.suggestedSolutions} />
    </div>
  </div>
);

// ─── Global analysis result ───────────────────────────────────────────────────

const GlobalAnalysisResult = ({ result, onClose }) => (
  <div id="global-analysis-result" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mainColor to-blue-400" />
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-mainColor/10 flex items-center justify-center">
          <BarChart sx={{ fontSize: 22 }} className="text-mainColor" />
        </div>
        <div>
          <span className="font-extrabold text-slate-800 text-lg block">Báo cáo phân tích tổng quan hệ thống</span>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {result.totalUsers && (
              <span className="text-[11px] text-slate-600 font-bold bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1.5 uppercase tracking-wide">
                <Groups sx={{ fontSize: 14 }} />{result.totalUsers} người dùng
              </span>
            )}
            {result.totalMessages && (
              <span className="text-[11px] text-slate-600 font-bold bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1.5 uppercase tracking-wide">
                <Chat sx={{ fontSize: 14 }} />{result.totalMessages} tin nhắn
              </span>
            )}
            {result.analyzedSample && (
              <span className="text-[11px] text-mainColor font-extrabold bg-mainColor/10 border border-mainColor/20 px-2.5 py-1 rounded-md uppercase tracking-wide">
                Phân tích {result.analyzedSample} mẫu
              </span>
            )}
          </div>
        </div>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xs px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors font-semibold">
        Thu gọn
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectionCard icon={TrendingUp} iconColor="text-blue-600" bgColor="bg-blue-50/50" borderColor="border-blue-100" label="Chủ đề được hỏi nhiều nhất" content={result.topTopics} />
      <SectionCard icon={BugReport} iconColor="text-rose-600" bgColor="bg-rose-50/50" borderColor="border-rose-100" label="Vấn đề phổ biến (đa số gặp)" content={result.commonPainPoints} />
      <SectionCard icon={QuestionAnswer} iconColor="text-amber-600" bgColor="bg-amber-50/50" borderColor="border-amber-100" label="Câu hỏi điển hình" content={result.topQuestions} />
      <SectionCard icon={BarChart} iconColor="text-indigo-600" bgColor="bg-indigo-50/50" borderColor="border-indigo-100" label="Xu hướng sử dụng" content={result.usageTrends} />
    </div>

    <div className="mt-4">
      <SectionCard icon={BuildCircle} iconColor="text-emerald-600" bgColor="bg-emerald-50/50" borderColor="border-emerald-100" label="Đề xuất cải thiện hệ thống" content={result.systemRecommendations} />
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
  const [showChatHistory, setShowChatHistory] = useState(true);
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
    <div className="h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-50/50 px-4 py-4 md:px-6 font-sans">
      {/* ── Page Header ── */}
      <div className="shrink-0 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-mainColor/10 flex items-center justify-center border border-mainColor/20">
            <Psychology className="text-mainColor" sx={{ fontSize: 24 }} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Phân tích & Cá nhân hóa người dùng</h1>
            <p className="text-sm text-slate-500 font-medium hidden sm:block">Phân tích hành vi từ lịch sử chat với chatbot AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <StatBadge icon={Person} value={usersTotalItems} label="người dùng có chat" color="bg-blue-50 text-blue-700 border border-blue-200" />
          {selectedUser && activeTab === "individual" && (
            <StatBadge icon={Message} value={historyTotalItems} label={`tin nhắn của ${selectedUser.name}`} color="bg-emerald-50 text-emerald-700 border border-emerald-200" />
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="shrink-0 flex gap-2 mb-4 bg-white/60 backdrop-blur-md rounded-xl p-1.5 shadow-sm border border-white w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === tab.id
                  ? "bg-mainColor text-white shadow-md shadow-mainColor/20"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/80"
                }`}
            >
              <Icon sx={{ fontSize: 18 }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
        {/* ── LEFT PANEL: User list (always visible) ── */}
        <div className="w-72 lg:w-80 flex-shrink-0 flex flex-col gap-4 min-h-0 h-full">
          {/* Search */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" sx={{ fontSize: 18 }} />
              <input
                id="user-search-input"
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setUsersPage(0); }}
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor font-semibold text-slate-700 transition-all"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 flex-1 flex flex-col overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Chat sx={{ fontSize: 15 }} />Người dùng
              </span>
              {usersLoading && <div className="w-4 h-4 border-2 border-mainColor border-t-transparent rounded-full animate-spin" />}
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {usersLoading && users.length === 0 ? (
                <div className="flex justify-center py-8"><LoadingSpinner /></div>
              ) : users.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                    <Chat sx={{ fontSize: 24 }} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-medium">Không tìm thấy người dùng</p>
                </div>
              ) : (
                users.map((u) => (
                  <UserCard key={u.id} user={u} isSelected={selectedUser?.id === u.id} onClick={handleSelectUser} />
                ))
              )}
            </div>
            {usersTotalPages > 1 && (
              <div className="border-t border-slate-100 px-4 py-2 flex items-center justify-between bg-slate-50/50">
                <button id="users-prev-btn" disabled={usersPage === 0} onClick={() => setUsersPage((p) => Math.max(0, p - 1))} className="p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <ArrowBack sx={{ fontSize: 16 }} className="text-slate-600" />
                </button>
                <span className="text-xs font-bold text-slate-500">{usersPage + 1} / {usersTotalPages}</span>
                <button id="users-next-btn" disabled={usersPage >= usersTotalPages - 1} onClick={() => setUsersPage((p) => p + 1)} className="p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <ArrowForward sx={{ fontSize: 16 }} className="text-slate-600" />
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
              <div className="h-full bg-white rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col items-center justify-center text-center p-10">
                <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                  <Psychology sx={{ fontSize: 48 }} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Chọn người dùng để phân tích</h3>
                <p className="text-sm font-medium text-slate-500 max-w-sm">
                  Hãy chọn một người dùng từ danh sách bên trái để xem lịch sử chat và phân tích hành vi bằng AI.
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-full min-h-0 gap-3 overflow-hidden">
                {/* User profile header */}
                <div className="shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 p-3 md:p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <img src={selectedUser.avatar || noAvatarImg} alt={selectedUser.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 shadow-sm" />
                      <div className="min-w-0">
                        <h2 className="font-extrabold text-slate-800 text-lg truncate">{selectedUser.name}</h2>
                        <p className="text-[13px] font-medium text-slate-500 truncate">@{selectedUser.username}</p>
                        {selectedUser.title && (
                          <span className="text-[11px] bg-mainColor/10 text-mainColor font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wide mt-1 inline-block">{selectedUser.title}</span>
                        )}
                      </div>
                    </div>
                    <button
                      id="btn-analyze-user"
                      onClick={handleAnalyzeIndividual}
                      disabled={analyzing}
                      className="flex items-center gap-2 bg-mainColor text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_4px_20px_rgb(0,0,0,0.15)] hover:brightness-110 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none shrink-0"
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
                      <div className="mt-2 max-h-[60vh] overflow-y-auto space-y-3 p-1">
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
                <div className={`flex flex-col bg-[#e5e7eb] rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 ${showChatHistory ? "flex-1 min-h-[min(720px,calc(100vh-12rem))]" : "shrink-0"}`}>
                  <button 
                    type="button"
                    onClick={() => setShowChatHistory(prev => !prev)}
                    className="w-full shrink-0 px-4 py-2 bg-white border-b border-slate-200 flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Chat sx={{ fontSize: 16 }} className="text-mainColor" />
                      <span className="text-sm font-semibold text-slate-800">Lịch sử chat</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {showChatHistory && (
                        <div
                          id="btn-refresh-history"
                          onClick={(e) => { e.stopPropagation(); loadChatHistory(historyPage); }}
                          role="button"
                          className={`p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 shrink-0 ${historyLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                          title="Tải lại"
                        >
                          <Refresh sx={{ fontSize: 18 }} className={historyLoading ? "animate-spin" : ""} />
                        </div>
                      )}
                      {showChatHistory ? <ExpandLess sx={{ fontSize: 20 }} className="text-slate-400" /> : <ExpandMore sx={{ fontSize: 20 }} className="text-slate-400" />}
                    </div>
                  </button>

                  {showChatHistory && (
                    <>

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
                  </>
                  )}
                </div>
              </div>
            )
          )}

          {/* ════════ TAB: TỔNG QUAN ════════ */}
          {activeTab === "global" && (
            <div className="h-full min-h-0 overflow-y-auto flex flex-col gap-4 pr-1">
              {/* Premium Call-to-action card */}
              <div className="relative bg-gradient-to-br from-slate-900 via-[#0f2027] to-mainColor rounded-3xl p-8 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-mainColor/30 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-blue-500/20 blur-3xl"></div>
                <div className="relative flex items-start justify-between flex-wrap gap-6 z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                        <Groups sx={{ fontSize: 24 }} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-black tracking-tight">Phân tích tổng quan hệ thống</h2>
                    </div>
                    <p className="text-slate-300 text-[15px] max-w-xl leading-relaxed font-medium">
                      AI sẽ phân tích <strong>toàn bộ lịch sử chat</strong> của tất cả người dùng để tìm ra
                      chủ đề phổ biến nhất, vấn đề đa số gặp phải, xu hướng sử dụng và đề xuất cải thiện hệ thống.
                    </p>
                    <div className="flex gap-2.5 mt-4 flex-wrap">
                      <span className="bg-white/10 backdrop-blur-sm border border-white/10 text-xs px-3 py-1.5 rounded-lg font-bold">📊 Chủ đề phổ biến</span>
                      <span className="bg-white/10 backdrop-blur-sm border border-white/10 text-xs px-3 py-1.5 rounded-lg font-bold">🔥 Vấn đề đa số gặp</span>
                      <span className="bg-white/10 backdrop-blur-sm border border-white/10 text-xs px-3 py-1.5 rounded-lg font-bold">📈 Xu hướng</span>
                      <span className="bg-white/10 backdrop-blur-sm border border-white/10 text-xs px-3 py-1.5 rounded-lg font-bold">💡 Đề xuất cải thiện</span>
                    </div>
                  </div>
                  <button
                    id="btn-analyze-all"
                    onClick={handleAnalyzeAll}
                    disabled={globalAnalyzing}
                    className="flex items-center gap-2 bg-mainColor text-white px-6 py-3.5 rounded-xl font-bold text-[15px] shadow-[0_4px_20px_rgb(0,0,0,0.2)] hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap mt-2"
                  >
                    {globalAnalyzing ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Đang phân tích AI...</>
                    ) : (
                      <><AutoAwesome sx={{ fontSize: 20 }} />Phân tích ngay</>
                    )}
                  </button>
                </div>
              </div>

              {/* Loading state */}
              {globalAnalyzing && (
                <div className="bg-white rounded-3xl border border-slate-100 p-12 flex flex-col items-center gap-4 shadow-sm mt-2">
                  <LoadingSpinner size="lg" />
                  <div className="text-center mt-2">
                    <p className="text-slate-700 font-extrabold text-lg">AI đang phân tích toàn bộ lịch sử chat...</p>
                    <p className="text-slate-400 font-medium mt-1">Quá trình này có thể mất 15-30 giây</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {globalError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-2 text-red-700 font-semibold shadow-sm mt-2">
                  <Warning sx={{ fontSize: 18 }} />{globalError}
                </div>
              )}

              {/* Global result */}
              {globalResult && <div className="mt-2"><GlobalAnalysisResult result={globalResult} onClose={() => setGlobalResult(null)} /></div>}

              {/* Empty state when no analysis yet */}
              {!globalAnalyzing && !globalResult && !globalError && (
                <div className="bg-white rounded-3xl border border-slate-100 p-16 flex flex-col items-center text-center shadow-sm mt-2">
                  <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                    <TrendingUp sx={{ fontSize: 40 }} className="text-slate-300" />
                  </div>
                  <h3 className="text-slate-800 font-black text-xl mb-3">Chưa có báo cáo tổng quan</h3>
                  <p className="text-[15px] text-slate-500 font-medium max-w-md leading-relaxed">
                    Nhấn <strong>"Phân tích ngay"</strong> ở trên để AI tiến hành rà soát hàng ngàn cuộc hội thoại và tổng hợp thành báo cáo chi tiết.
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
