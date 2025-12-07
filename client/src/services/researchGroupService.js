import api from "./api";

const researchGroupService = {
  // User APIs
  createGroup: async (groupData) => {
   return  await api.post("/research-groups/create", groupData);
    // return response.data;
  },

  getAllGroups: async (keyword = "", status = "", page = 0, size = 10) => {
    const response = await api.get("/research-groups", {
      params: {
        keyword,
        status,
        page,
        size,
        sortBy: "createdAt",
        sortDir: "DESC",
      },
    });
    return response.data;
  },

  getGroupById: async (groupId) => {
    const response = await api.get(`/research-groups/${groupId}`);
    return response.data;
  },

  getMyGroups: async () => {
    const response = await api.get("/research-groups/my-groups");
    return response.data;
  },

  updateGroup: async (groupId, groupData) => {
    const response = await api.put(`/research-groups/${groupId}`, groupData);
    return response.data;
  },

  addMember: async (groupId, memberId) => {
    const response = await api.post(
      `/research-groups/${groupId}/members/${memberId}`
    );
    return response.data;
  },

  removeMember: async (groupId, memberId) => {
    const response = await api.delete(
      `/research-groups/${groupId}/members/${memberId}`
    );
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get("/research-groups/statistics");
    return response.data;
  },

  // Admin APIs
  approveGroup: async (groupId) => {
    const response = await api.put(`/admin/research-groups/${groupId}/approve`);
    return response.data;
  },

  rejectGroup: async (groupId, reason) => {
    const response = await api.put(
      `/admin/research-groups/${groupId}/reject`,
      null,
      {
        params: { reason },
      }
    );
    return response.data;
  },

  deleteGroup: async (groupId) => {
    const response = await api.delete(`/admin/research-groups/${groupId}`);
    return response.data;
  },
};

export default researchGroupService;
