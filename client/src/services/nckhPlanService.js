import api from "./api";

const nckhPlanService = {
  getCurrent: async (userId, year) => {
    return await api.get("/nckh/plan/current", {
      params: { userId, year },
    });
  },

  selectAndLock: async (userId, academicYear, planCode) => {
    return await api.post(
      "/nckh/plan/select",
      { academicYear, planCode },
      { params: { userId } },
    );
  },
};

export default nckhPlanService;
