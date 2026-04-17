import api from "./index";

export const callAi = async (payload) => {
  return await api.post("/ai", payload);
};
