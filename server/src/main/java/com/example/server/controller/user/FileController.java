package com.example.server.controller.user;

import com.example.server.service.CloudinaryService;
import com.example.server.domain.User;
import com.example.server.repository.UserRepository;
import com.example.server.exception.ErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping
@CrossOrigin(origins = "*")
public class FileController {
    
    @Autowired
    private CloudinaryService cloudinaryService;
    
    @Autowired
    private UserRepository userRepository;

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

    /**
     * Upload file lên Cloudinary
     */
    @PostMapping("/api/upload")
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
    @DeleteMapping("/api/delete-file")
    public ResponseEntity<?> deleteFile(@RequestParam("url") String fileUrl) {
        try {
            // Extract publicId from Cloudinary URL
            // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{publicId}.{extension}
            String publicId = cloudinaryService.extractPublicIdFromUrl(fileUrl);
            cloudinaryService.deleteFile(publicId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "File deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Upload avatar - xóa ảnh cũ nếu có
     */
    @PostMapping("/api/users/upload-avatar")
    public ResponseEntity<?> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @RequestParam("username") String username) {
        try {
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new ErrorException("Người dùng không tồn tại!", HttpStatus.NOT_FOUND);
            }

            // Xóa ảnh cũ nếu có
            if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
                try {
                    String oldPublicId = cloudinaryService.extractPublicIdFromUrl(user.getAvatar());
                    if (oldPublicId != null) {
                        cloudinaryService.deleteFile(oldPublicId);
                    }
                } catch (Exception e) {
                    System.err.println("Không thể xóa ảnh cũ: " + e.getMessage());
                }
            }

            // Upload ảnh mới
            String avatarUrl = cloudinaryService.uploadFile(file, "avatars");
            user.setAvatar(avatarUrl);
            userRepository.save(user);

            Map<String, String> response = new HashMap<>();
            response.put("url", avatarUrl);
            response.put("message", "Upload avatar thành công");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

}
