package com.example.server.controller.user;

import java.util.HashMap;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.service.CloudinaryService;


@RestController
@RequestMapping
@CrossOrigin(origins = "*")
public class FileController {
    
    private final CloudinaryService cloudinaryService;

    public FileController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }


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
            String contentType = switch (extension) {
                case "pdf" -> "application/pdf";
                case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                case "pptx" -> "application/vnd.openxmlformats-officedocument.presentationml.presentation";
                default -> "application/octet-stream"; // fallback cho các định dạng không rõ
            };

            // Trả về file với header tải xuống
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(500).build();  // Trả về lỗi 500 nếu có sự cố
        }
    }

    /**
     * Upload file lên Cloudinary
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder) {
        try {
            String fileUrl = cloudinaryService.uploadFile(file, folder);
            
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("fileName", file.getOriginalFilename());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Xóa file từ Cloudinary bằng URL
     */
    @DeleteMapping("/delete-file")
    public ResponseEntity<?> deleteFile(@RequestParam("url") String fileUrl) {
        try {
            cloudinaryService.deleteFileByUrl(fileUrl);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "File deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


}
