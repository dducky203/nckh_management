import api from "./api";

const nckhPlanService = {
  getCurrentPlan: async (userId, year) => {
    return await api.get("/nckh/plan/current", {
      params: { userId, year },
    });
  },

  selectAndLock: async (userId, planId, academicYear = null) => {
    return await api.post(
      "/nckh/plan/select",
      { planId, academicYear },
      { params: { userId } },
    );
  },

  getPlanStatistics: async (year) => {
    return await api.get("/nckh/plan/statistics", {
      params: { year },
    });
  },

  exportPlanStatisticsExcel: async (year) => {
    return await api.get("/nckh/plan/statistics/export-excel", {
      params: { year },
      responseType: "blob",
    });
  },
};

export default nckhPlanService;
