import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TableChartIcon from "@mui/icons-material/TableChart";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AutorenewIcon from "@mui/icons-material/Autorenew";

import groupQuotaService from "../../services/groupQuotaService";
import researchGroupService from "../../services/researchGroupService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useToast } from "../../context/ToastContext";
import { AuthContext } from "../../context/AuthContext";
import PageHeader from "../../components/groupQuota/PageHeader";
import EmptyGroupQuota from "../../components/groupQuota/EmptyGroupQuota";
import GroupInfoCard from "../../components/groupQuota/GroupInfoCard";
import NcmGroupQuotasCard from "../../components/groupQuota/NcmGroupQuotasCard";
import OverviewTab from "../../components/groupQuota/OverviewTab";
import MatrixTab from "../../components/groupQuota/MatrixTab";
import EvaluationTab from "../../components/groupQuota/EvaluationTab";
import MembersTab from "../../components/groupQuota/MembersTab";
import ActivitiesTab from "../../components/groupQuota/ActivitiesTab";
import MemberManagementModal from "../ResearchGroup/components/MemberManagementModal";
import { getTypeConfig, mapChucDanhToKey } from "../../components/groupQuota/utils";

const TABS = [
  { id: "overview", label: "Tổng quan", icon: DashboardIcon },
  { id: "evaluation", label: "Đánh giá", icon: AssessmentIcon },
  { id: "activities", label: "Hoạt động", icon: ListAltIcon },
  { id: "matrix", label: "Bảng định mức", icon: TableChartIcon },
  { id: "members", label: "Thành viên", icon: PeopleIcon },
];

export default function GroupQuotaPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const [quota, setQuota] = useState(null);
  const [matrix, setMatrix] = useState(null);
  const [membersData, setMembersData] = useState(null);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [academicYear, setAcademicYear] = useState(new Date().getFullYear());

  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [managementGroup, setManagementGroup] = useState(null);
  const [managementLoading, setManagementLoading] = useState(false);

  const reloadMembersData = useCallback(async () => {
    try {
      const membersRes = await groupQuotaService.getGroupMembers();
      setMembersData(membersRes);
    } catch (e) {
      toast.error(e?.message || "Không tải lại danh sách thành viên");
    }
  }, [toast]);

  const openMemberManagement = useCallback(async () => {
    if (!quota?.groupId) return;
    setManagementLoading(true);
    try {
      const response = await researchGroupService.getMyGroups();
      const groups = response?.data ?? response ?? [];
      let group = groups.find((g) => Number(g.id) === Number(quota.groupId));
      if (!group) {
        const detail = await researchGroupService.getGroupById(quota.groupId);
        group = detail?.data ?? detail;
      }
      if (!group) {
        toast.error("Không tìm thấy thông tin nhóm");
        return;
      }
      setManagementGroup(group);
      setMemberModalOpen(true);
    } catch (e) {
      toast.error(e?.message || "Không mở được quản lý thành viên");
    } finally {
      setManagementLoading(false);
    }
  }, [quota?.groupId, toast]);

  const loadStats = useCallback(
    async (year) => {
      setStatsLoading(true);
      try {
        const data = await groupQuotaService.getMyGroupStats(year);
        setStats(data);
      } catch (e) {
        toast.error(e?.message || "Không tải được thống kê");
      } finally {
        setStatsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [quotaRes, matrixRes, membersRes] = await Promise.all([
          groupQuotaService.getMyQuota(),
          groupQuotaService.getCriteriaMatrix(),
          groupQuotaService.getGroupMembers(),
        ]);
        if (cancelled) return;

        setQuota(quotaRes);
        setMatrix(matrixRes);
        setMembersData(membersRes);
      } catch (e) {
        if (!cancelled) toast.error(e?.message || "Không tải được dữ liệu định mức nhóm");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  useEffect(() => {
    if (quota) loadStats(academicYear);
  }, [quota, academicYear, loadStats]);

  const typeConfig = quota ? getTypeConfig(quota.groupType) : null;
  const myChucDanhKey = quota ? mapChucDanhToKey(quota.chucDanh) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!quota) {
    return <EmptyGroupQuota onBack={() => navigate(-1)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      <PageHeader
        onBack={() => navigate(-1)}
        isLeader={quota.isLeader}
        onManageMembers={quota.isLeader ? openMemberManagement : undefined}
        manageLoading={managementLoading}
      />

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex-1">
            <AutorenewIcon sx={{ fontSize: 18 }} className="shrink-0" />
            <span className="font-medium">
              Hoạt động cộng vào nhóm theo hệ số PA 
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs font-bold text-slate-500">Năm</label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(Number(e.target.value))}
              className="border border-slate-200 rounded-lg py-2 px-3 text-sm font-semibold"
            >
              {[academicYear - 1, academicYear, academicYear + 1].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => loadStats(academicYear)}
              disabled={statsLoading}
              className="px-3 py-2 text-xs font-bold rounded-lg bg-mainColor text-white disabled:opacity-60"
            >
              {statsLoading ? "..." : "Làm mới"}
            </button>
          </div>
        </div>

        <GroupInfoCard quota={quota} typeConfig={typeConfig} />

        {quota.ncmGroupQuotas && <NcmGroupQuotasCard quotas={quota.ncmGroupQuotas} />}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b border-slate-100">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold transition-all
                    ${isActive
                      ? "text-mainColor border-b-2 border-mainColor bg-mainColor/5"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <Icon sx={{ fontSize: 18 }} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div>
            {activeTab === "overview" && (
              <OverviewTab quota={quota} stats={stats} onNavigateTab={setActiveTab} />
            )}
            {activeTab === "evaluation" && (
              <EvaluationTab
                stats={stats}
                loading={statsLoading}
                academicYear={academicYear}
                setAcademicYear={setAcademicYear}
                onRefresh={() => loadStats(academicYear)}
                isLeader={quota.isLeader}
                memberFactor={quota.memberFactor ?? 0.8}
              />
            )}
            {activeTab === "activities" && (
              <ActivitiesTab stats={stats} loading={statsLoading} academicYear={academicYear} />
            )}
            {activeTab === "matrix" && (
              <MatrixTab matrix={matrix} typeConfig={typeConfig} myChucDanhKey={myChucDanhKey} />
            )}
            {activeTab === "members" && (
              <MembersTab
                membersData={membersData}
                quota={quota}
                isLeader={quota.isLeader}
                onManageMembers={quota.isLeader ? openMemberManagement : undefined}
                manageLoading={managementLoading}
              />
            )}
          </div>
        </div>
      </div>

      {memberModalOpen && managementGroup && (
        <MemberManagementModal
          isOpen={memberModalOpen}
          onClose={() => {
            setMemberModalOpen(false);
            setManagementGroup(null);
          }}
          group={managementGroup}
          currentUserId={user?.id}
          onRefresh={reloadMembersData}
        />
      )}
    </div>
  );
}
