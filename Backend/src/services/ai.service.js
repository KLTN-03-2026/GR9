import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateItinerary = async (data) => {
  try {
    const destination = data?.destination || "Da Nang";
    const numberDay = data?.numberDay ?? data?.duration ?? 3;
    const budget = Number(data?.budget) || 5000000;
    const travelStyle = data?.travelStyle || "family";
    const quantity = data?.quantity ?? 4;
    const startDate = data?.startDate || "2023-08-01";

    const prompt = `
      Bạn là Senior Travel Planner chuyên nghiệp.
      Nhiệm vụ của bạn là tạo ra một tour du lịch hợp lý, thực tế và tối ưu theo các dữ kiện đầu vào sau.
      Nếu không có data đầu vào từ người dùng, hãy tạo dữ liệu mẫu tương ứng với:
        destination: "Da Nang"
        numberDay: 3
        budget: 5000000
        travelStyle: "family"
        quantity: 4
        startDate: "2023-08-01"
 
      Input:
        destination: "${destination}"
        numberDay: ${numberDay}
        budget: ${budget}
        travelStyle: "${travelStyle}"
        quantity: ${JSON.stringify(quantity)}
        startDate: ${JSON.stringify(startDate)}

      Yêu cầu:
      1. Tạo tour du lịch phù hợp với điểm đến, số ngày, ngân sách, phong cách du lịch, số lượng người, thời tiết và nhu cầu ăn uống.
      2. Lịch trình phải hợp lý theo từng ngày.
      3. Các hoạt động phải phân bổ theo mốc giờ cụ thể.
      4. Từ dò thời tiết kể từ theo ${numberDay} bắt đầu từ ${startDate} để tạo các hoạt động, ưu tiên các hoạt động trong nhà hoặc hoạt động phù hợp thời tiết.
      5. Nếu delicious là true hoặc có mô tả món ăn yêu thích, hãy thêm các hoạt động liên quan đến ăn uống, đặc sản, quán ăn nổi bật.
      6. Tổng chi phí ước tính của tour phải cố gắng không vượt quá budget.
      7. price trong JSON output phải cùng đơn vị với budget input, không được tự ý đổi đơn vị tiền.
      8. Nếu budget = 3999 thì price phải là số quanh mức đó hoặc thấp hơn, không được trả về kiểu 3650000.
      9. Dữ liệu trả về phải là JSON hợp lệ, không thêm giải thích, không thêm markdown, không thêm text ngoài JSON.
      10. Các field phải bám sát format mẫu dưới đây.
      11. Chỉ sử dụng TÊN DỊCH VỤ và ĐỊA CHỈ thực tế có trên Google Maps. Với khách sạn, bắt buộc phải là khách sạn có thật, tên và địa chỉ phải trùng khớp với Google Maps.
      12. Nếu không xác nhận được địa chỉ khách sạn, hãy chọn khách sạn khác có thật trên Google Maps.
      13. Địa chỉ của mỗi serviceId phải chi tiết, cụ thể, gồm: số nhà, tên đường, phường/xã, quận/huyện, thành phố, và nếu có thể thì mã bưu chính.

      Quy tắc tạo dữ liệu:
      - location = destination
      - quantity = số người tham gia
      - price = tổng chi phí ước tính của tour
      - description = mô tả ngắn gọn về tour
      - numberOfDay = số ngày du lịch
      - type:
        - "PRIVATE" nếu quantity <= 5
        - "GROUP" nếu quantity > 5
      - minSlots = quantity nếu là tour private, hoặc tối thiểu 1 nếu là group
      - maxSlots = quantity nếu là private, hoặc quantity + 5 nếu là group
      - isActive = true
      - startDay = ngày hiện tại hoặc ngày gần nhất hợp lý ở dạng ISO string
      - itineraries gồm danh sách từng ngày
      - mỗi ngày gồm:
        - dayNumber
        - description
        - activities
      - mỗi activity gồm:
        - time
        - statusActivity: mặc định "NOT_DONE"
        - serviceId
      - serviceId là object mô tả dịch vụ/địa điểm, gồm:
        - name
        - type
        - address
        - long
        - lat
        - description
        - total: mảng giá, mỗi phần tử gồm:
          - price
          - type: "ADULT" hoặc "CHILD"
        - status: "ACTIVE"

      Các loại serviceId.type có thể dùng:
      - "HOTEL",
      - "TRANSPORT",
      - "TOUR_GUIDE",
      - "FOOD",
      - "ATTRACTION_TICKET",
      - "COMBO",
      - "OTHER",

      Format JSON mẫu:
      {
        "quantity": {
          "ADULT": 0,
          "CHILD": 0,
          "INFANT": 0
        },
        "price": 0,
        "location": "",
        "description": "",
        "numberOfDay": 0,
        "startDay": "",
        "type": "GROUP",
        "minSlots": 0,
        "maxSlots": 0,
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
                  "total": [
                    {
                      "price": 0,
                      "type": "ADULT"
                    }
                  ],
                  "status": "ACTIVE"
                }
              }
            ]
          }
        ]
      }

      Chỉ trả về JSON hợp lệ.
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return result.text;
  } catch (error) {
    throw error;
  }
};
