import api from "./index";

export const getTravelerDashboard = async () => {
  return await api.get("/traveler/dashboard");
};
