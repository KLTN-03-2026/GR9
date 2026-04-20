import api from "./index";

export const geocodeAddress = async (address) => {
  return await api.get("/location/geocode", {
    params: { address },
  });
};
