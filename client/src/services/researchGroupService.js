import api from "./api";

const researchGroupService = {
  // User APIs
  createGroup: async (groupData) => {
    return await api.post("/research-groups/create", groupData);
  },

  getAllGroups: async (
    keyword = "",
    status = "",
    page = 0,
    size = 10,
    year = ""
  ) => {
    const params = {
      keyword,
      status,
      page,
      size,
      sortBy: "createdAt",
      sortDir: "DESC",
    };
    if (year) {
      params.year = year;
    }
    const response = await api.get("/research-groups", {
      params,
    });
    return response;
  },

  getGroupById: async (groupId) => {
    const response = await api.get(`/research-groups/${groupId}`);
    return response;
  },

  getMyGroups: async () => {
    const response = await api.get("/research-groups/my-groups");
    return response;
  },

  updateGroup: async (groupId, groupData) => {
    const response = await api.put(`/research-groups/${groupId}`, groupData);
    return response;
  },

  addMember: async (groupId, memberId) => {
    const response = await api.post(
      `/research-groups/${groupId}/members/${memberId}`
    );
    return response;
  },

  removeMember: async (groupId, memberId) => {
    const response = await api.delete(
      `/research-groups/${groupId}/members/${memberId}`
    );
    return response;
  },

  getStatistics: async () => {
    const response = await api.get("/research-groups/statistics");
    return response;
  },

  // Admin APIs
  approveGroup: async (groupId) => {
    const response = await api.put(`/admin/research-groups/${groupId}/approve`);
    return response;
  },

  rejectGroup: async (groupId, reason) => {
    const response = await api.put(
      `/admin/research-groups/${groupId}/reject`,
      null,
      {
        params: { reason },
      }
    );
    return response;
  },

  deleteGroup: async (groupId) => {
    const response = await api.delete(`/admin/research-groups/${groupId}`);
    return response;
  },

  // Update Google Sheet link
  updateGoogleSheetLink: async (groupId, googleSheetLink) => {
    const response = await api.put(
      `/research-groups/${groupId}/google-sheet-link`,
      { link: googleSheetLink }
    );
    return response.data;
  },

  // Update member info (role and participation rate)
  updateMemberInfo: async (groupId, memberId, role, participationRate) => {
    const response = await api.put(
      `/research-groups/${groupId}/members/${memberId}`,
      { role, participationRate }
    );
    return response.data;
  },

  // Import members from Excel
  importMembersFromExcel: async (groupId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(
      `/research-groups/${groupId}/members/import`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};

export default researchGroupService;
