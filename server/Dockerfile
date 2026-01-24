# Stage 1: Build stage
FROM maven:3.8.8-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml và download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code và build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Healthcheck uses wget; install it in alpine
RUN apk add --no-cache wget

# Copy JAR file từ build stage
COPY --from=build /app/target/*.jar app.jar

# Tạo thư mục uploads
RUN mkdir -p /app/uploads

# Expose port
EXPOSE 8081

# Set environment variables (có thể override khi run)
ENV SPRING_PROFILES_ACTIVE=prod
ENV UPLOAD_DIR=/app/uploads

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8081/actuator/health || exit 1

# Run application
ENTRYPOINT ["java", "-jar", "-Xmx512m", "-Xms256m", "app.jar"]
