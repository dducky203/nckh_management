import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import {
  AccountCircle,
  BarChart,
  Logout,
  Home,
  Info,
  Newspaper,
  Science,
  Event,
  ChevronRight,
  KeyboardArrowDown,
  Login,
  Group,
  Settings,
  Email,
  EventNote,
  AdminPanelSettings,
  SupervisorAccount,
} from "@mui/icons-material";

import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../constants";
import { AuthContext } from "../../context/AuthContext";
import { logout } from "../../utils/cookieUtils";
import { useToast } from "../../context/ToastContext";
import { hasNckhStaffAccess, isAssistantRole, normalizeRoleName } from "../../utils/permissions";
import Modal from "../common/Modal";
import logoFita from "../../assets/logo_fita.png";
import noAvatarImg from "../../assets/no-avatar-user.png";
import { EVENT_CATEGORIES, RESEARCH_CATEGORIES } from "../../utils";

const Header = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  const navigation = [
    { name: "Trang chủ", href: "/", icon: Home },
    { name: "Giới thiệu", href: "/about", icon: Info },
    { name: "Liên hệ", href: "/contact", icon: Email },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideDesktopNav =
        dropdownRef.current && dropdownRef.current.contains(event.target);
      const clickedInsideUserMenu =
        userMenuRef.current && userMenuRef.current.contains(event.target);

      if (clickedInsideDesktopNav || clickedInsideUserMenu) {
        return;
      }

      setActiveDropdown(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { user } = useContext(AuthContext);
  const userNckhStaff = hasNckhStaffAccess(user);
  const userIsAssistant = isAssistantRole(user);

  const toggleDropdown = (dropdownName) => {
    const nextDropdown = activeDropdown === dropdownName ? null : dropdownName;
    setActiveDropdown(nextDropdown);
  };

  const closeUserMenu = () => {
    setActiveDropdown(null);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeUserMenu();
      navigate("/login");
      toast.success(SUCCESS_MESSAGES.LOGOUT);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(ERROR_MESSAGES.SERVER_ERROR);
    }
  };

  const openLogoutConfirmation = () => {
    setLogoutModalOpen(true);
  };

  return (
    <>
      <header className="bg-[#034657] shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between text-white items-center py-2">
            <div className="flex-shrink-0">
              <Link to="/">
                <img className="h-12 md:h-16 w-auto" src={logoFita} alt="Logo FITA" />
              </Link>
            </div>

            <div className={`text-center py-1 flex-1 px-2 ${user ? "md:ml-20" : ""}`}>
              <h1 className="text-sm md:text-2xl font-bold uppercase md:capitalize">
                Khoa Công Nghệ Thông Tin
              </h1>
              <h2 className="text-gray-300 text-[10px] md:text-base leading-tight hidden sm:block">
                Quản lý sự kiện nghiên cứu khoa học
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <div className="hidden md:flex items-center">
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => toggleDropdown("user-menu")}
                      className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors px-2 py-1.5 rounded-md"
                    >
                      <img
                        src={user?.avatar || noAvatarImg}
                        alt={user.name}
                        className={`${
                          normalizeRoleName(user.role) === "admin"
                            ? "border-green-400"
                            : normalizeRoleName(user.role) === "assistant"
                              ? "border-sky-400"
                              : "border-[#ef9d1d]"
                        } w-8 h-8 md:w-10 md:h-10 p-[2px] border-2 rounded-full`}
                      />
                      <div className="hidden lg:flex items-center">
                        <span className="font-medium text-sm whitespace-nowrap">
                          Xin chào, {user.name}
                        </span>
                        <KeyboardArrowDown
                          className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                            activeDropdown === "user-menu" ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    <div
                      className={`absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-xl z-50 transition-all duration-200 ${
                        activeDropdown === "user-menu"
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible translate-y-2"
                      }`}
                    >
                      <div className="py-2 px-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-800 text-sm">
                            {user.name}
                          </p>
                          {userIsAssistant ? (
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                              <SupervisorAccount style={{ fontSize: 11 }} />
                              Trợ lí NCKH
                            </span>
                          ) : normalizeRoleName(user.role) === "admin" ? (
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
                              <AdminPanelSettings style={{ fontSize: 11 }} />
                              Admin
                            </span>
                          ) : null}
                        </div>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor"
                          onClick={closeUserMenu}
                        >
                          <AccountCircle className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Hồ sơ</span>
                        </Link>
                        {userNckhStaff && (
                          <>
                            <Link
                              to="/activity/admin/config"
                              className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor"
                              onClick={closeUserMenu}
                            >
                              <Settings className="w-4 h-4 mr-2 text-gray-400" />
                              <span>Cấu hình NCKH</span>
                            </Link>
                            <Link
                              to="/news/manager"
                              className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor"
                              onClick={closeUserMenu}
                            >
                              <Newspaper className="w-4 h-4 mr-2 text-gray-400" />
                              <span>Quản lý tin tức</span>
                            </Link>
                            <Link
                              to="/events/manage"
                              className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor"
                              onClick={closeUserMenu}
                            >
                              <EventNote className="w-4 h-4 mr-2 text-gray-400" />
                              <span>Quản lý sự kiện</span>
                            </Link>
                          </>
                        )}
                        <Link
                          to="/activity/standards"
                          className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor"
                          onClick={closeUserMenu}
                        >
                          <BarChart className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Định mức hoạt động</span>
                        </Link>
                        <Link
                          to="/research-groups/manager"
                          className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor"
                          onClick={closeUserMenu}
                        >
                          <BarChart className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Quản lý nhóm NCKH</span>
                        </Link>
                        <Link
                          to="/research-groups/profile"
                          className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor"
                          onClick={closeUserMenu}
                        >
                          <Group className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Hồ sơ nhóm</span>
                        </Link>
                      </div>

                      <div className="border-t border-gray-100">
                        <button
                          onClick={() => {
                            openLogoutConfirmation();
                            closeUserMenu();
                          }}
                          className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <Logout className="w-4 h-4 mr-2 text-red-500" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="relative bg-gradient-to-r from-[blue] to-purple-1000 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 border"
                  >
                    <span className="flex items-center space-x-1">
                      <Login className="w-3.5 h-3.5" />
                      <span>Đăng nhập</span>
                    </span>
                  </Link>
                )}
              </div>

              <div className="md:hidden flex items-center">
                {user && (
                  <img
                    src={user?.avatar || noAvatarImg}
                    alt={user.name}
                    className="w-8 h-8 p-[2px] border-2 border-gray-300 rounded-full mr-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  />
                )}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full h-2 relative">
          <div className="w-1/4 top-2 bg-[#a4d38c] -skew-x-[55deg] relative"></div>
          <div className="w-3/4 bg-[#ef9d1d] -skew-x-[55deg]"></div>
        </div>
      </header>

      <nav className={`hidden md:block shadow-lg sticky top-0 bg-gray-100 z-40`} ref={dropdownRef}>
        <ul className={`flex justify-center items-center space-x-4 font-medium py-2 max-w-7xl mx-auto px-4`}>
          <li>
            <Link
              to="/"
              className={`flex items-center text-sm hover:text-mainColor transition-colors px-3 py-1.5 rounded-md hover:bg-purple-100 ${
                isActive("/") ? "text-mainColor bg-purple-100" : "text-gray-700"
              }`}
            >
              <Home className="w-4 h-4 mr-1" />
              <span>Trang chủ</span>
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`flex items-center text-sm hover:text-mainColor transition-colors px-3 py-1.5 rounded-md hover:bg-purple-100 ${
                isActive("/about") ? "text-mainColor bg-purple-100" : "text-gray-700"
              }`}
            >
              <span>Giới thiệu</span>
            </Link>
          </li>
          <li>
            <Link
              to="/news"
              className={`flex items-center text-sm hover:text-mainColor transition-colors px-3 py-1.5 rounded-md hover:bg-purple-100 ${
                isActive("/news") ? "text-mainColor bg-purple-100" : "text-gray-700"
              }`}
            >
              <span>Tin tức</span>
            </Link>
          </li>

          <li className="relative">
            <button
              className={`flex items-center text-sm hover:text-mainColor transition-colors px-3 py-1.5 rounded-md hover:bg-purple-100 ${
                activeDropdown === "research" ? "text-mainColor bg-purple-100" : "text-gray-700"
              }`}
              onClick={() => toggleDropdown("research")}
            >
              <span>Hoạt động NCKH</span>
              <KeyboardArrowDown
                className={`ml-1 h-3 w-3 transition-transform duration-200 ${
                  activeDropdown === "research" ? "rotate-180" : ""
                }`}
                fontSize="small"
              />
            </button>
            <div
              className={`absolute left-0 mt-1 w-64 lg:w-[15vw] h-auto max-h-[40vh] overflow-auto bg-white rounded-lg shadow-lg z-50 transition-all duration-300 border border-gray-200 ${
                activeDropdown === "research"
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible translate-y-2"
              } scrollbar-hide`}
            >
              <div className="py-1">
                {RESEARCH_CATEGORIES.map((item) => (
                  <div key={item.id} className="border-b mx-3 border-purple-200 last:border-b-0">
                    <Link
                      to={item.path}
                      className="flex items-center pr-4 py-2 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor transition-colors"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <ChevronRight className="mr-2 text-mainColor" fontSize="inherit" />
                      {item.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </li>

          <li className="relative">
            <button
              className={`flex items-center text-sm hover:text-mainColor transition-colors px-3 py-1.5 rounded-md hover:bg-purple-100 ${
                activeDropdown === "events" ? "text-mainColor bg-purple-100" : "text-gray-700"
              }`}
              onClick={() => toggleDropdown("events")}
            >
              <span>Các sự kiện</span>
              <KeyboardArrowDown
                className={`ml-1 h-3 w-3 ${activeDropdown === "events" ? "rotate-180" : ""}`}
                fontSize="small"
              />
            </button>
            <div
              className={`absolute left-0 mt-1 w-64 lg:w-[15vw] h-auto max-h-[40vh] overflow-auto bg-white rounded-lg shadow-lg z-50 transition-all duration-300 border border-gray-200 ${
                activeDropdown === "events"
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible translate-y-2"
              } scrollbar-hide`}
            >
              <div className="py-1">
                {EVENT_CATEGORIES.map((item) => (
                  <div key={item.id} className="border-b mx-3 border-purple-200 last:border-b-0">
                    <Link
                      to={item.path}
                      className="flex items-center pr-4 py-2 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor transition-colors"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <EventNote fontSize="inherit" className="mr-2 text-mainColor" />
                      {item.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </li>
        </ul>
      </nav>

      {isMenuOpen && (
        <nav className="md:hidden bg-gray-100 shadow-md">
          <div className="py-1 max-h-[60vh] overflow-y-auto">
            <Link
              to="/"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="w-4 h-4 mr-2" />
              <span>Trang chủ</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor"
              onClick={() => setIsMenuOpen(false)}
            >
              <Info className="w-4 h-4 mr-2" />
              <span>Giới thiệu</span>
            </Link>
            <Link
              to="/news"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor"
              onClick={() => setIsMenuOpen(false)}
            >
              <Newspaper className="w-4 h-4 mr-2" />
              <span>Tin tức</span>
            </Link>

            <div className="px-4 py-2">
              <button
                className="flex items-center justify-between w-full text-left text-sm text-gray-700"
                onClick={() => toggleDropdown("mobile-research")}
              >
                <div className="flex items-center">
                  <Science className="w-4 h-4 mr-2" />
                  <span>Hoạt động NCKH</span>
                </div>
                <KeyboardArrowDown
                  className={`h-4 w-4 transition-transform ${
                    activeDropdown === "mobile-research" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeDropdown === "mobile-research" && (
                <div className="mt-1 pl-6 space-y-1">
                  {RESEARCH_CATEGORIES.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className="flex items-center py-2 text-xs text-gray-600 hover:text-mainColor"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveDropdown(null);
                      }}
                    >
                      <span className="w-1.5 h-1.5 bg-mainColor rounded-md mr-1.5"></span>
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/research-groups"
              className={`flex items-center px-4 py-2 text-sm hover:bg-purple-50 hover:text-mainColor transition-colors ${
                isActive("/research-groups") ? "text-mainColor bg-purple-50" : "text-gray-700"
              }`}
              onClick={() => {
                setIsMenuOpen(false);
                setActiveDropdown(null);
              }}
            >
              <Group className="w-4 h-4 mr-2" />
              <span>Nhóm NCKH</span>
            </Link>

            <div className="px-4 py-2">
              <button
                className="flex items-center justify-between w-full text-left text-sm text-gray-700"
                onClick={() => toggleDropdown("mobile-events")}
              >
                <div className="flex items-center">
                  <Event className="w-4 h-4 mr-2" />
                  <span>Các sự kiện</span>
                </div>
                <KeyboardArrowDown
                  className={`h-4 w-4 transition-transform ${
                    activeDropdown === "mobile-events" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeDropdown === "mobile-events" && (
                <div className="mt-1 pl-6 space-y-1">
                  {EVENT_CATEGORIES.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className="flex items-center py-2 text-xs text-gray-600 hover:text-mainColor"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setActiveDropdown(null);
                      }}
                    >
                      <span className="w-1.5 h-1.5 bg-mainColor rounded-md mr-1.5"></span>
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="border-t border-gray-200 mt-2 pt-2 pb-4">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tài khoản</p>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-mainColor"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <AccountCircle className="w-4 h-4 mr-2" />
                  Hồ sơ
                </Link>
                {userNckhStaff && (
                  <>
                    <Link
                      to="/activity/admin/config"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-mainColor"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Cấu hình NCKH
                    </Link>
                    <Link
                      to="/news/manager"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-mainColor"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Newspaper className="w-4 h-4 mr-2" />
                      Quản lý tin tức
                    </Link>
                    <Link
                      to="/events/manage"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-mainColor"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <EventNote className="w-4 h-4 mr-2" />
                      Quản lý sự kiện
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    openLogoutConfirmation();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Logout className="w-4 h-4 mr-2" />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="px-4 py-4 border-t border-gray-200">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-gradient-to-r from-mainColor to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 border border-purple-1000 flex items-center justify-center"
                >
                  <span className="flex items-center space-x-2">
                    <Login className="w-4 h-4" />
                    <span>Đăng nhập</span>
                  </span>
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}

      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        type="logout"
      />
    </>
  );
};

export default Header;