import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import {
  AccountCircle,
  Article,
  BarChart,
  EventNote,
  Logout,
  People,
  Home,
  Info,
  Newspaper,
  Science,
  Event,
  Email,
  ChevronRight,
  KeyboardArrowDown,
  Login,
  Group,
} from "@mui/icons-material";

import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../constants";
import { AuthContext } from "../../context/AuthContext";
import { logout } from "../../utils/cookieUtils";
import { useToast } from "../../context/ToastContext";
import { isAdmin } from "../../utils/permissions";
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

  const navigation = [
    { name: "Trang chủ", href: "/", icon: Home },
    { name: "Giới thiệu", href: "/about", icon: Info },
    { name: "Liên hệ", href: "/contact", icon: Email },
  ];

  const isActive = (path) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { user } = useContext(AuthContext);

  const userIsAdmin = isAdmin(user);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const handleLogout = async () => {
    try {
      await logout(); // Gọi hàm logout từ AuthContext - sẽ xóa cookie
      setActiveDropdown(null);
      navigate("/login"); // Chuyển hướng về trang đăng nhập
      toast.success(SUCCESS_MESSAGES.LOGOUT);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(ERROR_MESSAGES.SERVER_ERROR);
    }
  };

  // Mở modal xác nhận đăng xuất
  const openLogoutConfirmation = () => {
    setLogoutModalOpen(true);
  };

  return (
    <>
      <header className="bg-[#034657] shadow-lg  top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between text-white items-center py-2">
            <div className="flex-shrink-0">
              <Link to="/">
                <img className="h-16 w-auto" src={logoFita} alt="Logo FITA" />
              </Link>
            </div>

            <div className={`${user ? "ml-20" : ""} text-center py-3`}>
              <h1 className="text-xl md:text-2xl font-bold">
                Khoa Công Nghệ Thông Tin
              </h1>
              <h2 className="text-gray-300 text-sm md:text-base leading-tight">
                Quản lý sự kiện nghiên cứu khoa học
              </h2>
            </div>

            {/* User Actions - Desktop Login Button with Purple Theme */}
            <div className="hidden  md:flex items-center">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("user-menu")}
                    className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors px-2 py-1.5 rounded-md"
                  >
                    <div>
                      <img
                        src={user?.avatar || noAvatarImg}
                        alt={user.name}
                        className={`${
                          user.role === "admin"
                            ? "border-green-400"
                            : "border-[#ef9d1d]"
                        } w-10 p-[2px] h-10 border-2 rounded-full`}
                      />
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-sm whitespace-nowrap">
                        Xin chào, {user.name}
                      </span>
                      <KeyboardArrowDown
                        className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                          activeDropdown === "user-menu" ? "rotate-180" : ""
                        }`}
                        fontSize="small"
                      />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-xl z-50 transition-all duration-200 ${
                      activeDropdown === "user-menu"
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible translate-y-2"
                    }`}
                  >
                    <div className="py-2 px-4 border-b border-gray-100">
                      <p className="font-medium text-gray-800 text-sm">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <AccountCircle className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Hồ sơ</span>
                      </Link>

                      {userIsAdmin && (
                        <Link
                          to="/events/manage"
                          className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <EventNote className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Quản lý sự kiện</span>
                        </Link>
                      )}

                      {userIsAdmin && (
                        <Link
                          to="/user/manager"
                          className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <People className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Quản lý nhân sự</span>
                        </Link>
                      )}

                      {userIsAdmin && (
                        <Link
                          to="/news/manager"
                          className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <Article className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Quản lí tin tức</span>
                        </Link>
                      )}

                      <Link
                        to="/activity/standards"
                        className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <BarChart className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Định mức hoạt động</span>
                      </Link>

                      <Link
                        to="/research-groups/manager"
                        className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <BarChart className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Quản lý nhóm NCKH</span>
                      </Link>

                      <Link
                        to="/research-groups/profile"
                        className="flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <Group className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Hồ sơ nhóm</span>
                      </Link>
                    </div>

                    <div className="border-t border-gray-100">
                      <button
                        onClick={() => {
                          openLogoutConfirmation();
                          setActiveDropdown(null);
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

            {/* Mobile menu button */}
            <div className="md:hidden">
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-2 border-t border-gray-600">
              <div className="flex flex-col space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-mainColor bg-purple-900/20"
                        : "text-gray-300 hover:text-mainColor hover:bg-gray-700"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Login Button with Purple Theme */}
                <div className="px-3 mt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full bg-gradient-to-r from-mainColor to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 border border-purple-1000 flex items-center justify-center"
                  >
                    <span className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Đăng nhập</span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex w-full h-2 relative">
          <div className="w-1/4 top-2 bg-[#a4d38c] -skew-x-[55deg] relative"></div>
          <div className="w-3/4 bg-[#ef9d1d] -skew-x-[55deg]"></div>
        </div>
      </header>

      {/* Desktop Navigation */}
      <nav
        className={`hidden md:block  shadow-lg sticky top-0 bg-gray-100 z-40`}
        ref={dropdownRef}
      >
        <ul
          className={`flex  justify-center items-center space-x-4 font-medium py-2 max-w-7xl mx-auto px-4`}
        >
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
                isActive("/about")
                  ? "text-mainColor bg-purple-100"
                  : "text-gray-700"
              }`}
            >
              <span>Giới thiệu</span>
            </Link>
          </li>
          <li>
            <Link
              to="/news"
              className={`flex items-center text-sm hover:text-mainColor transition-colors px-3 py-1.5 rounded-md hover:bg-purple-100 ${
                isActive("/news")
                  ? "text-mainColor bg-purple-100"
                  : "text-gray-700"
              }`}
            >
              <span>Tin tức</span>
            </Link>
          </li>

          {/* Dropdown cho Các hoạt động NCKH */}
          <li className="relative">
            <button
              className={`flex items-center text-sm hover:text-mainColor transition-colors px-3 py-1.5 rounded-md hover:bg-purple-100 ${
                activeDropdown === "research"
                  ? "text-mainColor bg-purple-100"
                  : "text-gray-700"
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
              className={`absolute left-0 mt-1  w-64 overflow-auto  h-48 bg-white rounded-lg  shadow-lg z-50 transition-all duration-300 border border-gray-200 ${
                activeDropdown === "research"
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible translate-y-2"
              } scrollbar-hide `}
            >
              <div className="py-1">
                {RESEARCH_CATEGORIES.map((item) => (
                  <div
                    key={item.id}
                    className=" border-b mx-3 border-purple-200 last:border-b-0  "
                  >
                    <Link
                      key={item.id}
                      to={item.path}
                      className="flex items-center pr-4 py-2 text-sm text-gray-700 hover:bg-purple-100 hover:text-mainColor transition-colors"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <ChevronRight
                        className="mr-2 text-mainColor"
                        fontSize="inherit"
                      />
                      {item.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </li>

          {/* Dropdown cho Các sự kiện */}
          <li className="relative">
            <button
              className={`flex items-center text-sm hover:text-mainColor transition-colors px-3 py-1.5 rounded-md hover:bg-purple-100 ${
                activeDropdown === "events"
                  ? "text-mainColor bg-purple-100"
                  : "text-gray-700"
              }`}
              onClick={() => toggleDropdown("events")}
            >
              <span>Các sự kiện</span>
              <KeyboardArrowDown
                className={`ml-1 h-3 w-3 ${
                  activeDropdown === "events" ? "rotate-180" : ""
                }`}
                fontSize="small"
              />
            </button>
            <div
              className={`absolute left-0 mt-1  w-72 overflow-auto  h-48 bg-white rounded-lg shadow-lg z-50 transition-all duration-300 border border-gray-200 ${
                activeDropdown === "events"
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible translate-y-2"
              } scrollbar-hide`}
            >
              <div className="py-1  ">
                {EVENT_CATEGORIES.map((item) => (
                  <div
                    key={item.id}
                    className=" border-b mx-3 border-purple-200 last:border-b-0  "
                  >
                    <Link
                      to={item.path}
                      className="flex items-center pr-4 py-2 text-sm text-gray-700  hover:bg-purple-100 hover:text-mainColor transition-colors  "
                      onClick={() => setActiveDropdown(null)}
                    >
                      <EventNote
                        fontSize="inherit"
                        className="mr-2 text-mainColor"
                      />
                      {item.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </li>
        </ul>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-gray-100 shadow-md">
          <div className="py-1">
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

            {/* Mobile Research Dropdown */}
            <div className="px-4 py-2">
              <button
                className="flex items-center justify-between w-full text-left text-sm text-gray-700"
                onClick={() => toggleDropdown("mobile-research")}
              >
                <div className="flex items-center">
                  <Science className="w-4 h-4 mr-2" />
                  <span>Hoạt động NCKH</span>
                </div>
                <svg
                  className={`h-3 w-3 transition-transform ${
                    activeDropdown === "mobile-research" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {activeDropdown === "mobile-research" && (
                <div className="mt-1 pl-6 space-y-1">
                  {RESEARCH_CATEGORIES.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className="flex items-center py-1 text-xs text-gray-600 hover:text-mainColor"
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

            {/* Mobile Research Groups Link */}
            <Link
              to="/research-groups"
              className={`flex items-center px-4 py-2 text-sm hover:bg-purple-50 hover:text-mainColor transition-colors ${
                isActive("/research-groups")
                  ? "text-mainColor bg-purple-50"
                  : "text-gray-700"
              }`}
              onClick={() => {
                setIsMenuOpen(false);
                setActiveDropdown(null);
              }}
            >
              <Group className="w-4 h-4 mr-2" />
              <span>Nhóm NCKH</span>
            </Link>

            {/* Mobile Events Dropdown */}
            <div className="px-4 py-2">
              <button
                className="flex items-center justify-between w-full text-left text-sm text-gray-700"
                onClick={() => toggleDropdown("mobile-events")}
              >
                <div className="flex items-center">
                  <Event className="w-4 h-4 mr-2" />
                  <span>Các sự kiện</span>
                </div>
                <svg
                  className={`h-3 w-3 transition-transform ${
                    activeDropdown === "mobile-events" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {activeDropdown === "mobile-events" && (
                <div className="mt-1 pl-6 space-y-1">
                  {EVENT_CATEGORIES.map((item) => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className="flex items-center py-1 text-xs text-gray-600 hover:text-mainColor"
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
          </div>
        </nav>
      )}
      {/* Modal xác nhận đăng xuất */}
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
