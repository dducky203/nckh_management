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

  // Document management
  getDocuments: async (groupId) => {
    const response = await api.get(`/research-groups/${groupId}/documents`);
    return response.data;
  },

  createDocument: async (groupId, documentName, documentType, description, file) => {
    const formData = new FormData();
    formData.append("documentName", documentName);
    formData.append("documentType", documentType);
    if (description) formData.append("description", description);
    formData.append("file", file);
    const response = await api.post(
      `/research-groups/${groupId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateDocument: async (groupId, documentId, documentName, documentType, description, file) => {
    const formData = new FormData();
    if (documentName) formData.append("documentName", documentName);
    if (documentType) formData.append("documentType", documentType);
    if (description) formData.append("description", description);
    if (file) formData.append("file", file);
    const response = await api.put(
      `/research-groups/${groupId}/documents/${documentId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteDocument: async (groupId, documentId) => {
    const response = await api.delete(
      `/research-groups/${groupId}/documents/${documentId}`
    );
    return response.data;
  },
};

  export const exportMembers = (groupId) => {
  return axios.get(
    `/research-groups/${groupId}/members/export`,
    { responseType: "blob" }
  );
};


export default researchGroupService;
