import { useState, useEffect, useContext } from "react";
import {
  Close,
  Edit,
  Save,
  Link as LinkIcon,
  Article,
  School,
  Description,
  OpenInNew,
  Visibility,
} from "@mui/icons-material";
import { AuthContext } from "../../../context/AuthContext";
import researchGroupService from "../../../services/researchGroupService";
import { useToast } from "../../../context/ToastContext";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../../constants";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const ProductManagementModal = ({ isOpen, onClose, group, onRefresh }) => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [googleSheetLink, setGoogleSheetLink] = useState("");
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [tempLink, setTempLink] = useState("");
  const [products, setProducts] = useState([]);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (isOpen && group) {
      fetchGroupData();
      checkUserPermission();
    }
  }, [isOpen, group, user]);

  const fetchGroupData = async () => {
    if (!group?.id) return;

    try {
      setLoading(true);
      const response = await researchGroupService.getGroupById(group.id);
      const groupData = response.data || response;
      
      // Lấy Google Sheet link từ group data
      setGoogleSheetLink(groupData.googleSheetLink || "");
      setTempLink(groupData.googleSheetLink || "");
      
      // TODO: Fetch products/activities from API
      // Tạm thời dùng mock data
      setProducts([
        {
          id: 1,
          type: "Bài báo quốc tế",
          title: "Research on AI Applications in Agriculture",
          authors: "Nguyễn Văn A, Trần Thị B",
          year: 2024,
          journal: "International Journal of AI",
          link: "https://example.com/paper1",
        },
        {
          id: 2,
          type: "Hội thảo",
          title: "Seminar về IoT trong Nông nghiệp",
          date: "15/03/2024",
          location: "Học viện Nông nghiệp Việt Nam",
        },
        {
          id: 3,
          type: "Bài báo tiếng Việt",
          title: "Ứng dụng Blockchain trong Quản lý Chuỗi Cung ứng",
          authors: "Lê Văn C, Phạm Thị D",
          year: 2024,
          journal: "Tạp chí Khoa học Công nghệ",
        },
      ]);
    } catch (error) {
      console.error("Error fetching group data:", error);
      toast.error(error.message || ERROR_MESSAGES.LOAD_DATA_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const checkUserPermission = () => {
    if (!user || !group) {
      setIsMember(false);
      return;
    }

    // Kiểm tra xem user có phải là leader, advisor hoặc member không
    const isLeader = group.leader?.id === user.id;
    const isAdvisor = group.advisor?.id === user.id;
    const isGroupMember = group.members?.some((m) => m.id === user.id);

    setIsMember(isLeader || isAdvisor || isGroupMember);
  };

  const handleEditLink = () => {
    setTempLink(googleSheetLink);
    setIsEditingLink(true);
  };

  const handleCancelEdit = () => {
    setTempLink(googleSheetLink);
    setIsEditingLink(false);
  };

  const handleSaveLink = async () => {
    if (!group?.id) return;

    try {
      setLoading(true);
      // TODO: Gọi API để cập nhật Google Sheet link
      await researchGroupService.updateGoogleSheetLink(group.id, tempLink);
      
      setGoogleSheetLink(tempLink);
      setIsEditingLink(false);
      toast.success("Cập nhật link Google Sheet thành công");
      
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error updating Google Sheet link:", error);
      toast.error(error.message || "Không thể cập nhật link");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSheet = () => {
    if (googleSheetLink) {
      window.open(googleSheetLink, "_blank");
    }
  };

  if (!isOpen || !group) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Quản lý sản phẩm nghiên cứu
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Nhóm: {group.groupName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Close />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && !isEditingLink ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Google Sheet Link Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <LinkIcon className="text-blue-600" />
                    Link Google Sheet (Minh chứng)
                  </h3>
                  {isMember && !isEditingLink && (
                    <button
                      onClick={handleEditLink}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit fontSize="small" />
                      Chỉnh sửa
                    </button>
                  )}
                </div>

                {isEditingLink ? (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex gap-2 mb-3">
                      <input
                        type="url"
                        value={tempLink}
                        onChange={(e) => setTempLink(e.target.value)}
                        placeholder="Nhập link Google Sheet..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveLink}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                      >
                        <Save fontSize="small" />
                        Lưu
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={loading}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Chỉ thành viên nhóm mới có quyền cập nhật link này
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {googleSheetLink ? (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <a
                            href={googleSheetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 break-all"
                          >
                            <OpenInNew fontSize="small" />
                            {googleSheetLink}
                          </a>
                        </div>
                        <button
                          onClick={handleOpenSheet}
                          className="ml-4 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <Visibility fontSize="small" />
                          Mở
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <LinkIcon className="mx-auto mb-2 text-gray-300" />
                        <p>Chưa có link Google Sheet</p>
                        {isMember && (
                          <p className="text-xs mt-1">
                            Nhấn "Chỉnh sửa" để thêm link
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Products/Activities Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Article className="text-green-600" />
                  Hoạt động nghiên cứu của nhóm
                </h3>

                {products.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <Description className="mx-auto mb-2 text-gray-300" />
                    <p>Chưa có sản phẩm nghiên cứu nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">
                                {product.type}
                              </span>
                              {product.year && (
                                <span className="text-sm text-gray-500">
                                  {product.year}
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              {product.title}
                            </h4>
                            {product.authors && (
                              <p className="text-sm text-gray-600 mb-1">
                                <strong>Tác giả:</strong> {product.authors}
                              </p>
                            )}
                            {product.journal && (
                              <p className="text-sm text-gray-600 mb-1">
                                <strong>Tạp chí:</strong> {product.journal}
                              </p>
                            )}
                            {product.date && (
                              <p className="text-sm text-gray-600 mb-1">
                                <strong>Ngày:</strong> {product.date}
                              </p>
                            )}
                            {product.location && (
                              <p className="text-sm text-gray-600">
                                <strong>Địa điểm:</strong> {product.location}
                              </p>
                            )}
                          </div>
                          {product.link && (
                            <a
                              href={product.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xem chi tiết"
                            >
                              <OpenInNew />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductManagementModal;
