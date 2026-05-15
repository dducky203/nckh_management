import api from "./api";

const groupQuotaService = {
  getMyQuota: async () => {
    const res = await api.get(`/research-groups/quota/my-quota`);
    return res?.data ?? res;
  },

  calculateMyGroup: async (quantities) => {
    const res = await api.post(`/research-groups/quota/my-calculate`, {
      quantities,
    });
    return res?.data ?? res;
  },

  getMyGroupStats: async (year) => {
    const res = await api.get(`/research-groups/quota/my-stats`, {
      params: year ? { year } : {},
    });
    return res?.data ?? res;
  },

  getCriteriaMatrix: async (groupType) => {
    const res = await api.get(`/research-groups/quota/criteria-matrix`, {
      params: groupType ? { groupType } : {},
    });
    return res?.data ?? res;
  },

  getGroupMembers: async (groupId) => {
    const res = await api.get(`/research-groups/quota/group-members`, {
      params: groupId ? { groupId } : {},
    });
    return res?.data ?? res;
  },
};

export default groupQuotaService;
