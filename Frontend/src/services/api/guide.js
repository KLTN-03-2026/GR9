import api from "./index";    

export const createGuide = async (guide) => {
  return await api.post("/guide", guide);
};
