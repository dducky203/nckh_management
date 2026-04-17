import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

// Context Providers
import { AuthProvider } from "./context/AuthContext";

// Utils
import { fetchRoomsData } from "./utils/roomsData";

// Layout
import Layout from "./components/layout/Layout";

// Pages
import Home from "./pages/Home/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Auth/Unauthorized";
import ResearchProjects from "./pages/ResearchActivity/ResearchProjects";
// import EventsUpcoming from "./pages/Events/EventsUpcoming";

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ToastProvider } from "./context/ToastContext";
import Profile from "./pages/Users/Profile";
import UserManagement from "./pages/Users/UserManagement";
import EventDashboard from "./pages/Events/EventDashboard";
import EventsPublic from "./pages/Events/EventsPublic";
import CreateEvent from "./pages/Events/CreateEvent";
import News from "./pages/News/News";
import NewsDetail from "./pages/News/NewsDetail";
import NewsManager from "./pages/News/NewsManager";
import ResearchGroupManagement from "./pages/ResearchGroup/ResearchGroupManagement";
import ResearchGroupsPublic from "./pages/ResearchGroup/ResearchGroupsPublic";
import ResearchGroupProfile from "./pages/ResearchGroup/ResearchGroupProfile";
import ActivityStandards from "./pages/activity/ActivityStandards";
import NckhApprovalPage from "./pages/activity/NckhApprovalPage";
import PlanStatisticsPage from "./pages/activity/PlanStatisticsPage";
import ActivityAdminConfigPage from "./pages/activity/ActivityAdminConfigPage";
import ActivityUserFeaturePage from "./pages/activity/ActivityUserFeaturePage";
import ActivityYearQuotaConfigPage from "./pages/activity/ActivityYearQuotaConfigPage";
import SeminarDeclarationPage from "./pages/activity/declarations/SeminarDeclarationPage";
import ConferenceDeclarationPage from "./pages/activity/declarations/ConferenceDeclarationPage";
import InternationalPaperDeclarationPage from "./pages/activity/declarations/InternationalPaperDeclarationPage";
import VietnamesePaperDeclarationPage from "./pages/activity/declarations/VietnamesePaperDeclarationPage";
import ProceedingDeclarationPage from "./pages/activity/declarations/ProceedingDeclarationPage";
import ReviewPaperDeclarationPage from "./pages/activity/declarations/ReviewPaperDeclarationPage";
import TechConsultDeclarationPage from "./pages/activity/declarations/TechConsultDeclarationPage";
import TechProcedureDeclarationPage from "./pages/activity/declarations/TechProcedureDeclarationPage";
import ProposalDeclarationPage from "./pages/activity/declarations/ProposalDeclarationPage";

function App() {
  // Load rooms data when app starts
  useEffect(() => {
    fetchRoomsData().catch(console.error);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ToastProvider>
          <Routes>
            {/* Public routes - không cần đăng nhập */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Routes with layout */}
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Events Public - Không cần đăng nhập */}
                    <Route path="/events" element={<EventsPublic />} />

                    {/* Create Event - Yêu cầu đăng nhập */}
                    <Route
                      path="/events/create"
                      element={
                        <ProtectedRoute>
                          <CreateEvent />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activity"
                      element={
                        <ProtectedRoute>
                          <Navigate to="/activity/user" replace />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activity/user"
                      element={
                        <ProtectedRoute>
                          <ActivityUserFeaturePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activity/standards"
                      element={
                        <ProtectedRoute>
                          <ActivityStandards />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activity/admin"
                      element={
                        <ProtectedRoute requiredPower="admin">
                          <Navigate to="/activity/admin/config" replace />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activity/admin/config"
                      element={
                        <ProtectedRoute requiredPower="admin">
                          <ActivityAdminConfigPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activity/admin/approval"
                      element={
                        <ProtectedRoute requiredPower="admin">
                          <NckhApprovalPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activity/admin/plan-statistics"
                      element={
                        <ProtectedRoute requiredPower="admin">
                          <PlanStatisticsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activity/admin/year-quota"
                      element={
                        <ProtectedRoute requiredPower="admin">
                          <ActivityYearQuotaConfigPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activity/declarations/seminar"
                      element={
                        <ProtectedRoute>
                          <SeminarDeclarationPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activity/declarations/conference"
                      element={
                        <ProtectedRoute>
                          <ConferenceDeclarationPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activity/declarations/international-paper"
                      element={
                        <ProtectedRoute>
                          <InternationalPaperDeclarationPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activity/declarations/vietnamese-paper"
                      element={
                        <ProtectedRoute>
                          <VietnamesePaperDeclarationPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activity/declarations/proceeding"
                      element={
                        <ProtectedRoute>
                          <ProceedingDeclarationPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activity/declarations/review-paper"
                      element={
                        <ProtectedRoute>
                          <ReviewPaperDeclarationPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activity/declarations/tech-consult"
                      element={
                        <ProtectedRoute>
                          <TechConsultDeclarationPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activity/declarations/tech-procedure"
                      element={
                        <ProtectedRoute>
                          <TechProcedureDeclarationPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/activity/declarations/proposal"
                      element={
                        <ProtectedRoute>
                          <ProposalDeclarationPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Research Activities Routes - Yêu cầu đăng nhập */}
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/user/manager"
                      element={
                        <ProtectedRoute requiredPower="admin">
                          <UserManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/research-groups"
                      element={<ResearchGroupsPublic />}
                    />
                    <Route
                      path="/research-groups/manager"
                      element={
                        <ProtectedRoute>
                          <ResearchGroupManagement />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/research-groups/profile"
                      element={
                        <ProtectedRoute>
                          <ResearchGroupProfile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/events/manage"
                      element={
                        <ProtectedRoute requiredPower="admin">
                          <EventDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/research/projects"
                      element={
                        <ProtectedRoute>
                          <ResearchProjects />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/research/publications"
                      element={
                        <ProtectedRoute>
                          <div className="p-8 text-center">
                            Trang công bố khoa học
                          </div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/research/conferences"
                      element={
                        <ProtectedRoute>
                          <div className="p-8 text-center">
                            Trang hội nghị khoa học
                          </div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/research/competitions"
                      element={
                        <ProtectedRoute>
                          <div className="p-8 text-center">
                            Trang cuộc thi khoa học
                          </div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/research/seminars"
                      element={
                        <ProtectedRoute>
                          <div className="p-8 text-center">
                            Trang seminar & workshop
                          </div>
                        </ProtectedRoute>
                      }
                    />
                    {/* News Routes */}
                    <Route path="/news" element={<News />} />
                    <Route path="/news/details/:id" element={<NewsDetail />} />
                    <Route
                      path="/news/manager"
                      element={
                        <ProtectedRoute requiredPower="admin">
                          <NewsManager />
                        </ProtectedRoute>
                      }
                    />

                    {/* Events Routes */}
                    {/* <Route
                      path="/events/upcoming"
                      element={<EventsUpcoming />}
                    /> */}
                    <Route
                      path="/events/ongoing"
                      element={
                        <div className="p-8 text-center">
                          Sự kiện đang diễn ra
                        </div>
                      }
                    />
                    <Route
                      path="/events/past"
                      element={
                        <div className="p-8 text-center">Sự kiện đã qua</div>
                      }
                    />
                    <Route
                      path="/events/academic"
                      element={
                        <div className="p-8 text-center">Sự kiện học thuật</div>
                      }
                    />
                    <Route
                      path="/events/cultural"
                      element={
                        <div className="p-8 text-center">Sự kiện văn hóa</div>
                      }
                    />
                    <Route
                      path="/events/career"
                      element={
                        <div className="p-8 text-center">
                          Sự kiện nghề nghiệp
                        </div>
                      }
                    />
                    {/* News Route */}
                    <Route
                      path="/news"
                      element={
                        <div className="p-8 text-center">Trang tin tức</div>
                      }
                    />
                    {/* Placeholder routes for FITA functionality */}
                    <Route
                      path="/event/showE/:userId"
                      element={
                        <div className="p-8 text-center">
                          Trang xem/tạo sự kiện
                        </div>
                      }
                    />
                    <Route
                      path="/event/showEvManagement"
                      element={
                        <div className="p-8 text-center">
                          Trang quản lý sự kiện
                        </div>
                      }
                    />
                    <Route
                      path="/user/resume/:userId"
                      element={
                        <div className="p-8 text-center">
                          Trang hồ sơ người dùng
                        </div>
                      }
                    />
                    <Route
                      path="/user/manager"
                      element={
                        <div className="p-8 text-center">
                          Trang quản lý nhân sự
                        </div>
                      }
                    />
                    <Route
                      path="/news/managerNews"
                      element={
                        <div className="p-8 text-center">
                          Trang quản lý tin tức
                        </div>
                      }
                    />
                    <Route
                      path="/news/yourNews/:userId"
                      element={
                        <div className="p-8 text-center">
                          Trang tin tức của bạn
                        </div>
                      }
                    />
                    <Route
                      path="/event/statistics"
                      element={
                        <div className="p-8 text-center">Trang thống kê</div>
                      }
                    />
                    <Route
                      path="/ncm/normStatistics/:userId/:year"
                      element={
                        <div className="p-8 text-center">
                          Trang định mức hoạt động
                        </div>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </ToastProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
