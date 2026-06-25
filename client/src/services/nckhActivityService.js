import api from "./api";

const nckhActivityService = {
  createActivity: async (userId, payload) => {
    return await api.post("/nckh/activities", payload, { params: { userId } });
  },

  addContributors: async (activityId, contributors) => {
    return await api.post(`/nckh/activities/${activityId}/contributors`, {
      contributors,
    });
  },

  getContributors: async (activityId) => {
    return await api.get(`/nckh/activities/${activityId}/contributors`);
  },

  updateActivity: async (activityId, userId, payload) => {
    return await api.put(`/nckh/activities/${activityId}`, payload, {
      params: { userId },
    });
  },

  deleteActivity: async (activityId, userId) => {
    return await api.delete(`/nckh/activities/${activityId}`, {
      params: { userId },
    });
  },

  checkDuplicate: async (userId, payload, excludeActivityId) => {
    return await api.post("/nckh/activities/check-duplicate", payload, {
      params: { userId, excludeActivityId },
    });
  },

  submitActivity: async (activityId, userId) => {
    return await api.post(`/nckh/activities/${activityId}/submit`, null, {
      params: { userId },
    });
  },

  approveActivity: async (activityId, adminId) => {
    return await api.post(`/nckh/activities/${activityId}/approve`, null, {
      params: { adminId },
    });
  },

  rejectActivity: async (activityId, adminId) => {
    return await api.post(`/nckh/activities/${activityId}/reject`, null, {
      params: { adminId },
    });
  },

  getMyActivities: async (params) => {
    return await api.get("/nckh/activities/my", { params });
  },

  getPublicActivities: async (params) => {
    return await api.get("/nckh/activities/public", { params });
  },

  getPendingActivities: async (params) => {
    return await api.get("/nckh/activities/pending", { params });
  },

  getDashboard: async (userId, year) => {
    return await api.get("/nckh/dashboard", {
      params: { userId, year },
    });
  },

  getCatalog: async () => {
    return await api.get("/nckh/activity-catalog");
  },

  getDeclarationOptions: async () => {
    return await api.get("/nckh/activity-options");
  },

  getStatistics: async (userId, academicYear) => {
    return await api.get("/nckh/activities/statistics", {
      params: { userId, academicYear },
    });
  },
};

export default nckhActivityService;
