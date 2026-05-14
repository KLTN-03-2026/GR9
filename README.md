<div align="center">

# Smart Travel

### Hệ thống lập kế hoạch du lịch thông minh tích hợp đặt tour, thanh toán, tracking và AI Assistant

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=fff)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=fff)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=fff)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=fff)
![Gemini](https://img.shields.io/badge/Gemini-AI-8E75FF?style=for-the-badge&logo=google&logoColor=fff)

</div>

---

## Tổng quan

**Smart Travel** là nền tảng du lịch thông minh giúp kết nối **Traveler**, **Provider**, **Guide** và **Admin** trong cùng một hệ thống. Dự án hỗ trợ người dùng tìm tour, đặt tour, thanh toán, theo dõi hành trình, đánh giá dịch vụ và sử dụng AI để tạo lịch trình hoặc hỏi đáp thông tin du lịch.

Hệ thống được xây dựng theo mô hình tách riêng:

- **Frontend**: React, Vite, Tailwind CSS, Shadcn/Radix UI.
- **Backend**: Node.js, Express, MongoDB, JWT, Cloudinary, PayOS, Gemini, Supabase pgvector.

---

## Mục lục

- [Tính năng nổi bật](#tính-năng-nổi-bật)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Yêu cầu môi trường](#yêu-cầu-môi-trường)
- [Cài đặt nhanh](#cài-đặt-nhanh)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Cấu hình Knowledge Base](#cấu-hình-knowledge-base)
- [Seed dữ liệu](#seed-dữ-liệu)
- [Route chính](#route-chính)
- [API Backend](#api-backend)
- [Build production](#build-production)
- [Ghi chú bảo mật](#ghi-chú-bảo-mật)

---

## Tính năng nổi bật

| Nhóm người dùng | Chức năng |
| --- | --- |
| **Guest** | Xem landing page, đăng ký tài khoản, gửi đơn đăng ký provider, xem tracking public |
| **Traveler** | Xem tour, đặt tour, thanh toán PayOS, quản lý booking, tạo tracking link, đánh giá tour/guide |
| **Provider** | Quản lý tour, lịch khởi hành, service, guide, booking, review và analytics |
| **Guide** | Xem tour được phân công, cập nhật live tracking, quản lý hồ sơ |
| **Admin** | Quản lý người dùng, duyệt provider, xem analytics, quản lý hồ sơ hệ thống |
| **AI Assistant** | Chatbot hỏi đáp KB/database, gợi ý tour, trả lời booking/tour/policy theo dữ liệu thật |

Các điểm đáng chú ý:

- AI Travel Planner tạo lịch trình theo điểm đến, ngân sách, ngày đi và số lượng khách.
- Chatbot dùng Gemini, MongoDB và Supabase pgvector Knowledge Base.
- Tour card trong chatbot có ảnh, giá, rating và link vào trang chi tiết tour.
- Hỗ trợ **dark/light mode** và chuyển đổi giao diện **VI/EN**.
- Upload ảnh/tài liệu qua Cloudinary.
- Thanh toán booking qua PayOS.
- Tracking link giúp người thân theo dõi tiến trình tour.

---

## Công nghệ sử dụng

### Frontend

| Công nghệ | Vai trò |
| --- | --- |
| React 19 | Xây dựng UI |
| Vite | Dev server và build tool |
| Tailwind CSS 4 | Styling |
| Shadcn/Radix UI | Component UI |
| Framer Motion | Animation |
| React Router DOM | Routing |
| Axios | Gọi API |
| Firebase Client | Cấu hình auth/client nếu cần |
| Mapbox/Google Maps | Bản đồ và địa điểm |

### Backend

| Công nghệ | Vai trò |
| --- | --- |
| Node.js + Express | REST API |
| MongoDB + Mongoose | Database chính |
| JWT | Xác thực và phân quyền |
| Cloudinary | Lưu ảnh/tài liệu |
| PayOS | Tạo link thanh toán |
| Gemini API | AI Planner, chatbot, embedding |
| Supabase + pgvector | Knowledge Base vector search |
| Nodemailer | Gửi email |
| Multer | Upload file |

---

## Cấu trúc thư mục

```text
Smart Travel/
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

---

## Yêu cầu môi trường

- Node.js 20 trở lên. Dự án đang chạy tốt với Node.js 22.
- MongoDB Atlas hoặc MongoDB local.
- Tài khoản Cloudinary.
- Tài khoản PayOS.
- Gemini API key.
- Supabase project nếu dùng Knowledge Base chatbot.
- SMTP account nếu dùng chức năng gửi email.

---

## Cài đặt nhanh

### 1. Cài Backend

```bash
cd Backend
npm install
```

### 2. Cài Frontend

```bash
cd Frontend
npm install
```

### 3. Chạy Backend

```bash
cd Backend
npm run dev
```

Backend mặc định chạy tại:

```text
http://localhost:3000
```

### 4. Chạy Frontend

```bash
cd Frontend
npm run dev
```

Frontend mặc định chạy tại:

```text
http://localhost:5173
```

---

## Cấu hình môi trường

Tạo file `.env` trong `Backend/` và `Frontend/`.

> Không commit `.env` thật lên Git.

### Backend `.env`

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
MAIL_FROM=Smart_Travel

MAP_API_KEY=your_map_api_key
```

Nếu dùng Firebase Admin ở backend, bổ sung các biến `GOOGLE_*` theo file:

```text
Backend/src/config/firebase.js
```

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

---

## Cấu hình Knowledge Base

Chatbot sử dụng Supabase + pgvector để tìm kiếm Knowledge Base.

Trong Supabase SQL Editor, chạy file:

```text
Backend/src/database/kb_supabase.sql
```

File này tạo:

- Extension `vector`
- Bảng `kb_documents`
- HNSW index cho embedding
- Function `match_kb_documents`

Sau khi tạo bảng, có thể thêm dữ liệu KB trực tiếp bằng SQL hoặc thông qua API/backend tùy luồng triển khai.

---

## Seed dữ liệu

Chạy trong thư mục `Backend`:

```bash
npm run seed:users
npm run seed:service
npm run seed:demo
npm run seed:bulk
```

| Script | Mục đích |
| --- | --- |
| `seed:users` | Tạo user demo theo role |
| `seed:service` | Tạo service demo |
| `seed:demo` | Tạo tour, booking, review demo |
| `seed:bulk` | Tạo nhiều tour/service để demo dữ liệu lớn |

Nếu dữ liệu cũ dùng sai field guide, chạy:

```bash
npm run migrate:lead-guide-field
```

---

## Route chính

### Public/Guest

| Route | Mô tả |
| --- | --- |
| `/` | Landing page |
| `/login` | Đăng nhập traveler |
| `/signup` | Đăng ký |
| `/apply-provider` | Đăng ký provider |
| `/guest/booking-success-and-tracking-link` | Trang sau booking/thanh toán |

### Traveler

| Route | Mô tả |
| --- | --- |
| `/traveler` | Dashboard traveler |
| `/traveler/tour-list` | Danh sách tour |
| `/traveler/tour-detail/:tourId` | Chi tiết tour |
| `/traveler/my-booking-traveler` | Booking của tôi |
| `/traveler/tour-tracking` | Live tracking |
| `/traveler/traveler-tracking-link-management` | Quản lý tracking link |
| `/traveler/ai-travel-planner` | AI Travel Planner |
| `/traveler/ai-tour-history` | Lịch sử AI Planner |
| `/traveler/review` | Đánh giá tour/guide |

### Provider

| Route | Mô tả |
| --- | --- |
| `/provider` | Dashboard provider |
| `/provider/manage-tours` | Quản lý tour |
| `/provider/service-management` | Quản lý dịch vụ |
| `/provider/guide-management` | Quản lý guide |
| `/provider/bookings-management` | Quản lý booking |
| `/provider/analytics` | Analytics provider |
| `/provider/reviews` | Quản lý review |

### Admin

| Route | Mô tả |
| --- | --- |
| `/admin` | Dashboard admin |
| `/admin/users` | Quản lý người dùng |
| `/admin/provider-approval` | Duyệt provider |
| `/admin/provider-approval-history` | Lịch sử duyệt provider |
| `/admin/analytics` | Analytics admin |

### Guide

| Route | Mô tả |
| --- | --- |
| `/guide` | Dashboard guide |
| `/guide/assigned-tours` | Tour được phân công |
| `/guide/live-tour-tracking` | Cập nhật tracking tour |
| `/guide/profile` | Hồ sơ guide |

---

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

---

## Build production

### Frontend

```bash
cd Frontend
npm run build
```

Preview bản build:

```bash
npm run preview
```

### Backend

```bash
cd Backend
npm start
```

---

## Kiểm tra nhanh

Build frontend:

```bash
cd Frontend
npm run build
```

Kiểm tra syntax backend:

```bash
cd Backend
node --check src/services/chatbot.service.js
```

---

## Ghi chú bảo mật

- Không commit `.env`, API key, secret key hoặc private key.
- `SUPABASE_SERVICE_ROLE_KEY` chỉ được dùng ở Backend.
- PayOS cần đủ `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY`.
- Cloudinary key chỉ nên đặt trong Backend.
- Gemini free tier có giới hạn quota. Khi hết quota, chatbot có fallback trả lời bằng dữ liệu có sẵn.

---

## Đề tài

```text
Xây dựng hệ thống lập kế hoạch du lịch thông minh tích hợp đặt dịch vụ dựa trên công nghệ AI
```

<div align="center">

**Smart_Travel** - Smart travel planning, booking and tracking platform.

</div>
