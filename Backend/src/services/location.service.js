import { throwError } from "../utils/throwError.js";
import dotenv from "dotenv";

dotenv.config();

const GOOGLE_GEOCODE_API_URL =
  "https://maps.googleapis.com/maps/api/geocode/json";

export const geocodeAddress = async (address) => {
  try {
    const normalizedAddress = address?.trim();

    if (!normalizedAddress) {
      throwError("Địa chỉ không được để trống", 400, "ADDRESS_REQUIRED");
    }

    const apiKey = process.env.MAP_API_KEY;

    if (!apiKey) {
      throwError(
        "Thiếu cấu hình Google Maps API key",
        500,
        "MAP_API_KEY_MISSING",
      );
    }

    const url = `${GOOGLE_GEOCODE_API_URL}?address=${encodeURIComponent(
      normalizedAddress,
    )}&key=${apiKey}&language=vi&region=vn`;

    const response = await fetch(url);

    if (!response.ok) {
      throwError(
        "Không thể kết nối tới dịch vụ geocoding",
        response.status || 502,
        "GEOCODING_REQUEST_FAILED",
      );
    }

    const data = await response.json();

    if (data.status !== "OK") {
      if (data.status === "ZERO_RESULTS") {
        throwError(
          `Không tìm thấy tọa độ cho địa chỉ này: ${normalizedAddress}`,
          404,
          "LOCATION_NOT_FOUND",
        );
      }

      const googleMessage = data.error_message
        ? `${data.status}: ${data.error_message}`
        : `Google Geocoding trả về trạng thái ${data.status}`;

      throwError(
        googleMessage,
        data.status === "REQUEST_DENIED" ? 400 : 502,
        "GEOCODING_PROVIDER_ERROR",
      );
    }

    if (!data.results?.length) {
      throwError(
        `Không tìm thấy tọa độ cho địa chỉ này: ${normalizedAddress}`,
        404,
        "LOCATION_NOT_FOUND",
      );
    }

    const firstResult = data.results[0];
    const { lat, lng } = firstResult.geometry.location;

    return {
      lat,
      lng,
      formattedAddress: firstResult.formatted_address,
      placeId: firstResult.place_id,
    };
  } catch (error) {
    throwError(
      error.message || "Không thể geocode địa chỉ",
      error.status || 500,
      error.errorCode || "GEOCODING_ERROR",
    );
  }
};
