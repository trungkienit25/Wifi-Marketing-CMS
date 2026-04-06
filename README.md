# 📡 MikroTik WiFi Marketing CMS (Multi-Tenant)

Hệ thống quản trị và phân phối chiến dịch quảng cáo tập trung cho thiết bị MikroTik hEX, tích hợp giải pháp Captive Portal (Success Page) siêu nhẹ bằng Preact SPA.

---

## 🚀 TỔNG QUAN DỰ ÁN

Giải pháp này cho phép doanh nghiệp quản lý hàng quán WiFi Marketing tập trung, hỗ trợ:
- **Multi-Tenant Architecture**: Mỗi quán WiFi là một thương hiệu (Lá Lốt, Ban Công, Everbloom...) với cấu hình riêng biệt.
- **Micro-SPA Optimization**: Trang `alogin.html` được nén chỉ còn <3.5MB, phù hợp với dung lượng RAM hạn chế của MikroTik.
- **Smart Asset Pipeline**: Tự động nén banner qua Cloudinary/WebP để tối ưu tốc độ tải trang cho người dùng.

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG

### 1. Backend & CMS (Next.js 14+)
- **Framework**: Next.js App Router (Full-stack API & UI).
- **ORM**: Prisma với cơ chế Atomic Transaction cho MongoDB.
- **Security**: Server-side Encryption (AES-256) cho tất cả API Key của Router.
- **Storage**: Cloudinary & Cloudflare R2 để phân phối hình ảnh.

### 2. Edge SPA (Preact + Vite)
- **Framework**: Preact (Dung lượng siêu nhẹ).
- **Bundler**: Vite với Plugin SingleFile (Đóng gói toàn bộ CSS/JS vào 01 file duy nhất).
- **Logic**: CNA Anti-Auto-Close (Chặn popup WiFi tự đóng để xem quảng cáo lâu hơn).

---

## 📂 CẤU TRÚC THƯ MỤC
```text
/
├── cms/cms-admin       # Dashboard quản trị & API trung tâm (Next.js)
├── mikrotik-spa        # Mã nguồn giao diện Success Page (Preact)
├── README.md           # Tài liệu hướng dẫn này
└── ProjectStartGuide.md # Hướng dẫn cài đặt chi tiết
```

---

## 🏁 KHỞI ĐỘNG NHANH

### 1. Yêu cầu tiên quyết
- Cài đặt **Node.js v20+** và **MongoDB**.
- MongoDB phải chạy ở chế độ **Replica Set**: `mongod --replSet rs0`.

### 2. Cấu hình Biến môi trường (.env)
Copy tệp `.env.example` thành `.env` trong `cms/cms-admin` và điền đủ:
- `DATABASE_URL`: Đường dẫn MongoDB (có replicaSet).
- `MASTER_SECRET_KEY`: Khóa 32 ký tự để mã hóa dữ liệu.
- `CLOUDINARY_API_KEY`: Để nén ảnh banner.

### 3. Cài đặt & Chạy
**Khởi động CMS:**
```bash
cd cms/cms-admin
npm install
npx prisma db push
npm run dev
```

**Khởi động SPA (Success Page View):**
```bash
cd mikrotik-spa
npm install
npm run dev
```

---

## 📤 QUY TRÌNH TRIỂN KHAI (DEPLOYMENT)

1. **Trên CMS**: Admin thực hiện soạn thảo banner -> Nhấn **Publish**.
2. **Trên SPA**: Thực hiện lệnh đóng gói cho quán cụ thể:
   ```bash
   npx cross-env VITE_BRAND=lalot npm run build
   ```
3. **Trên MikroTik**: 
   - Kéo tệp `dist/lalot/alogin.html` nạp vào thư mục `flash/hotspot` của Router.
   - Khi khách kết nối WiFi thành công, MikroTik sẽ tự động hiện trang quảng cáo đã tích hợp API CMS.

---

## 🖇️ ĐÓNG GÓP & HỖ TRỢ
- Dự án được tối ưu hóa cho hiệu suất Edge Computing. 🗝️
- Mọi thắc mắc kỹ thuật vui lòng kiểm tra tệp `ProjectStartGuide.md`. 🧩🎯 

Chúc Bạn có những chiến dịch Marketing rực rỡ! 🎯🚀
