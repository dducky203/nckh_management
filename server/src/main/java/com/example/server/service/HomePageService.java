package com.example.server.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.domain.HomePageVersion;
import com.example.server.domain.User;
import com.example.server.exception.ErrorException;
import com.example.server.repository.HomePageVersionRepository;
import com.example.server.utils.SecurityUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class HomePageService {

    private static final String DRAFT = "DRAFT";
    private static final String PUBLISHED = "PUBLISHED";

    private final HomePageVersionRepository repository;
    private final ObjectMapper objectMapper;
    private final CloudinaryService cloudinaryService;

    /**
     * Lấy cấu hình trang chủ đã xuất bản mới nhất (Public API)
     */
    public JsonNode getPublished() {
        return repository.findFirstByStatusOrderByCreatedAtDesc(PUBLISHED)
                .map(this::parse).orElse(null);
    }

    /**
     * Lấy bản nháp mới nhất (Admin API)
     */
    public JsonNode getDraft() {
        requireManageAccess();
        return repository.findFirstByStatusOrderByCreatedAtDesc(DRAFT)
                .or(() -> repository.findFirstByStatusOrderByCreatedAtDesc(PUBLISHED))
                .map(this::parse).orElse(objectMapper.createObjectNode().putArray("sections"));
    }

    /**
     * Lưu bản nháp (Admin API)
     */
    public Map<String, Object> saveDraft(JsonNode configuration) {
        requireManageAccess();
        validate(configuration);

        HomePageVersion version = repository.findFirstByStatusOrderByCreatedAtDesc(DRAFT)
                .orElseGet(HomePageVersion::new);
        version.setStatus(DRAFT);
        version.setConfiguration(configuration.toString());
        version.setUpdatedBy(SecurityUtils.getCurrentUserId());

        repository.save(version);
        log.info("User {} đã lưu bản nháp Home Page", SecurityUtils.getCurrentUserId());
        return Map.of("message", "Đã lưu bản nháp Home Page thành công", "id", version.getId());
    }

    /**
     * Xuất bản trang chủ chính thức (Admin API)
     */
    public Map<String, Object> publish(JsonNode configuration) {
        requireManageAccess();
        validate(configuration);

        HomePageVersion version = new HomePageVersion();
        version.setStatus(PUBLISHED);
        version.setConfiguration(configuration.toString());
        version.setUpdatedBy(SecurityUtils.getCurrentUserId());

        repository.save(version);
        saveDraft(configuration); // Đồng bộ bản nháp với bản vừa xuất bản

        log.info("User {} đã xuất bản Home Page mới (ID: {})", SecurityUtils.getCurrentUserId(), version.getId());
        return Map.of("message", "Đã xuất bản Home Page thành công", "id", version.getId());
    }

    /**
     * Khôi phục bản nháp về phiên bản đã xuất bản gần nhất (Admin API)
     */
    public JsonNode restore() {
        requireManageAccess();
        HomePageVersion published = repository.findFirstByStatusOrderByCreatedAtDesc(PUBLISHED)
                .orElseThrow(() -> new ErrorException("Chưa có phiên bản đã xuất bản nào để khôi phục", HttpStatus.NOT_FOUND));

        JsonNode config = parse(published);
        saveDraft(config);
        return config;
    }

    /**
     * Tải ảnh minh họa cho trang chủ lên Cloudinary
     */
    public String uploadImage(MultipartFile file) {
        requireManageAccess();
        if (file == null || file.isEmpty()) {
            throw new ErrorException("File ảnh tải lên không được để trống", HttpStatus.BAD_REQUEST);
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ErrorException("Chỉ chấp nhận file định dạng hình ảnh (JPEG, PNG, WEBP...)", HttpStatus.BAD_REQUEST);
        }

        try {
            return cloudinaryService.uploadFile(file, "homepage");
        } catch (IOException e) {
            log.error("Lỗi khi tải ảnh lên Cloudinary", e);
            throw new ErrorException("Lỗi khi tải ảnh lên hệ thống: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Phân quyền kiểm tra người dùng có quyền quản lý trang chủ (Admin / Assistant)
     */
    private void requireManageAccess() {
        User user = SecurityUtils.getCurrentUser();
        if (user == null) {
            throw new ErrorException("Vui lòng đăng nhập để thực hiện chức năng này", HttpStatus.UNAUTHORIZED);
        }
        if (!SecurityUtils.hasNckhStaffAccess(user)) {
            throw new ErrorException("Chỉ quản trị viên hoặc trợ lý NCKH mới được quyền tùy chỉnh Trang chủ", HttpStatus.FORBIDDEN);
        }
    }

    /**
     * Kiểm tra tính hợp lệ của cấu hình JSON
     */
    private void validate(JsonNode configuration) {
        if (configuration == null || !configuration.has("sections") || !configuration.get("sections").isArray()) {
            throw new ErrorException("Cấu hình trang chủ phải chứa danh sách các khu vực (sections)", HttpStatus.BAD_REQUEST);
        }
        if (configuration.get("sections").size() > 50) {
            throw new ErrorException("Số lượng khu vực trên trang chủ không được vượt quá 50", HttpStatus.BAD_REQUEST);
        }
    }

    private JsonNode parse(HomePageVersion version) {
        try {
            return objectMapper.readTree(version.getConfiguration());
        } catch (Exception exception) {
            log.error("Lỗi parse JSON configuration của HomePageVersion ID {}", version.getId(), exception);
            throw new ErrorException("Cấu hình Home Page lưu trữ trong CSDL không hợp lệ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

