package com.example.server.controller.user;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;


@RestController
public class FileController {
    // Cấu hình đường dẫn thư mục lưu trữ file
    @Value("${upload.dir}")
    private String uploadDir;

    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            // Đọc file từ thư mục resources/static/file/
            Resource resource = new ClassPathResource("static/file/" + fileName);

            // Kiểm tra xem file có tồn tại không
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            // Lấy phần mở rộng của file
            String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

            // Xác định MIME type dựa vào phần mở rộng
            String contentType;
            switch (extension) {
                case "pdf":
                    contentType = "application/pdf";
                    break;
                case "docx":
                    contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    break;
                case "pptx":
                    contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
                    break;
                default:
                    contentType = "application/octet-stream"; // fallback cho các định dạng không rõ
            }

            // Trả về file với header tải xuống
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(500).build();  // Trả về lỗi 500 nếu có sự cố
        }
    }



    public  String handleFileUpload(@RequestParam("file") MultipartFile file) {
        try {
            // Lưu file vào thư mục
            Path path = Path.of(uploadDir + file.getOriginalFilename());
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            return "null";
        } catch (IOException e) {
            return "Có lỗi xảy ra khi tải lên file.";
        }
    }

}
