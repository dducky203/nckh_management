# HỆ THỐNG QUẢN LÝ SỰ KIỆN NGHIÊN CỨU KHOA HỌC - FRONTEND

![Logo FITA VNUA](./src/assets/logo_fita.png)

## Giới thiệu

Đây là phần frontend của Hệ thống Quản lý Sự kiện Nghiên cứu Khoa học - một ứng dụng web hiện đại được phát triển cho Khoa Công nghệ Thông tin - Học viện Nông nghiệp Việt Nam, nhằm số hóa và tối ưu hóa quy trình quản lý các hoạt động nghiên cứu khoa học, sự kiện học thuật và công tác học thuật trong khoa.

## Tính năng UI/UX

### 1. Giao diện quản lý sự kiện nghiên cứu khoa học

- Hiển thị sự kiện học thuật (hội thảo, hội nghị, seminar) với giao diện trực quan
- Xem chi tiết lịch trình, địa điểm và người tham gia
- Form đăng ký tham gia sự kiện trực tuyến

### 2. Hiển thị công trình nghiên cứu

- Trang hiển thị các bài báo, công trình nghiên cứu
- Bộ lọc và tìm kiếm theo nhiều tiêu chí
- Biểu đồ thống kê hoạt động nghiên cứu

### 3. Trang thông tin nhân sự

- Hiển thị thông tin giảng viên, nghiên cứu viên
- Trang cá nhân với thông tin công trình nghiên cứu
- Giao diện quản lý thông tin người dùng

### 4. Tin tức và thông báo

- Hiển thị tin tức về các hoạt động nghiên cứu khoa học
- Trang chi tiết cho mỗi thông báo và sự kiện
- Giao diện hiển thị tin tức thân thiện với người dùng

## Công nghệ sử dụng

### Frontend

- **React**: Thư viện JavaScript để xây dựng giao diện người dùng
- **Material-UI & Tailwind CSS**: Framework CSS cho thiết kế giao diện hiện đại
- **React Router**: Quản lý định tuyến trong ứng dụng
- **Context API**: Quản lý state toàn cục

### Công cụ và quy trình

- **Git & GitHub**: Quản lý phiên bản
- **Vite**: Công cụ build nhanh cho ứng dụng React
- **Jest & React Testing Library**: Testing framework (dự kiến)

## Hướng dẫn cài đặt

### Yêu cầu hệ thống

- Node.js v16 trở lên
- npm v7 trở lên

### Cài đặt và chạy ứng dụng

1. Clone repository

```bash
git clone https://github.com/your-username/research-event-management-frontend.git
cd research-event-management-frontend
```

2. Cài đặt các dependencies

```bash
npm install
```

3. Chạy ứng dụng ở chế độ development

```bash
npm run dev
```

4. Truy cập ứng dụng tại http://localhost:5173

## Cấu trúc dự án

```
/public          # Assets tĩnh
/src
  /assets        # Hình ảnh, icon
  /components    # React components
    /common      # Các component dùng chung
    /layout      # Layout components (Header, Footer)
  /context       # Context API
  /hooks         # Custom React hooks
  /pages         # Các trang của ứng dụng
  /services      # API services (mock data)
  /utils         # Helper functions và utility
  /constants     # Các hằng số và cấu hình
```

## Giấy phép

© 2023-2025 Khoa Công nghệ Thông tin - Học viện Nông nghiệp Việt Nam. Bản quyền được bảo lưu.

## Liên hệ

- Email: cntt@vnua.edu.vn
- Website: https://fita.vnua.edu.vn
- Địa chỉ: P316, Tầng 3 Nhà Hành chính, Học viện Nông nghiệp Việt Nam, Thị trấn Trâu Quỳ, huyện Gia Lâm, TP. Hà Nội

---
