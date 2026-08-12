import {
  Add,
  Calculate,
  Delete,
  Description,
  Download,
  Edit,
  Groups,
  ManageAccounts,
  Topic,
} from "@mui/icons-material";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import { isQuotaGroup } from "../../components/groupQuota/utils";
import { ERROR_MESSAGES, getImageUrl, getResearchGroupStatus, SUCCESS_MESSAGES,  } from "../../constants";
import { formatDateTime } from "../../utils/dateHelpers";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { canAccessQuotaPages, canEditGroup } from "../../utils/permissions";
import researchGroupService from "../../services/researchGroupService";
import DocumentFormModal from "./components/DocumentFormModal";
import ResearchGroupProfileHeader from "./components/ResearchGroupProfileHeader";
import MemberManagementModal from "./components/MemberManagementModal";

function unwrapList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

const ResearchGroupProfile = () => {
  const toast = useToast();
  const { user } = useContext(AuthContext);
  const quotaAllowed = canAccessQuotaPages(user);
  const [myGroups, setMyGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [formData, setFormData] = useState({
    documentName: "",
    documentType: "",
    description: "",
    file: null,
  });

  const fetchMyGroups = useCallback(async () => {
    try {
      setGroupsLoading(true);
      const response = await researchGroupService.getMyGroups();
      const groups = unwrapList(response);
      setMyGroups(groups);
      if (groups.length > 0) {
        setCurrentGroup((prev) => {
          if (prev && groups.some((g) => g.id === prev.id)) return prev;
          return groups[0];
        });
      } else {
        setCurrentGroup(null);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error(error.message || ERROR_MESSAGES.DATA.LOAD_ERROR);
    } finally {
      setGroupsLoading(false);
    }
  }, [toast]);

  const fetchDocuments = useCallback(async () => {
    if (!currentGroup?.id) return;
    try {
      setLoading(true);
      const response = await researchGroupService.getDocuments(currentGroup.id);
      setDocuments(unwrapList(response));
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error(error.message || ERROR_MESSAGES.DATA.LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  }, [currentGroup?.id, toast]);

  useEffect(() => {
    fetchMyGroups();
  }, [fetchMyGroups]);

  useEffect(() => {
    if (currentGroup?.id) fetchDocuments();
    else setDocuments([]);
  }, [currentGroup?.id, fetchDocuments]);

  const resetForm = () => {
    setFormData({
      documentName: "",
      documentType: "",
      description: "",
      file: null,
    });
  };

  const handleAddDocument = () => {
    setSelectedDocument(null);
    resetForm();
    setFormModalOpen(true);
  };

  const handleEditDocument = (doc) => {
    setSelectedDocument(doc);
    setFormData({
      documentName: doc.documentName || doc.name || "",
      documentType: doc.documentType || doc.type || "",
      description: doc.description || "",
      file: null,
    });
    setFormModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.documentName?.trim() || !formData.documentType) {
      toast.error(ERROR_MESSAGES.FORM.REQUIRED_FIELDS);
      return;
    }
    if (!selectedDocument && !formData.file) {
      toast.error(ERROR_MESSAGES.FILE.SELECT_FILE);
      return;
    }
    if (!currentGroup?.id) {
      toast.error(ERROR_MESSAGES.GROUP.SELECT_GROUP);
      return;
    }

    try {
      setSaving(true);
      if (selectedDocument) {
        await researchGroupService.updateDocument(
          currentGroup.id,
          selectedDocument.id,
          formData.documentName.trim(),
          formData.documentType,
          formData.description?.trim() || null,
          formData.file || null
        );
        toast.success(SUCCESS_MESSAGES.UPDATE_SUCCESS);
      } else {
        await researchGroupService.createDocument(
          currentGroup.id,
          formData.documentName.trim(),
          formData.documentType,
          formData.description?.trim() || null,
          formData.file
        );
        toast.success(SUCCESS_MESSAGES.FILE.ADD_DOCUMENT);
      }
      setFormModalOpen(false);
      fetchDocuments();
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error(error.message || ERROR_MESSAGES.SYSTEM.SERVER);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!currentGroup?.id || !selectedDocument?.id) return;
    try {
      await researchGroupService.deleteDocument(currentGroup.id, selectedDocument.id);
      toast.success(SUCCESS_MESSAGES.COMMON.DELETE);
      setDeleteModalOpen(false);
      setSelectedDocument(null);
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || "Không thể xóa văn bản");
    }
  };

  const handleDownload = (doc) => {
    const fileUrl = doc.fileUrl || doc.url;
    if (!fileUrl) {
      toast.error(ERROR_MESSAGES.FILE.NO_DOWNLOAD_LINK);
      return;
    }
    window.open(getImageUrl(fileUrl), "_blank", "noopener,noreferrer");
  };

  if (groupsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <ResearchGroupProfileHeader />
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <Description className="mx-auto text-slate-200 mb-4" sx={{ fontSize: 56 }} />
          <h3 className="text-lg font-bold text-slate-700 mb-2">
            Bạn chưa tham gia nhóm nghiên cứu nào
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
            Tham gia hoặc đăng ký nhóm để quản lý hồ sơ văn bản tại đây.
          </p>
          <Link to="/research-groups">
            <Button variant="primary">Xem danh sách nhóm</Button>
          </Link>
        </div>
      </div>
    );
  }

  const status = getResearchGroupStatus(currentGroup.status);
  const memberCount = currentGroup.members?.length ?? 0;
  const userCanManageMembers = canEditGroup(user, currentGroup);

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans">
      <ResearchGroupProfileHeader groupName={currentGroup.groupName} />

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {/* Thông tin nhóm */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="space-y-3 min-w-0 flex-1">
              {myGroups.length > 1 && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Chọn nhóm</label>
                  <select
                    value={currentGroup.id}
                    onChange={(e) => {
                      const val = e.target.value;
                      const g = myGroups.find((x) => x.id == val);
                      if (g) setCurrentGroup(g);
                    }}
                    className="mt-1 block w-full max-w-md border border-slate-200 rounded-lg py-2 px-3 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-mainColor/30 focus:border-mainColor"
                  >
                    {myGroups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.groupName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${status.cls}`}
                >
                  {status.label}
                </span>
                {currentGroup.groupType && (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-mainColor/10 text-mainColor border border-mainColor/20">
                    {currentGroup.groupType}
                  </span>
                )}
                {memberCount > 0 && (
                  <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                    <Groups sx={{ fontSize: 14 }} />
                    {memberCount} thành viên
                  </span>
                )}
              </div>

              <div className="flex items-start gap-2 text-sm text-slate-600">
                <Topic sx={{ fontSize: 18 }} className="text-mainColor shrink-0 mt-0.5" />
                <span>{currentGroup.topicName || "—"}</span>
              </div>

              {quotaAllowed &&
                isQuotaGroup(currentGroup) &&
                currentGroup.status === "APPROVED" && (
                  <Link
                    to="/activity/group-quota"
                    className="inline-flex items-center gap-2 rounded-xl bg-mainColor px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-mainColor/90 transition"
                  >
                    <Calculate sx={{ fontSize: 16 }} />
                    Định mức nhóm NCKH
                  </Link>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              {userCanManageMembers && (
                <Button
                  variant="secondary"
                  onClick={() => setMemberModalOpen(true)}
                  className="flex items-center gap-1"
                >
                  <ManageAccounts fontSize="small" />
                  Quản lý thành viên
                </Button>
              )}
              <div className="text-right text-xs text-slate-400">
                <span className="block font-bold text-slate-500 uppercase mb-1">Văn bản</span>
                <span className="text-2xl font-black text-mainColor">{documents.length}</span>
              </div>
              <Button variant="primary" onClick={handleAddDocument} className="flex items-center gap-1">
                <Add fontSize="small" />
                Thêm văn bản
              </Button>
            </div>
          </div>
        </div>

        {/* Bảng văn bản */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="md" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Description className="mx-auto text-slate-200 mb-4" sx={{ fontSize: 48 }} />
              <h3 className="text-base font-bold text-slate-700 mb-1">Chưa có văn bản</h3>
              <p className="text-sm text-slate-500 mb-6">
                Tải lên quyết định, công văn, hồ sơ thanh toán...
              </p>
              <Button variant="primary" onClick={handleAddDocument}>
                <Add fontSize="small" className="mr-1" />
                Thêm văn bản đầu tiên
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase w-12">
                      #
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase">
                      Tên văn bản
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase">
                      Loại
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase hidden md:table-cell">
                      Ngày tạo
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase w-28">
                      Tệp
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase w-24">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {documents.map((doc, index) => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 text-slate-400 font-medium">{index + 1}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {doc.documentName || doc.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-mainColor/10 text-mainColor border border-mainColor/15">
                          {doc.documentType || doc.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">
                        {doc.createdAt ? formatDateTime(doc.createdAt) : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDownload(doc)}
                          className="inline-flex items-center justify-center p-2 rounded-lg text-mainColor hover:bg-mainColor/10 transition"
                          title="Mở / tải file"
                        >
                          <Download sx={{ fontSize: 20 }} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleEditDocument(doc)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-mainColor"
                            title="Sửa"
                          >
                            <Edit sx={{ fontSize: 18 }} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDocument(doc);
                              setDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                            title="Xóa"
                          >
                            <Delete sx={{ fontSize: 18 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <DocumentFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        selectedDocument={selectedDocument}
        saving={saving}
      />

      {memberModalOpen && currentGroup && (
        <MemberManagementModal
          isOpen={memberModalOpen}
          onClose={() => setMemberModalOpen(false)}
          group={currentGroup}
          currentUserId={user?.id}
          onRefresh={fetchMyGroups}
        />
      )}

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedDocument(null);
        }}
        onConfirm={confirmDelete}
        title="Xác nhận xóa văn bản"
        message={`Bạn có chắc muốn xóa "${selectedDocument?.documentName || selectedDocument?.name}"? File trên Cloudinary cũng sẽ bị xóa.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="delete"
      />
    </div>
  );
};

export default ResearchGroupProfile;
