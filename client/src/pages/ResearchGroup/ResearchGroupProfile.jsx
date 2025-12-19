import { useState, useEffect, useContext } from "react";
import {
  Add,
  Delete,
  Edit,
  Download,
  Description,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../constants";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import researchGroupService from "../../services/researchGroupService";
import api from "../../services/api";
import { BASE_IMG_URL } from "../../constants";

const DOCUMENT_TYPES = [
  "Thông báo",
  "Hồ Sơ Thanh Toán",
  "Quyết Định",
  "Tài liệu khác",
];

const ResearchGroupProfile = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [formData, setFormData] = useState({
    documentName: "",
    documentType: "",
    file: null,
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // TODO: Gọi API để lấy danh sách văn bản của nhóm
      // const response = await researchGroupService.getGroupDocuments(user.groupId);
      // setDocuments(response.data || []);
      
      // Demo data với 6 ví dụ
      const mockDocuments = [
        {
          id: 1,
          documentName: "Mẫu phiếu đăng kí đề tài thực tập chuyên ngành",
          documentType: "Thông báo",
          fileUrl: "/file/template1.docx",
        },
        {
          id: 2,
          documentName: "Mẫu phiếu đăng ký học phần khóa luận tốt nghiệp, thực tập chuyên ngành",
          documentType: "Quyết Định",
          fileUrl: "/file/template2.docx",
        },
        {
          id: 3,
          documentName: "Mẫu phiếu đăng kí đề tài thực tập tốt nghiệp",
          documentType: "Thông báo",
          fileUrl: "/file/template3.docx",
        },
        {
          id: 4,
          documentName: "Giấy xác nhận của đơn vị thực tập",
          documentType: "Hồ Sơ Thanh Toán",
          fileUrl: "/file/template4.docx",
        },
        {
          id: 5,
          documentName: "Quyết định phê duyệt đề tài nghiên cứu khoa học",
          documentType: "Quyết Định",
          fileUrl: "/file/template5.pdf",
        },
        {
          id: 6,
          documentName: "Báo cáo tiến độ nghiên cứu quý I/2025",
          documentType: "Thông Báo",
          fileUrl: "/file/template6.pdf",
        },
      ];
      setDocuments(mockDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error(error.message || ERROR_MESSAGES.LOAD_DATA_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = () => {
    setSelectedDocument(null);
    setFormData({
      documentName: "",
      documentType: "",
      file: null,
    });
    setFormModalOpen(true);
  };

  const handleEditDocument = (doc) => {
    setSelectedDocument(doc);
    setFormData({
      documentName: doc.documentName || doc.name,
      documentType: doc.documentType || doc.type,
      file: null,
    });
    setFormModalOpen(true);
  };

  const handleDeleteDocument = (doc) => {
    setSelectedDocument(doc);
    setDeleteModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.documentName || !formData.documentType) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (!selectedDocument && !formData.file) {
      toast.error("Vui lòng chọn file");
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("documentName", formData.documentName);
      submitData.append("documentType", formData.documentType);
      if (formData.file) {
        submitData.append("file", formData.file);
      }

      if (selectedDocument) {
        // TODO: Cập nhật văn bản
        // await researchGroupService.updateDocument(selectedDocument.id, submitData);
        toast.success("Cập nhật văn bản thành công");
      } else {
        // TODO: Tạo văn bản mới
        // await researchGroupService.createDocument(submitData);
        toast.success("Thêm văn bản thành công");
      }

      setFormModalOpen(false);
      fetchDocuments();
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };

  const confirmDelete = async () => {
    try {
      // TODO: Xóa văn bản
      // await researchGroupService.deleteDocument(selectedDocument.id);
      toast.success(SUCCESS_MESSAGES.DELETE_SUCCESS);
      setDeleteModalOpen(false);
      setSelectedDocument(null);
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error(error.message || "Không thể xóa văn bản");
    }
  };

  const handleDownload = (document) => {
    // TODO: Tải file về
    const fileUrl = document.fileUrl || document.url;
    if (fileUrl) {
      window.open(`${BASE_IMG_URL}${fileUrl}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Description className="text-blue-600" />
            Hồ sơ nhóm
          </h1>
          <p className="mt-2 text-gray-600">
            Quản lý các văn bản và tài liệu của nhóm nghiên cứu
          </p>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Tổng số văn bản: <span className="font-semibold">{documents.length}</span>
          </div>
          <button
            onClick={handleAddDocument}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Add />
            Thêm văn bản
          </button>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <Description className="mx-auto text-gray-300 mb-4" sx={{ fontSize: 64 }} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có văn bản nào
              </h3>
              <p className="text-gray-500 mb-4">
                Hãy thêm văn bản đầu tiên cho nhóm nghiên cứu
              </p>
              <button
                onClick={handleAddDocument}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Add />
                Thêm văn bản
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      STT
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên văn bản
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                      Loại văn bản
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Link download
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map((doc, index) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {doc.documentName || doc.name}
                      </td>
                      <td className="px-6 py-4 min-w-[150px]">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">
                          {doc.documentType || doc.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="text-orange-600 hover:text-orange-800 transition-colors"
                          title="Tải xuống"
                        >
                          <Download />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditDocument(doc)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Xóa"
                          >
                            <Delete fontSize="small" />
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

      {/* Add/Edit Document Modal */}
      {formModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedDocument ? "Chỉnh sửa văn bản" : "Thêm văn bản mới"}
              </h2>
              <button
                onClick={() => setFormModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên văn bản <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.documentName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        documentName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tên văn bản"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại văn bản <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        documentType: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Chọn loại văn bản</option>
                    {DOCUMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File {!selectedDocument && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    required={!selectedDocument}
                  />
                  {selectedDocument && (
                    <p className="text-xs text-gray-500 mt-1">
                      Để trống nếu không muốn thay đổi file
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {selectedDocument ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedDocument(null);
        }}
        onConfirm={confirmDelete}
        title="Xác nhận xóa văn bản"
        message={`Bạn có chắc chắn muốn xóa văn bản "${selectedDocument?.documentName || selectedDocument?.name}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="delete"
      />
    </div>
  );
};

export default ResearchGroupProfile;

