package com.example.server.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.DTO.response.SuccessResponseDTO;
import com.example.server.service.HomePageService;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/homepage")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class HomePageController {

    private final HomePageService homePageService;

    @GetMapping("/public")
    public ResponseEntity<SuccessResponseDTO<JsonNode>> published() {
        return ResponseEntity.ok(new SuccessResponseDTO<>(
                homePageService.getPublished(), "Lấy cấu hình trang chủ thành công"));
    }

    @GetMapping("/admin/draft")
    public ResponseEntity<SuccessResponseDTO<JsonNode>> draft() {
        return ResponseEntity.ok(new SuccessResponseDTO<>(
                homePageService.getDraft(), "Lấy cấu hình bản nháp thành công"));
    }

    @PostMapping("/admin/draft")
    public ResponseEntity<SuccessResponseDTO<Map<String, Object>>> saveDraft(@RequestBody JsonNode configuration) {
        return ResponseEntity.ok(new SuccessResponseDTO<>(
                homePageService.saveDraft(configuration), "Lưu bản nháp thành công"));
    }

    @PostMapping("/admin/publish")
    public ResponseEntity<SuccessResponseDTO<Map<String, Object>>> publish(@RequestBody JsonNode configuration) {
        return ResponseEntity.ok(new SuccessResponseDTO<>(
                homePageService.publish(configuration), "Xuất bản thành công"));
    }

    @PostMapping("/admin/restore")
    public ResponseEntity<SuccessResponseDTO<JsonNode>> restore() {
        return ResponseEntity.ok(new SuccessResponseDTO<>(
                homePageService.restore(), "Khôi phục phiên bản trước thành công"));
    }
    
    @PostMapping("/admin/upload-image")
    public ResponseEntity<SuccessResponseDTO<String>> uploadImage(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(new SuccessResponseDTO<>(
                homePageService.uploadImage(file), "Tải ảnh lên thành công"));
    }
}
