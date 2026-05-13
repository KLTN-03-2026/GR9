# Travel_AI

Travel_AI là hệ thống lập kế hoạch du lịch thông minh tích hợp đặt tour, quản lý dịch vụ, thanh toán, theo dõi hành trình và trợ lý AI. Dự án được xây dựng theo kiến trúc tách riêng Frontend và Backend, phù hợp cho các vai trò Traveler, Provider, Guide và Admin.

## Tính năng chính

- Traveler xem danh sách tour, lọc/sắp xếp tour, xem chi tiết tour và đặt tour.
- Thanh toán booking qua PayOS và theo dõi trạng thái booking.
- Live tracking tour và tạo tracking link để chia sẻ cho người thân.
- Đánh giá tour và hướng dẫn viên sau khi hoàn tất chuyến đi.
- AI Travel Planner tạo lịch trình du lịch theo điểm đến, ngân sách, thời gian và số lượng khách.
- Voyager/SmartTravel AI chatbot hỗ trợ hỏi đáp về tour, booking, thanh toán, chính sách và Knowledge Base.
- Provider quản lý tour, lịch khởi hành, dịch vụ, guide, booking, review và analytics.
- Admin quản lý user, duyệt provider, quản lý analytics và hồ sơ hệ thống.
- Guide xem tour được phân công, cập nhật tracking và quản lý hồ sơ.
- Hỗ trợ dark/light mode và chuyển đổi ngôn ngữ VI/EN cho giao diện.

## Công nghệ sử dụng

### Frontend

- React 19
- Vite
- Tailwind CSS 4
- Shadcn/Radix UI
- Framer Motion
- React Router DOM
- Axios
- Lucide React
- Firebase client config

### Backend

- Node.js
- Express
- MongoDB/Mongoose
- JWT authentication
- Cloudinary upload ảnh/tài liệu
- PayOS payment
- Gemini API cho AI Planner, chatbot và embedding
- Supabase + pgvector cho Knowledge Base
- Nodemailer gửi email

## Cấu trúc thư mục

```text
Travel_AI/
+-- Backend/
|   +-- src/
|   |   +-- config/
|   |   +-- controllers/
|   |   +-- database/
|   |   +-- middlewares/
|   |   +-- models/
|   |   +-- routes/
|   |   +-- scripts/
|   |   +-- services/
|   |   +-- utils/
|   |   +-- server.js
|   +-- package.json
+-- Frontend/
|   +-- src/
|   |   +-- components/
|   |   +-- i18n/
|   |   +-- pages/
|   |   +-- services/
|   |   +-- theme/
|   |   +-- utils/
|   |   +-- main.jsx
|   +-- package.json
+-- KhoaLuanTotNghiep/
+-- README.md
```

## Yêu cầu môi trường

- Node.js 20 trở lên. Dự án đang chạy được với Node.js 22.
- MongoDB Atlas hoặc MongoDB local.
- Tài khoản Cloudinary.
- Tài khoản PayOS.
- Gemini API key.
- Supabase project đã bật extension `vector` nếu dùng chatbot KB.

## Cài đặt

Clone hoặc mở project, sau đó cài dependency cho từng phần:

```bash
cd Backend
npm install
```

```bash
cd Frontend
npm install
```

## Cấu hình môi trường

Tạo file `.env` trong `Backend/` và `Frontend/`. Không commit file `.env` thật lên Git.

### Backend `.env`

Ví dụ các biến chính:

```env
PORT=3000
URL_FE=http://localhost:5173
FRONTEND_APP_URL=http://localhost:5173

MONGO_URL=mongodb+srv://...
MONGO_URI=mongodb+srv://...

JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES=7d

COOKIE_SECURE=false
COOKIE_SAMESITE=lax

GEMINI_API_KEY=your_gemini_api_key

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

PAYOS_CLIENT_ID=your_payos_client_id
PAYOS_API_KEY=your_payos_api_key
PAYOS_CHECKSUM_KEY=your_payos_checksum_key

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
MAIL_FROM=Travel_AI

MAP_API_KEY=your_map_api_key
```

Nếu dùng Firebase Admin ở backend, bổ sung các biến `GOOGLE_*` tương ứng trong `Backend/src/config/firebase.js`.

### Frontend `.env`

```env
VITE_API_URL=http://localhost:3000/api
VITE_MAP_API_KEY=your_map_api_key

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Cấu hình Knowledge Base Supabase

Trong Supabase SQL Editor, chạy file:

```text
Backend/src/database/kb_supabase.sql
```

File này tạo:

- Extension `vector`
- Bảng `kb_documents`
- HNSW index cho embedding
- Function `match_kb_documents`

Sau đó có thể thêm dữ liệu KB thông qua API/backend hoặc insert trực tiếp tùy luồng triển khai.

## Chạy dự án ở môi trường dev

Chạy Backend:

```bash
cd Backend
npm run dev
```

Backend mặc định chạy tại:

```text
http://localhost:3000
```

Chạy Frontend:

```bash
cd Frontend
npm run dev
```

Frontend mặc định chạy tại:

```text
http://localhost:5173
```

## Seed dữ liệu demo

Trong thư mục `Backend`, có thể chạy các script:

```bash
npm run seed:users
npm run seed:service
npm run seed:demo
npm run seed:bulk
```

Ý nghĩa:

- `seed:users`: tạo user demo theo các vai trò.
- `seed:service`: tạo dịch vụ demo.
- `seed:demo`: tạo dữ liệu tour/booking/review demo.
- `seed:bulk`: tạo nhiều dữ liệu hơn để demo danh sách tour/service.

Nếu dữ liệu tour cũ dùng field guide sai, chạy migration:

```bash
npm run migrate:lead-guide-field
```

## Build production

Frontend:

```bash
cd Frontend
npm run build
```

Preview frontend build:

```bash
npm run preview
```

Backend production:

```bash
cd Backend
npm start
```

## Các route chính

### Public/Guest

- `/` - Landing page
- `/login` - Đăng nhập traveler
- `/signup` - Đăng ký
- `/apply-provider` - Đăng ký provider
- `/guest/booking-success-and-tracking-link` - Trang sau booking/thanh toán

### Traveler

- `/traveler` - Dashboard traveler
- `/traveler/tour-list` - Danh sách tour
- `/traveler/tour-detail/:tourId` - Chi tiết tour
- `/traveler/my-booking-traveler` - Booking của tôi
- `/traveler/tour-tracking` - Live tracking
- `/traveler/traveler-tracking-link-management` - Quản lý tracking link
- `/traveler/ai-travel-planner` - AI Travel Planner
- `/traveler/ai-tour-history` - Lịch sử AI Planner
- `/traveler/review` - Đánh giá tour/guide

### Provider

- `/provider` - Dashboard provider
- `/provider/manage-tours` - Quản lý tour
- `/provider/service-management` - Quản lý dịch vụ
- `/provider/guide-management` - Quản lý guide
- `/provider/bookings-management` - Quản lý booking
- `/provider/analytics` - Analytics provider
- `/provider/reviews` - Quản lý review

### Admin

- `/admin` - Dashboard admin
- `/admin/users` - Quản lý người dùng
- `/admin/provider-approval` - Duyệt provider
- `/admin/provider-approval-history` - Lịch sử duyệt provider
- `/admin/analytics` - Analytics admin

### Guide

- `/guide` - Dashboard guide
- `/guide/assigned-tours` - Tour được phân công
- `/guide/live-tour-tracking` - Cập nhật tracking tour
- `/guide/profile` - Hồ sơ guide

## API Backend

Backend mount các route chính dưới prefix `/api`:

```text
/api/auth
/api/users
/api/admin
/api/provider
/api/guide
/api/tours
/api/services
/api/ai
/api/location
/api/images
/api/traveler
/api/traveler/tracking
/api/guest
/api/booking
/api/reviews
/api/chatbot
```

## Ghi chú vận hành

- PayOS yêu cầu `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`. Thiếu các biến này backend có thể crash khi import PayOS.
- Gemini quota có thể hết ở free tier. Khi hết quota, chatbot có fallback trả lời bằng dữ liệu có sẵn từ hệ thống.
- Supabase service role key chỉ dùng ở backend, không đưa lên frontend.
- Cloudinary dùng cho ảnh tour/service/user và tài liệu provider.
- Không commit `.env`, API key, service role key hoặc private key.

## Kiểm tra nhanh

Build frontend:

```bash
cd Frontend
npm run build
```

Kiểm tra syntax một file backend:

```bash
node --check src/services/chatbot.service.js
```

## Thành viên/đồ án

Dự án phục vụ khóa luận tốt nghiệp với đề tài:

```text
Xây dựng hệ thống lập kế hoạch du lịch thông minh tích hợp đặt dịch vụ dựa trên công nghệ AI
```
