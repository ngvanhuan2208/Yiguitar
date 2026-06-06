# 🔍 BÁO CÁO ĐÁNH GIÁ TOÀN DIỆN — Yi Guitar E-Commerce

> **Ngày đánh giá:** 09/05/2026  
> **Phạm vi:** Toàn bộ source code Client (React/Vite) + Server (Express/MongoDB)  
> **Mục tiêu:** Phân tích Logic chức năng, UX/UI, và Bảo mật — Không thay đổi code

---

## 📋 Mục lục

1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Bảo mật (CRITICAL)](#2-bảo-mật-critical)
3. [Logic chức năng](#3-logic-chức-năng)
4. [UX/UI](#4-uxui)
5. [Hiệu năng & Khả năng mở rộng](#5-hiệu-năng--khả-năng-mở-rộng)
6. [Chất lượng code & Kiến trúc](#6-chất-lượng-code--kiến-trúc)
7. [Bảng tổng hợp ưu tiên](#7-bảng-tổng-hợp-ưu-tiên)

---

## 1. Tổng quan kiến trúc

| Thành phần | Công nghệ | Ghi chú |
|---|---|---|
| Frontend | React 18 + Vite + TailwindCSS | SPA, alias `@/` |
| Backend | Express 5 + Mongoose 9 | Monolith, 1 file `index.js` (~1446 dòng) |
| Database | MongoDB | 13 models (User, Product, Order, Course, Tab, ...) |
| Auth | JWT + bcrypt + Google OAuth | Token 30 ngày, lưu localStorage |
| Realtime | Socket.IO | Chat + Dashboard notifications |
| Email | Nodemailer (Gmail) | Order confirmation |
| Upload | Multer (disk storage) | Images + Course videos |

### Điểm mạnh hiện tại
- ✅ Đã có Helmet, CORS, Rate Limiting, NoSQL Injection & XSS protection
- ✅ Hệ thống chat real-time hoàn chỉnh (Socket.IO + DB persistence)
- ✅ Cart sync giữa localStorage và server DB
- ✅ Email notification cho admin & customer khi có order
- ✅ Revenue report với chart data, KPIs, growth comparison
- ✅ UI design nhất quán, premium look với glassmorphism và micro-animations

---

## 2. Bảo mật (CRITICAL)

### 🔴 Mức Nghiêm Trọng Cao

| # | Vấn đề | File | Chi tiết |
|---|---|---|---|
| S1 | **JWT Secret cứng trong `.env`** | [.env](file:///c:/Users/Admin/guitar-shop-ecommerce/server/.env) | `JWT_SECRET=yi_guitar_secret_key_2026` — Chuỗi quá ngắn, dễ đoán, và đang commit vào source. Cần dùng chuỗi ngẫu nhiên ≥64 ký tự |
| S2 | **Google OAuth giả (Mock)** | [AuthModal.jsx](file:///c:/Users/Admin/guitar-shop-ecommerce/client/src/features/auth/AuthModal.jsx#L12-L34) | Google login tạo mock user thay vì verify token thật qua Google API → Ai cũng có thể tạo tài khoản giả với bất kỳ email nào |
| S3 | **Google Client ID placeholder** | [main.jsx](file:///c:/Users/Admin/guitar-shop-ecommerce/client/src/main.jsx#L10) | `"YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"` — Không hoạt động thực tế |
| S4 | **Không validate password strength** | [index.js](file:///c:/Users/Admin/guitar-shop-ecommerce/server/index.js#L194-L216) | Register endpoint chấp nhận password bất kỳ (kể cả 1 ký tự). Không có yêu cầu độ dài tối thiểu |
| S5 | **Admin routes không bảo vệ phía client** | [App.jsx](file:///c:/Users/Admin/guitar-shop-ecommerce/client/src/App.jsx#L62-L72) | Tất cả `/admin/*` routes render trực tiếp không có `ProtectedRoute` wrapper → User thường có thể truy cập UI admin (API vẫn chặn, nhưng lộ giao diện) |
| S6 | **Forgot Password giả lập** | [AuthModal.jsx](file:///c:/Users/Admin/guitar-shop-ecommerce/client/src/features/auth/AuthModal.jsx#L47-L53) | Chỉ hiện `alert()` demo, không gửi email thật → User không thể khôi phục mật khẩu |
| S7 | **Socket.IO không xác thực** | [index.js](file:///c:/Users/Admin/guitar-shop-ecommerce/server/index.js#L1344-L1390) | Socket connections không verify JWT → Bất kỳ ai cũng có thể connect, join room, gửi tin nhắn giả mạo người khác |
| S8 | **Đăng ký khóa học không cần auth** | [index.js](file:///c:/Users/Admin/guitar-shop-ecommerce/server/index.js#L1393-L1401) | `POST /api/registrations` là public → Spam bot có thể tạo hàng loạt đăng ký giả |

### 🟡 Mức Trung Bình

| # | Vấn đề | File | Chi tiết |
|---|---|---|---|
| S9 | **Hardcoded URLs khắp nơi** | Navbar, ChatWidget, ProfilePage, AdminNotification | `http://localhost:5000` xuất hiện ~10+ chỗ thay vì dùng env variable → Sẽ lỗi khi deploy |
| S10 | **File upload không scan malware** | [index.js](file:///c:/Users/Admin/guitar-shop-ecommerce/server/index.js#L101-L111) | Chỉ check extension/mimetype, không kiểm tra nội dung thực sự. File `.jpg` chứa script vẫn được chấp nhận |
| S11 | **Course upload 105MB không filter type** | [index.js](file:///c:/Users/Admin/guitar-shop-ecommerce/server/index.js#L128-L135) | `courseUpload` không có `fileFilter` → Chấp nhận mọi loại file (exe, bat, ...) |
| S12 | **Token expiry quá dài (30 ngày)** | [index.js](file:///c:/Users/Admin/guitar-shop-ecommerce/server/index.js#L201) | Nếu token bị lộ, attacker có 30 ngày truy cập. Nên dùng access token ngắn + refresh token |
| S13 | **Không có CSRF protection** | Toàn hệ thống | API dùng cookie-less JWT nên rủi ro thấp hơn, nhưng WebSocket thiếu origin validation |
| S14 | **`totalAmount` do client gửi** | [index.js](file:///c:/Users/Admin/guitar-shop-ecommerce/server/index.js#L702-L750) | Server nhận `totalAmount` từ client mà không tính lại → Client có thể sửa giá thành 0₫ |

---

## 3. Logic chức năng

### 🔴 Bugs & Lỗi Logic Nghiêm Trọng

| # | Vấn đề | File | Chi tiết |
|---|---|---|---|
| L1 | **Race condition khi đặt hàng** | [index.js](file:///c:/Users/Admin/guitar-shop-ecommerce/server/index.js#L706-L727) | Validate stock → Decrement stock không atomic. 2 users cùng lúc mua sản phẩm cuối cùng đều sẽ thành công → Stock âm |
| L2 | **`/api/products/featured` bị chặn** | [index.js](file:///c:/Users/Admin/guitar-shop-ecommerce/server/index.js#L944-L951) | Route này khai báo **sau** `/api/products/:id` (L493) → Express match `:id = "featured"` trước → Trả 500 error (cast ObjectId thất bại) |
| L3 | **Không restore stock khi hủy đơn** | [index.js](file:///c:/Users/Admin/guitar-shop-ecommerce/server/index.js#L770-L786) | `PUT /api/orders/:id` chỉ update `status` mà không hoàn lại stock khi chuyển sang "Đã hủy" |
| L4 | **Review có thể spam** | [index.js](file:///c:/Users/Admin/guitar-shop-ecommerce/server/index.js#L1036-L1059) | Không check user đã review chưa, không check user đã mua sản phẩm chưa → 1 user có thể gửi vô hạn reviews |
| L5 | **Profile update không xóa được field** | [index.js](file:///c:/Users/Admin/guitar-shop-ecommerce/server/index.js#L298-L318) | Dùng `if (phone) user.phone = phone` → Không thể set phone về rỗng. Cần `if (phone !== undefined)` |
| L6 | **Tab download count dễ bị inflate** | [index.js](file:///c:/Users/Admin/guitar-shop-ecommerce/server/index.js#L1200-L1211) | `POST /api/tabs/:id/download` là public, không rate limit riêng → Bot có thể spam tăng download count |
| L7 | **Registration không link với Course ID** | [Registration.js](file:///c:/Users/Admin/guitar-shop-ecommerce/server/models/Registration.js) | Chỉ lưu `courseName` (string) thay vì `courseId` (ObjectId ref) → Không track được course nào, dễ sai khi đổi tên khóa học |
| L8 | **Duplicate admin routes** | [index.js](file:///c:/Users/Admin/guitar-shop-ecommerce/server/index.js#L1403-L1420) | `/api/registrations` và `/api/admin/registrations` là 2 route giống hệt nhau, gây confusion |
| L9 | **Admin check thiếu nhất quán** | index.js nhiều nơi | Một số route dùng middleware `isAdmin`, một số check inline `req.user.role !== 'admin'` → Dễ bỏ sót khi refactor |

### 🟡 Logic Cần Cải Thiện

| # | Vấn đề | Chi tiết |
|---|---|---|
| L10 | **Cart sync chạy mỗi khi items thay đổi** | Mỗi lần +1/-1 quantity đều gọi API `/cart/sync` → Cần debounce |
| L11 | **Không có search cho Products** | GuitarPage và AccessoriesPage không có search functionality, chỉ filter theo category/type |
| L12 | **Articles pagination bug** | `Math.ceil(total / limit)` tại L356, L623 — `limit` là string từ query, division cho string cho kết quả sai |
| L13 | **Enrolled courses check thiếu chính xác** | CourseDetailPage check `user.enrolledCourses.includes(id)` nhưng `enrolledCourses` chứa ObjectId, `id` là string → So sánh luôn false |
| L14 | **Order status flow không đầy đủ** | Chỉ có 3 status: "Chờ tư vấn" → "Đã liên hệ" → "Đã hủy". Thiếu "Đã thanh toán", "Đang giao", "Hoàn thành" |

---

## 4. UX/UI

### 🔴 Vấn đề UX Nghiêm Trọng

| # | Vấn đề | File | Chi tiết |
|---|---|---|---|
| U1 | **Không có Mobile Navigation (Hamburger Menu)** | [Navbar.jsx](file:///c:/Users/Admin/guitar-shop-ecommerce/client/src/components/layout/Navbar.jsx#L39) | Menu chính dùng `hidden lg:flex` → **Trên mobile, tất cả navigation links biến mất hoàn toàn**. User mobile chỉ thấy logo + cart + login |
| U2 | **Profile dropdown không đóng khi click ra ngoài** | [Navbar.jsx](file:///c:/Users/Admin/guitar-shop-ecommerce/client/src/components/layout/Navbar.jsx#L141-L167) | Chỉ toggle khi click avatar, không có `clickOutside` handler → Menu treo giữa màn hình |
| U3 | **Không có trang 404** | [App.jsx](file:///c:/Users/Admin/guitar-shop-ecommerce/client/src/App.jsx#L51-L76) | Không có catch-all route `*` → URL sai hiện trang trắng |
| U4 | **Cart page redirect không UX** | [CartPage.jsx](file:///c:/Users/Admin/guitar-shop-ecommerce/client/src/pages/Cart/CartPage.jsx#L27-L32) | User chưa login vào `/gio-hang` bị redirect về `/` rồi mở auth modal → Mất context, không quay lại cart sau login |
| U5 | **Error handling dùng `alert()`** | CartPage, ContactPage | Dùng `alert()` thay vì toast/inline error → Trải nghiệm kém chuyên nghiệp |

### 🟡 Cải thiện UX

| # | Vấn đề | Chi tiết |
|---|---|---|
| U6 | **Không có breadcrumb nhất quán** | Chỉ ProductDetailPage có breadcrumb, các trang khác không có |
| U7 | **Loading states thiếu skeleton** | Tất cả page đều dùng spinner giống nhau, không có skeleton placeholder → Layout shift |
| U8 | **Không có empty state cho admin pages** | Khi chưa có data, admin pages hiển thị bảng trống không có hướng dẫn |
| U9 | **Tab Guitar không hiện giá** | TabListPage không hiển thị giá trên card → User phải click vào mới biết |
| U10 | **Không có "Quay lại đầu trang" button** | Có `ScrollToTop` component tự động scroll khi route change, nhưng không có floating button cho user |
| U11 | **Footer thiếu responsive** | Footer.jsx cần kiểm tra trên mobile layout |
| U12 | **Không có confirm dialog khi xóa** | Admin pages xóa product/article/order mà không có confirmation modal |
| U13 | **Không có image lazy loading** | Tất cả images load eagerly → Trang product listing chậm khi có nhiều sản phẩm |

### 🟢 Accessibility (a11y)

| # | Vấn đề | Chi tiết |
|---|---|---|
| U14 | **Thiếu aria-labels** | Buttons chỉ có SVG icon, không có `aria-label` → Screen reader không đọc được |
| U15 | **Color contrast thấp** | Nhiều text dùng `text-slate-300/400` trên nền trắng → Không đạt WCAG AA |
| U16 | **Form inputs thiếu error messages** | Register/Login form chỉ hiện error chung, không highlight field cụ thể |
| U17 | **Keyboard navigation** | Modal không trap focus, dropdown không hỗ trợ arrow keys |

---

## 5. Hiệu năng & Khả năng mở rộng

| # | Mức | Vấn đề | Chi tiết |
|---|---|---|---|
| P1 | 🔴 | **Server monolith 1 file** | `index.js` 1446 dòng chứa TẤT CẢ routes, middleware, socket logic → Rất khó maintain/debug |
| P2 | 🔴 | **Không có index cho MongoDB queries** | Order aggregations (revenue stats) quét toàn bộ collection → Chậm khi data lớn |
| P3 | 🟡 | **Socket.IO tạo mới mỗi component** | `ChatWidget` và `AdminNotification` mỗi cái tạo socket riêng → 2+ connections per admin user |
| P4 | 🟡 | **API calls trùng lặp** | Navbar fetch `/categories` mỗi lần render. Cần cache/context |
| P5 | 🟡 | **Multer disk storage trên server** | File upload lưu local disk → Không scale khi có nhiều server instances. Cần S3/Cloudinary |
| P6 | 🟡 | **Không có API response caching** | Mỗi lần vào trang products/courses đều fetch lại từ DB |
| P7 | 🟢 | **Bundle size** | Cần kiểm tra bundle splitting. Admin pages nên lazy load vì chỉ admin cần |

---

## 6. Chất lượng code & Kiến trúc

### Cấu trúc cần cải thiện

| # | Vấn đề | Chi tiết |
|---|---|---|
| C1 | **Server `index.js` cần tách routes** | 1446 dòng → Tách thành `/routes/auth.js`, `/routes/products.js`, `/routes/orders.js`, v.v. |
| C2 | **Script thừa trong server/** | `check-db.js`, `debug-filter.js`, `test.js`, `test_year.js`, `fix-brand-data.js` → Dọn dẹp hoặc chuyển vào `/scripts` |
| C3 | **Thiếu error boundary** | Không có React Error Boundary → Lỗi JS crash toàn app |
| C4 | **Thiếu unit tests** | `package.json` test script chỉ có `echo "Error: no test specified"` |
| C5 | **Inconsistent admin authorization** | Có 2 pattern: middleware `isAdmin` vs inline check `req.user.role !== 'admin'` → Chọn 1 pattern |
| C6 | **`hooks/` directory rỗng** | Có thể tạo `useDebounce`, `useClickOutside`, `useSocket` custom hooks |
| C7 | **`components/common/` rỗng** | Thiếu shared components: Button, Input, Modal, Spinner, Badge |
| C8 | **Temp build folders** | `client/temp_build` và `temp_build_v2` nên xóa hoặc gitignore |

---

## 7. Bảng tổng hợp ưu tiên

### 🔴 CRITICAL — Cần fix ngay trước khi deploy

| STT | Hạng mục | ID | Tóm tắt |
|---|---|---|---|
| 1 | Bảo mật | S1 | Thay JWT Secret bằng chuỗi ngẫu nhiên mạnh, không commit `.env` |
| 2 | Bảo mật | S14 | Server phải tự tính `totalAmount` thay vì tin client |
| 3 | Bảo mật | S7 | Thêm JWT auth cho Socket.IO connections |
| 4 | Bảo mật | S5 | Thêm ProtectedRoute cho admin pages |
| 5 | Logic | L1 | Dùng MongoDB transactions cho order creation (atomic stock) |
| 6 | Logic | L2 | Di chuyển route `/api/products/featured` lên TRƯỚC `/api/products/:id` |
| 7 | UX | U1 | Thêm hamburger menu cho mobile |
| 8 | Bảo mật | S11 | Thêm file filter cho course upload |

### 🟡 HIGH — Nên fix sớm

| STT | Hạng mục | ID | Tóm tắt |
|---|---|---|---|
| 9 | Logic | L3 | Hoàn stock khi hủy đơn |
| 10 | Logic | L4 | Chống spam review (1 user 1 review/product) |
| 11 | Bảo mật | S2, S3 | Implement Google OAuth thật hoặc gỡ bỏ |
| 12 | Bảo mật | S4 | Validate password (min 6 chars, phải có số) |
| 13 | UX | U2 | Click outside để đóng dropdown |
| 14 | UX | U3 | Thêm trang 404 |
| 15 | UX | U5 | Thay `alert()` bằng toast (đã có react-hot-toast) |
| 16 | Logic | L12 | Fix pagination parseInt cho `limit` |
| 17 | Hiệu năng | P1 | Tách server routes thành modules |
| 18 | Bảo mật | S9 | Thay hardcoded localhost bằng env variables |

### 🟢 MEDIUM — Cải thiện chất lượng

| STT | Hạng mục | ID | Tóm tắt |
|---|---|---|---|
| 19 | Logic | L10 | Debounce cart sync API |
| 20 | Logic | L7 | Link Registration với Course ID |
| 21 | Logic | L14 | Bổ sung order status flow |
| 22 | UX | U6-U8 | Breadcrumb, skeleton loading, empty states |
| 23 | UX | U14-U17 | Accessibility improvements |
| 24 | Hiệu năng | P3 | Singleton socket connection |
| 25 | Hiệu năng | P7 | Lazy load admin pages |
| 26 | Code | C1-C8 | Refactor & cleanup |

---

> [!IMPORTANT]
> **Tổng kết:** Project có nền tảng feature tốt với UI thiết kế đẹp. Tuy nhiên, có **8 vấn đề bảo mật critical** và **9 bugs logic** cần xử lý trước khi đưa lên production. Ưu tiên số 1 là bảo mật (JWT Secret, server-side price calculation, Socket.IO auth) và mobile navigation (hiện tại mobile users không thể navigate).
