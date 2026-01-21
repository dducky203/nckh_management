import api from "./api";

const researchGroupService = {
  createGroup: async (groupData) => {
    return await api.post("/research-groups/create", groupData);
  },

  getAllGroups: async (
    keyword = "",
    status = "",
    type = "",
    page = 0,
    size = 10
  ) => {
    const params = {
      keyword,
      status,
      type,
      page,
      size,
      sortBy: "createdAt",
      sortDir: "DESC",
    };

    const response = await api.get("/admin/research-groups", {
      params,
    });
    return response;
  },

  getAllGroupPublic: async (
    keyword = "",
    type = "",
    page = 0,
    size = 10
  ) => {
    const params = {
      keyword,
      type,
      page,
      size,
      sortBy: "createdAt",
      sortDir: "DESC",
    };

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
    return await api.get("/admin/research-groups/statistics");
  },

  // Admin APIs
  approveGroup: async (groupId) => {
    return await api.put(`/admin/research-groups/${groupId}/approve`);
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
    return response;
  },

  // Download Excel template for importing members
  downloadMemberImportTemplate: async () => {
    return await api.get("/research-groups/export-template", {
      responseType: "blob",
    });
  },

  // Document management
  getDocuments: async (groupId) => {
    const response = await api.get(`/research-groups/${groupId}/documents`);
    return response.data;
  },

  createDocument: async (
    groupId,
    documentName,
    documentType,
    description,
    file
  ) => {
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

  updateDocument: async (
    groupId,
    documentId,
    documentName,
    documentType,
    description,
    file
  ) => {
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

export default researchGroupService;
