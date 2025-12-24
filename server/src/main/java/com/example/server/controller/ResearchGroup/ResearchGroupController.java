package com.example.server.controller.ResearchGroup;

import com.example.server.DTO.request.CreateResearchGroupRequest;
import com.example.server.DTO.request.UpdateResearchGroupRequest;
import com.example.server.DTO.response.ResearchGroupDTO;
import com.example.server.DTO.SuccessResponseDTO;
import com.example.server.service.ResearchGroupService;
import com.example.server.utils.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/research-groups")
@RequiredArgsConstructor
public class ResearchGroupController {

    private final ResearchGroupService researchGroupService;

    /**
     * User tạo nhóm mới (chờ duyệt)
     */
    @PostMapping("/create")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> createGroup(
            @Valid @RequestBody CreateResearchGroupRequest request) {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        ResearchGroupDTO group = researchGroupService.createGroup(userId, request);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Tạo nhóm thành công! Chờ admin duyệt."));
    }

    /**
     * Lấy danh sách nhóm (có phân trang, tìm kiếm, filter)
     */
    @GetMapping
    public ResponseEntity<SuccessResponseDTO<Map<String, Object>>> getAllGroups(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<ResearchGroupDTO> groupsPage = researchGroupService.getAllGroups(keyword, status, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("groups", groupsPage.getContent());
        response.put("currentPage", groupsPage.getNumber());
        response.put("totalItems", groupsPage.getTotalElements());
        response.put("totalPages", groupsPage.getTotalPages());
        response.put("itemsPerPage", groupsPage.getSize());
        response.put("hasNext", groupsPage.hasNext());
        response.put("hasPrevious", groupsPage.hasPrevious());
        // Cannot read properties of undefined (reading 'groups')

        return ResponseEntity.ok(new SuccessResponseDTO<>(response, "Lấy danh sách nhóm thành công"));
    }

    /**
     * Lấy chi tiết nhóm
     */
    @GetMapping("/{groupId}")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> getGroupById(
            @PathVariable Integer groupId) {
        ResearchGroupDTO group = researchGroupService.getGroupById(groupId);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Lấy chi tiết nhóm thành công"));
    }

    /**
     * Lấy danh sách nhóm của user hiện tại
     */
    @GetMapping("/my-groups")
    public ResponseEntity<SuccessResponseDTO<List<ResearchGroupDTO>>> getMyGroups() {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        List<ResearchGroupDTO> groups = researchGroupService.getGroupsByUser(userId);
        return ResponseEntity.ok(new SuccessResponseDTO<>(groups, "Lấy danh sách nhóm thành công"));
    }

    /**
     * Cập nhật thông tin nhóm (Leader hoặc Admin)
     */
    @PutMapping("/{groupId}")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> updateGroup(
            @PathVariable Integer groupId,
            @Valid @RequestBody UpdateResearchGroupRequest request) {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        ResearchGroupDTO group = researchGroupService.updateGroup(groupId, userId, request);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Cập nhật nhóm thành công"));
    }

    /**
     * Thêm thành viên vào nhóm (Leader hoặc Admin)
     */
    @PostMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> addMember(
            @PathVariable Integer groupId,
            @PathVariable Integer memberId) {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        ResearchGroupDTO group = researchGroupService.addMember(groupId, userId, memberId);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Thêm thành viên thành công"));
    }

    /**
     * Xóa thành viên khỏi nhóm (Leader hoặc Admin)
     */
    @DeleteMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> removeMember(
            @PathVariable Integer groupId,
            @PathVariable Integer memberId) {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        ResearchGroupDTO group = researchGroupService.removeMember(groupId, userId, memberId);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Xóa thành viên thành công"));
    }

    /**
     * Lấy thống kê
     */
    @GetMapping("/statistics")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupService.GroupStatistics>> getStatistics() {
        ResearchGroupService.GroupStatistics stats = researchGroupService.getStatistics();
        return ResponseEntity.ok(new SuccessResponseDTO<>(stats, "Lấy thống kê thành công"));
    }

    /**
     * Cập nhật Google Sheet link (chỉ thành viên nhóm mới có quyền)
     */
    @PutMapping("/{groupId}/google-sheet-link")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> updateGoogleSheetLink(
            @PathVariable Integer groupId,
            @RequestBody Map<String, String> request) {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        String googleSheetLink = request.get("link");
        ResearchGroupDTO group = researchGroupService.updateGoogleSheetLink(groupId, userId, googleSheetLink);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Cập nhật link Google Sheet thành công"));
    }

    /**
     * Cập nhật thông tin thành viên (role và participation rate)
     */
    @PutMapping("/{groupId}/members/{memberId}")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> updateMemberInfo(
            @PathVariable Integer groupId,
            @PathVariable Integer memberId,
            @RequestBody Map<String, Object> request) {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        String role = request.get("role") != null ? request.get("role").toString() : null;
        Integer participationRate = request.get("participationRate") != null
                ? Integer.parseInt(request.get("participationRate").toString())
                : null;

        ResearchGroupDTO group = researchGroupService.updateMemberInfo(groupId, userId, memberId, role,
                participationRate);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Cập nhật thông tin thành viên thành công"));
    }

    /**
     * Import thành viên từ Excel
     */
    @PostMapping("/{groupId}/members/import")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> importMembersFromExcel(
            @PathVariable Integer groupId,
            @RequestParam("file") MultipartFile file) {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Vui lòng đăng nhập");
        }

        ResearchGroupDTO group = researchGroupService.importMembersFromExcel(groupId, userId, file);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Import thành viên từ Excel thành công"));
    }
}
