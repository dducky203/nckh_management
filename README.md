# Hệ thống Quản lý Nghiên cứu Khoa học (NCKH Management System)

![Project Logo](client/public/logo.png)

## 📋 Mô tả dự án

Hệ thống Quản lý Nghiên cứu Khoa học là một ứng dụng web toàn diện được phát triển để hỗ trợ quản lý các hoạt động nghiên cứu khoa học trong các trường đại học và viện nghiên cứu. Hệ thống cung cấp các tính năng quản lý dự án nghiên cứu, theo dõi tiến độ, quản lý tài liệu và báo cáo.

## 🏗️ Kiến trúc hệ thống

Dự án được xây dựng theo mô hình Client-Server với:

- **Frontend (Client)**: React.js với Vite, TypeScript, TailwindCSS và Material-UI
- **Backend (Server)**: Spring Boot với Java 17, Spring Security, JWT
- **Database**: MariaDB/MySQL
- **File Storage**: Local storage với tích hợp Google Sheets API

## 🛠️ Công nghệ sử dụng

### Frontend

- **React 19.1.1** - Thư viện JavaScript để xây dựng giao diện người dùng
- **Vite** - Build tool nhanh cho development và production
- **TypeScript** - Superset của JavaScript với kiểm tra kiểu tĩnh
- **TailwindCSS** - Framework CSS utility-first
- **Material-UI (MUI)** - Component library
- **React Router Dom** - Routing cho Single Page Application
- **Emotion** - CSS-in-JS library

### Backend

- **Spring Boot 3.4.3** - Framework Java để phát triển ứng dụng web
- **Spring Security** - Bảo mật và xác thực
- **Spring Data JPA** - Object-Relational Mapping
- **Thymeleaf** - Template engine
- **JWT (JSON Web Token)** - Xác thực stateless
- **Apache POI** - Xử lý file Excel
- **Apache PDFBox** - Xử lý file PDF
- **Google Sheets API** - Tích hợp với Google Sheets
- **Spring Mail** - Gửi email
- **Lombok** - Giảm boilerplate code

### Database & Tools

- **MariaDB/MySQL** - Hệ quản trị cơ sở dữ liệu
- **Maven** - Quản lý dependencies và build
- **Docker Compose** - Container orchestration

## 📁 Cấu trúc thư mục

```
KLTN/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── context/           # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API services
│   │   ├── utils/             # Utility functions
│   │   └── constants/         # Constants and configurations
│   ├── public/                # Static assets
│   └── package.json
├── server/                     # Backend Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/          # Java source code
│   │   │   └── resources/     # Configuration files
│   │   └── test/              # Test files
│   ├── pom.xml                # Maven configuration
│   └── docker-compose.yml     # Docker configuration
└── README.md
```

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống

- **Node.js** >= 18.0.0
- **Java** >= 17
- **Maven** >= 3.6.0
- **MariaDB/MySQL** >= 10.0

### 1. Clone repository

```bash
git clone https://github.com/dducky203/nckh_management.git
cd nckh_management
```

### 2. Cài đặt Database

#### Sử dụng Docker (Khuyến nghị)

```bash
cd server
docker-compose up -d
```

#### Cài đặt thủ công

1. Cài đặt MariaDB hoặc MySQL
2. Tạo database:

```sql
CREATE DATABASE nckh CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Cấu hình Backend

1. Điều hướng đến thư mục server:

```bash
cd server
```

2. Cấu hình database trong `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mariadb://localhost:3307/nckh?allowPublicKeyRetrieval=true&useSSL=false
    username: root
    password: your_password
```

3. Cấu hình email (tùy chọn):

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your_email@gmail.com
    password: your_app_password
```

4. Thêm file `credentials.json` cho Google Sheets API (nếu sử dụng):

   - Đặt file trong `src/main/resources/`
   - Tham khao: [Google Sheets API Setup](https://developers.google.com/sheets/api/quickstart/java)

5. Cài đặt dependencies và chạy:

```bash
# Windows
mvnw clean install
mvnw spring-boot:run

# Linux/Mac
./mvnw clean install
./mvnw spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

### 4. Cấu hình Frontend

1. Điều hướng đến thư mục client:

```bash
cd client
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file `.env` (nếu cần):

```env
VITE_API_BASE_URL=http://localhost:8080
```

4. Chạy development server:

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## 🏃‍♂️ Các lệnh hữu ích

### Frontend

```bash
# Development
npm run dev

# Build cho production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint
```

### Backend

```bash
# Compile và package
mvnw clean compile
mvnw clean package

# Chạy tests
mvnw test

# Chạy với profile cụ thể
mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

## 🔧 Cấu hình môi trường

### Development

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8081`
- Database: `localhost:3307`

### Production

Cần cấu hình thêm:

- Environment variables
- SSL certificates
- Database connection pooling
- File upload limits
- CORS settings

## 📚 API Documentation

Sau khi chạy backend, có thể truy cập:

- REST API: `http://localhost:8081/api`
- Thymeleaf views: `http://localhost:8080`

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Dự án này được phát triển cho mục đích học tập và nghiên cứu.

## 👥 Tác giả

- **Dương Hihi** - Developer chính
- Repository: [dducky203/nckh_management](https://github.com/dducky203/nckh_management)

## 🆘 Hỗ trợ

Nếu gặp vấn đề trong quá trình cài đặt hoặc sử dụng, hãy:

1. Kiểm tra [Issues](https://github.com/dducky203/nckh_management/issues)
2. Tạo issue mới nếu chưa có
3. Liên hệ qua email: support@example.com

---

**Happy Coding! 🚀**
