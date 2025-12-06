# Hướng dẫn Deploy Backend Spring Boot với Docker

## 1. Chuẩn bị

### Yêu cầu:

- Docker Desktop đã cài đặt và đang chạy
- Port 8081 không bị sử dụng
- Database MySQL đã setup (hoặc dùng Docker)

## 2. Build Docker Image

### Cách 1: Build trực tiếp

```powershell
cd D:\KLTN\server
docker build -t nckh-backend:latest .
```

### Cách 2: Build với tag cụ thể

```powershell
docker build -t nckh-backend:1.0.0 .
```

## 3. Chạy Container

### Cách 1: Chạy đơn giản (kết nối DB local)

```powershell
docker run -d `
  --name nckh-backend `
  -p 8081:8081 `
  -v ${PWD}/uploads:/app/uploads `
  nckh-backend:latest
```

### Cách 2: Chạy với environment variables

```powershell
docker run -d `
  --name nckh-backend `
  -p 8081:8081 `
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/nckh_db `
  -e SPRING_DATASOURCE_USERNAME=root `
  -e SPRING_DATASOURCE_PASSWORD=yourpassword `
  -e JWT_SECRET=your-jwt-secret-key-here `
  -v ${PWD}/uploads:/app/uploads `
  nckh-backend:latest
```

### Cách 3: Sử dụng Docker Compose (Recommended)

Tạo file `docker-compose.yml`:

```yaml
version: "3.8"

services:
  mysql:
    image: mysql:8.0
    container_name: nckh-mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: nckh_db
      MYSQL_USER: nckh_user
      MYSQL_PASSWORD: nckh_pass
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - nckh-network

  backend:
    build: .
    container_name: nckh-backend
    ports:
      - "8081:8081"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/nckh_db
      SPRING_DATASOURCE_USERNAME: nckh_user
      SPRING_DATASOURCE_PASSWORD: nckh_pass
      JWT_SECRET: your-jwt-secret-key-change-this
    volumes:
      - ./uploads:/app/uploads
    depends_on:
      - mysql
    networks:
      - nckh-network
    restart: unless-stopped

volumes:
  mysql_data:

networks:
  nckh-network:
    driver: bridge
```

Chạy bằng Docker Compose:

```powershell
cd D:\KLTN\server
docker-compose up -d
```

## 4. Quản lý Container

### Xem logs

```powershell
docker logs nckh-backend
docker logs -f nckh-backend  # Follow logs
```

### Kiểm tra status

```powershell
docker ps
docker ps -a  # Xem tất cả containers
```

### Stop container

```powershell
docker stop nckh-backend
```

### Start container

```powershell
docker start nckh-backend
```

### Restart container

```powershell
docker restart nckh-backend
```

### Xóa container

```powershell
docker stop nckh-backend
docker rm nckh-backend
```

### Xóa image

```powershell
docker rmi nckh-backend:latest
```

## 5. Kiểm tra ứng dụng

### Health check

```powershell
curl http://localhost:8081/actuator/health
```

### Test API

```powershell
curl http://localhost:8081/api/public/news
```

## 6. Deploy lên Server (Production)

### Bước 1: Push image lên Docker Hub

```powershell
# Login Docker Hub
docker login

# Tag image
docker tag nckh-backend:latest yourusername/nckh-backend:latest

# Push image
docker push yourusername/nckh-backend:latest
```

### Bước 2: Trên server, pull và run

```bash
# Login Docker Hub
docker login

# Pull image
docker pull yourusername/nckh-backend:latest

# Run container
docker run -d \
  --name nckh-backend \
  -p 8081:8081 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://your-db-host:3306/nckh_db \
  -e SPRING_DATASOURCE_USERNAME=dbuser \
  -e SPRING_DATASOURCE_PASSWORD=dbpass \
  -e JWT_SECRET=production-secret-key \
  -v /path/to/uploads:/app/uploads \
  --restart unless-stopped \
  yourusername/nckh-backend:latest
```

## 7. Troubleshooting

### Container không start

```powershell
# Xem logs chi tiết
docker logs nckh-backend

# Xem logs trong container
docker exec -it nckh-backend sh
cat /app/application.log
```

### Không kết nối được database

- Kiểm tra MySQL đang chạy: `docker ps | findstr mysql`
- Kiểm tra network: `docker network ls`
- Kiểm tra connection string trong environment variables

### Port 8081 đã được sử dụng

```powershell
# Tìm process đang dùng port
netstat -ano | findstr :8081

# Đổi port khi run
docker run -d -p 8082:8081 nckh-backend:latest
```

## 8. Best Practices

1. **Sử dụng Docker Compose** cho development và testing
2. **Set proper memory limits** khi chạy production
3. **Backup database** thường xuyên
4. **Monitor logs** và set up log rotation
5. **Use secrets management** cho production (không hardcode password)
6. **Enable SSL/TLS** cho production
7. **Set up reverse proxy** (nginx) phía trước

## 9. Production Environment Variables

Nên set các biến môi trường sau cho production:

```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:mysql://db-host:3306/nckh_db
SPRING_DATASOURCE_USERNAME=user
SPRING_DATASOURCE_PASSWORD=password
JWT_SECRET=your-secure-random-secret-key
JWT_EXPIRATION=86400000
UPLOAD_DIR=/app/uploads
ALLOWED_ORIGINS=https://yourdomain.com
```

## 10. Auto-deploy với GitHub Actions (Optional)

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push
        uses: docker/build-push-action@v2
        with:
          context: ./server
          push: true
          tags: yourusername/nckh-backend:latest
```

---

**Lưu ý:** Thay đổi các giá trị như `yourusername`, `password`, `secret-key` thành giá trị thực tế của bạn!
