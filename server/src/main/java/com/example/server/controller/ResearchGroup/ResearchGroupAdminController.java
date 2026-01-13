package com.example.server.controller.ResearchGroup;

import com.example.server.DTO.SuccessResponseDTO;
import com.example.server.DTO.response.ResearchGroupDTO;
import com.example.server.service.ResearchGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/research-groups")
@RequiredArgsConstructor
public class ResearchGroupAdminController {

    private final ResearchGroupService researchGroupService;


    @GetMapping
    public ResponseEntity<SuccessResponseDTO<Map<String, Object>>> getAllGroups(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(required = false) String status,
            @RequestParam String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<ResearchGroupDTO> groupsPage = researchGroupService.getAllGroups(keyword, status, type, pageable);

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

    @GetMapping("/statistics")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupService.GroupStatistics>> getStatistics() {
        ResearchGroupService.GroupStatistics stats = researchGroupService.getStatistics();
        return ResponseEntity.ok(new SuccessResponseDTO<>(stats, "Lấy thống kê thành công"));
    }

    /**
     * Admin duyệt nhóm
     */
    @PutMapping("/{groupId}/approve")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> approveGroup(
            @PathVariable Integer groupId
    ) {
        ResearchGroupDTO group = researchGroupService.approveGroup(groupId);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Duyệt nhóm thành công"));
    }

    /**
     * Admin từ chối nhóm
     */
    @PutMapping("/{groupId}/reject")
    public ResponseEntity<SuccessResponseDTO<ResearchGroupDTO>> rejectGroup(
            @PathVariable Integer groupId,
            @RequestParam(required = false) String reason
    ) {
        ResearchGroupDTO group = researchGroupService.rejectGroup(groupId, reason);
        return ResponseEntity.ok(new SuccessResponseDTO<>(group, "Từ chối nhóm thành công"));
    }

    /**
     * Admin xóa nhóm
     */
    @DeleteMapping("/{groupId}")
    public ResponseEntity<SuccessResponseDTO<Void>> deleteGroup(
            @PathVariable Integer groupId
    ) {
        researchGroupService.deleteGroup(groupId);
        return ResponseEntity.ok(new SuccessResponseDTO<>(null, "Xóa nhóm thành công"));
    }
}
