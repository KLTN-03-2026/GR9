import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import AiTourRequest from "../models/aiTourRequest.model.js";
import { throwError } from "../utils/throwError.js";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateItinerary = async (data) => {
  try {
    const destination = data?.destination || "Da Nang";
    const numberDay = data?.numberDay ?? data?.duration ?? 3;
    const budget = Number(data?.budget) || 5000000;
    const describe = data?.describe || "";
    const quantity = data?.quantity ?? 4;
    const startDate = data?.startDate || "2023-08-01";

    const prompt = `
      Tạo 1 tour du lịch bằng JSON hợp lệ, không markdown, không giải thích.

      Input:
      - destination: "${destination}"
      - numberDay: ${numberDay}
      - budget: ${budget}
      - describe: "${describe}"
      - quantity: ${JSON.stringify(quantity)}
      - startDate: ${JSON.stringify(startDate)}

      Quy tắc:
      - Bám model Tour: location, description, numberOfDay, type, price, isActive, itineraries.
      - Bám model TourSchedule: startDay là departureDate ISO, minSlots/maxSlots dùng cho số chỗ, currentBooked = 0, status mặc định "PENDING".
      - quantity và price dùng key "ADULT", "CHILD", "INFANT"; price cùng đơn vị với budget và tổng giá cố gắng <= budget. Nếu budget nhỏ như 3999 thì price cũng quanh 3999, không đổi sang 3999000.
      - Tổng số khách = ADULT + CHILD + INFANT. Nếu input quantity là số thì xem là ADULT.
      - type = "PRIVATE" nếu tổng khách <= 5, ngược lại "GROUP"; minSlots = tổng khách nếu PRIVATE, ngược lại 1; maxSlots = tổng khách nếu PRIVATE, ngược lại tổng khách + 5.
      - Mỗi ngày có dayNumber, description, activities; mỗi activity có time dạng "HH:mm", statusActivity = "NOT_DONE", serviceId là object dịch vụ.
      - serviceId.type chỉ dùng: "HOTEL", "TRANSPORT", "RESTAURANT", "ACTIVITY", "FOOD", "ATTRACTION", "ATTRACTION_TICKET", "COMBO", "OTHER".
      - Độ chính xác tên địa điểm là bắt buộc: mỗi serviceId, hotelServiceId, transportServiceId phải có name là tên chính thức của địa điểm/doanh nghiệp có thật, khớp với destination.
      - Không bịa tên, không dùng tên chung như "local hotel", "restaurant near beach", "night market", "city tour"; phải dùng tên riêng cụ thể có thể tìm trên Google Maps.
      - Nếu không chắc 100% về name của một service, hãy thay bằng địa điểm nổi tiếng hơn mà bạn chắc chắn.
      - address nên cụ thể nếu biết; long và lat có thể để 0 vì hệ thống sẽ dùng Google API để lấy tọa độ khi render UI.
      - Trước khi trả JSON, tự kiểm tra từng service: name có thật, type đúng enum. Nếu name không chắc, đổi service khác rồi mới trả kết quả.
      - Ưu tiên yêu cầu trong describe, món ăn/đặc sản nếu có, và lịch trình phù hợp thời tiết theo startDate.

      Trả đúng schema này:
      {
        "quantity": { "ADULT": 0, "CHILD": 0, "INFANT": 0 },
        "price": { "ADULT": 0, "CHILD": 0, "INFANT": 0 },
        "location": "",
        "description": "",
        "numberOfDay": 0,
        "startDay": "",
        "type": "GROUP",
        "minSlots": 1,
        "maxSlots": 1,
        "isActive": true,
        "itineraries": [
          {
            "dayNumber": 1,
            "description": "",
            "activities": [
              {
                "time": "08:00",
                "statusActivity": "NOT_DONE",
                "serviceId": {
                  "name": "",
                  "type": "ATTRACTION",
                  "address": "",
                  "long": 0,
                  "lat": 0,
                  "description": "",
                  "total": [{ "price": 0, "type": "ADULT" }],
                  "status": "ACTIVE"
                }
              }
            ]
          }
        ],
        "hotelServiceId": {
          "name": "",
          "type": "HOTEL",
          "address": "",
          "long": 0,
          "lat": 0,
          "description": "",
          "total": [
            { "price": 0, "type": "ADULT" },
            { "price": 0, "type": "CHILD" },
            { "price": 0, "type": "INFANT" }
          ],
          "status": "ACTIVE"
        },
        "transportServiceId": {
          "name": "",
          "type": "TRANSPORT",
          "address": "",
          "long": 0,
          "lat": 0,
          "description": "",
          "total": [
            { "price": 0, "type": "ADULT" },
            { "price": 0, "type": "CHILD" },
            { "price": 0, "type": "INFANT" }
          ],
          "status": "ACTIVE"
        }
      }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return result.text;
  } catch (error) {
    throwError(
      error.message || "Không thể tạo lịch trình bằng AI",
      error.status || 500,
      "GENERATE_ITINERARY_ERROR",
    );
  }
};

export const saveAiTourRequest = async (data, travelerId) => {
  try {
    const tour = data?.tour || data;

    return await AiTourRequest.create({
      ...tour,
      travelerId,
    });
  } catch (error) {
    throwError(
      error.message || "Không thể lưu lịch trình AI",
      error.status || 500,
      "SAVE_AI_TOUR_REQUEST_ERROR",
    );
  }
};

export const getAiTourRequestHistory = async (travelerId) => {
  try {
    return await AiTourRequest.find({ travelerId })
      .sort({ createdAt: -1 })
      .select(
        "location description numberOfDay startDay type minSlots maxSlots quantity price status itineraries hotelServiceId transportServiceId createdAt",
      );
  } catch (error) {
    throwError(
      error.message || "Không thể tải lịch sử lịch trình AI",
      error.status || 500,
      "GET_AI_TOUR_REQUEST_HISTORY_ERROR",
    );
  }
};

export const getAiTourRequestById = async (id, travelerId) => {
  try {
    return await AiTourRequest.findOne({ _id: id, travelerId });
  } catch (error) {
    throwError(
      error.message || "Không thể tải chi tiết lịch trình AI",
      error.status || 500,
      "GET_AI_TOUR_REQUEST_DETAIL_ERROR",
    );
  }
};
