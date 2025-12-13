import { useState, useEffect } from "react";
import { Close, Add, Delete, Search } from "@mui/icons-material";
import userService from "../../../services/userService";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import Button from "../../../components/common/Button";

const GroupFormModal = ({ isOpen, onClose, onSave, group, currentUserId }) => {
  const [formData, setFormData] = useState({
    groupName: "",
    topicName: "",
    description: "",
    advisorId: null,
    memberIds: [],
  });
  // Separate states for advisor search
  const [advisorSearchTerm, setAdvisorSearchTerm] = useState("");
  const [advisorSearchResults, setAdvisorSearchResults] = useState([]);
  const [searchingAdvisor, setSearchingAdvisor] = useState(false);

  // Separate states for member search
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [memberSearchResults, setMemberSearchResults] = useState([]);
  const [searchingMember, setSearchingMember] = useState(false);

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (group) {
      setFormData({
        groupName: group.groupName || "",
        topicName: group.topicName || "",
        description: group.description || "",
        advisorId: group.advisor?.id || null,
        memberIds: group.members?.map((m) => m.id) || [],
      });
      setSelectedMembers(group.members || []);
      setSelectedAdvisor(group.advisor || null);
    } else {
      // Auto-add current user as a member for new groups
      if (currentUserId) {
        fetchCurrentUser();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, currentUserId]);

  const fetchCurrentUser = async () => {
    try {
      const response = await userService.getUserById(currentUserId);
      const user = response.data;
      setSelectedMembers([user]);
      setFormData((prev) => ({
        ...prev,
        memberIds: [user.id],
      }));
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const handleSearchAdvisor = async (e) => {
    if (e) e.preventDefault();
    if (!advisorSearchTerm.trim()) return;

    try {
      setSearchingAdvisor(true);
      const response = await userService.searchUsers(advisorSearchTerm, 0, 10);
      setAdvisorSearchResults(response.data.users || []);
    } catch (error) {
      console.error("Error searching advisors:", error);
    } finally {
      setSearchingAdvisor(false);
    }
  };

  const handleSearchMember = async (e) => {
    if (e) e.preventDefault();
    if (!memberSearchTerm.trim()) return;

    try {
      setSearchingMember(true);
      const response = await userService.searchUsers(memberSearchTerm, 0, 10);
      setMemberSearchResults(response.data.users || []);
    } catch (error) {
      console.error("Error searching members:", error);
    } finally {
      setSearchingMember(false);
    }
  };

  const handleAddMember = (user) => {
    if (selectedMembers.find((m) => m.id === user.id)) {
      return; // Already added
    }
    const newMembers = [...selectedMembers, user];
    setSelectedMembers(newMembers);
    setFormData({
      ...formData,
      memberIds: newMembers.map((m) => m.id),
    });
    setMemberSearchTerm("");
    setMemberSearchResults([]);
  };

  const handleRemoveMember = (userId) => {
    const newMembers = selectedMembers.filter((m) => m.id !== userId);
    setSelectedMembers(newMembers);
    setFormData({
      ...formData,
      memberIds: newMembers.map((m) => m.id),
    });
  };

  const handleSelectAdvisor = (user) => {
    setSelectedAdvisor(user);
    setFormData({
      ...formData,
      advisorId: user.id,
    });
    setAdvisorSearchTerm("");
    setAdvisorSearchResults([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.groupName.trim()) {
      newErrors.groupName = "Tên nhóm không được để trống";
    }

    if (!formData.topicName.trim()) {
      newErrors.topicName = "Tên đề tài không được để trống";
    }

    if (selectedMembers.length < 2) {
      newErrors.members = "Nhóm phải có ít nhất 2 thành viên";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error saving group:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {group ? "Chỉnh sửa nhóm NCKH" : "Tạo nhóm NCKH mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <Close />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên nhóm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="groupName"
              value={formData.groupName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.groupName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tên nhóm..."
            />
            {errors.groupName && (
              <p className="mt-1 text-sm text-red-500">{errors.groupName}</p>
            )}
          </div>

          {/* Topic Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đề tài <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="topicName"
              value={formData.topicName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.topicName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tên đề tài..."
            />
            {errors.topicName && (
              <p className="mt-1 text-sm text-red-500">{errors.topicName}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Mô tả chi tiết về nhóm và đề tài..."
            />
          </div>

          {/* Advisor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giảng viên hướng dẫn
            </label>
            {selectedAdvisor ? (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedAdvisor.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedAdvisor.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAdvisor(null);
                    setFormData({ ...formData, advisorId: null });
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Delete />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={advisorSearchTerm}
                    onChange={(e) => setAdvisorSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearchAdvisor(e);
                      }
                    }}
                    placeholder="Tìm giảng viên theo tên hoặc email..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleSearchAdvisor}
                    disabled={searchingAdvisor}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Search />
                  </button>
                </div>

                {searchingAdvisor && (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner />
                  </div>
                )}

                {advisorSearchResults.length > 0 && (
                  <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                    {advisorSearchResults.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectAdvisor(user)}
                        className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0"
                      >
                        <p className="font-medium text-gray-900">
                          {user.fullName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Members Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thành viên <span className="text-red-500">*</span> (tối thiểu 2)
            </label>

            {/* Selected Members */}
            <div className="space-y-2 mb-4">
              {selectedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {member.fullName}
                    </p>
                    <p className="text-sm text-gray-500">{member.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Delete />
                  </button>
                </div>
              ))}
            </div>

            {/* Search to Add Members */}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={memberSearchTerm}
                onChange={(e) => setMemberSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchMember(e);
                  }
                }}
                placeholder="Tìm thành viên theo tên hoặc email..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleSearchMember}
                disabled={searchingMember}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Search />
              </button>
            </div>

            {searchingMember && (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            )}

            {memberSearchResults.length > 0 && (
              <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                {memberSearchResults.map((user) => {
                  const isSelected = selectedMembers.find(
                    (m) => m.id === user.id
                  );
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleAddMember(user)}
                      disabled={isSelected}
                      className={`w-full text-left p-3 border-b last:border-b-0 ${
                        isSelected
                          ? "bg-gray-100 cursor-not-allowed"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <p className="font-medium text-gray-900">
                        {user.fullName} {isSelected && "(Đã thêm)"}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {errors.members && (
              <p className="mt-2 text-sm text-red-500">{errors.members}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <LoadingSpinner /> : group ? "Cập nhật" : "Tạo nhóm"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupFormModal;
