import { error, success } from "../utils/response.js";
import { geocodeAddress } from "../services/location.service.js";

export const geocodeAddressController = async (req, res) => {
  try {
    const location = await geocodeAddress(req.query.address);
    return success(res, "Geocode địa chỉ thành công", location, 200);
  } catch (err) {
    return error(
      res,
      err.message || "Geocode địa chỉ thất bại",
      err.status || 500,
      err.errorCode,
    );
  }
};
